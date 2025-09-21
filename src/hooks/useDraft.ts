import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isDefender, isMidfielder, isForward, POSITION_GROUPS } from "@/lib/position-groups";
import { FORMATIONS } from "@/lib/formations";

interface Player {
  id: number;
  name: string;
  full_name: string;
  image: string;
  overall_rating: number;
  value: string;
  best_position: string;
  club_name: string;
  club_logo: string;
  country_flag: string;
}

interface DraftedPlayer {
  player_slug: string;
  name: string;
  purchase_price: number;
  best_position: string;
  position?: string;
  image?: string;
  overall_rating: number;
  original_overall_rating?: number;
  display_rating: number;
}

export type GameMode = 'classic' | 'wildcard';

export const useDraft = () => {
  const { toast } = useToast();
  const [draftId, setDraftId] = useState<string | null>(null);
  const [purse, setPurse] = useState(500000000);
  const [squad, setSquad] = useState<DraftedPlayer[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [bonusMoney, setBonusMoney] = useState(0);
  const [formation, setFormation] = useState<keyof typeof FORMATIONS>('4-3-3');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [targetOvr, setTargetOvr] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);

  const assignPositions = useCallback((squad: DraftedPlayer[], formation: keyof typeof FORMATIONS) => {
    let playersToProcess = squad.map(p => ({
      ...p,
      position: undefined,
      display_rating: p.original_overall_rating || p.overall_rating,
    }));
    let availablePositions = Object.keys(FORMATIONS[formation]);
    const assignedPlayers: DraftedPlayer[] = [];

    // First pass: assign players to their best positions
    const unassignedAfterFirstPass: DraftedPlayer[] = [];
    playersToProcess.forEach(player => {
      const bestPos = player.best_position.split(', ')[0];
      const positionIndex = availablePositions.indexOf(bestPos);

      if (positionIndex !== -1) {
        player.position = bestPos;
        player.display_rating = player.original_overall_rating || player.overall_rating;
        assignedPlayers.push(player);
        availablePositions.splice(positionIndex, 1);
      } else {
        unassignedAfterFirstPass.push(player);
      }
    });

    // Second pass: assign remaining players to alternative positions
    const unassignedAfterSecondPass: DraftedPlayer[] = [];
    unassignedAfterFirstPass.forEach(player => {
      const bestPos = player.best_position.split(', ')[0];
      const alternativePositions = POSITION_GROUPS[bestPos as keyof typeof POSITION_GROUPS] || [];
      let isAssigned = false;

      for (const altPos of alternativePositions) {
        const positionIndex = availablePositions.indexOf(altPos);
        if (positionIndex !== -1) {
          player.position = altPos;
          player.display_rating = Math.round((player.original_overall_rating || player.overall_rating) * 0.9);
          assignedPlayers.push(player);
          availablePositions.splice(positionIndex, 1);
          isAssigned = true;
          break;
        }
      }
      if (!isAssigned) {
        unassignedAfterSecondPass.push(player);
      }
    });

    return [...assignedPlayers, ...unassignedAfterSecondPass].sort((a,b) => (squad.findIndex(p => p.player_slug === a.player_slug)) - (squad.findIndex(p => p.player_slug === b.player_slug)));
  }, []);


  const refreshBudget = useCallback(async () => {
    if (!draftId) return;
    try {
      const { data, error } = await supabase
        .from('drafts')
        .select('purse')
        .eq('id', draftId)
        .single();
      if (error) throw error;
      if (data) {
        setPurse(data.purse);
      }
    } catch (error) {
      toast({ title: "Could not refresh budget.", variant: "destructive" });
    }
  }, [draftId, toast]);

  const stopDraft = useCallback(async (username?: string) => {
    if (draftId) {
      try {
        const finalScore = purse + bonusMoney;
        const { error } = await supabase
          .from('drafts')
          .update({ draft_active: false, end_time: new Date().toISOString() })
          .eq('id', draftId);
        if (error) throw error;

        // Save to leaderboard
        if (username) {
          const { error: leaderboardError } = await supabase
            .from('leaderboard')
            .insert([{ username, score: finalScore }]);
          if (leaderboardError) throw leaderboardError;
        }

        setIsActive(false);
      } catch (error) {
        toast({ title: "Error stopping draft", variant: "destructive" });
      }
    }
  }, [draftId, toast, purse, bonusMoney]);

  useEffect(() => {
    if (isActive && gameMode === 'wildcard') {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            stopDraft('Wildcard Player');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isActive, gameMode, stopDraft]);

  const startDraft = useCallback(async (mode: GameMode) => {
    setGameMode(mode);
    let initialPurse = 500000000;

    if (mode === 'wildcard') {
      const randomOvr = Math.floor(Math.random() * (88 - 80 + 1)) + 80;
      setTargetOvr(randomOvr);
      initialPurse = 1000000000;
      setTimeLeft(300);
    }

    try {
      const { data, error } = await supabase
        .from('drafts')
        .insert([{ purse: initialPurse }])
        .select();
      if (error) throw error;
      const newDraftId = data[0].id;
      setDraftId(newDraftId);
      setPurse(initialPurse);
      setSquad([]);
      setIsActive(true);
      setBonusMoney(0);
    } catch (error) {
      toast({ title: "Error starting draft", variant: "destructive" });
    }
  }, [toast]);

  const resetDraft = useCallback(() => {
    setDraftId(null);
    setIsActive(false);
    setSquad([]);
    setPurse(500000000);
    setGameMode('classic');
    setTargetOvr(0);
    setTimeLeft(300);
    setBonusMoney(0);
  }, []);

  const canBuyPlayer = useCallback((player: Player): boolean => {
    if (squad.some(p => p.player_slug === player.name)) {
      return false;
    }
    if (squad.length >= 11) {
      return false;
    }

    const newPlayer: DraftedPlayer = {
      player_slug: player.name,
      name: player.name,
      overall_rating: player.overall_rating,
      original_overall_rating: player.overall_rating,
      display_rating: player.overall_rating,
      purchase_price: 0,
      best_position: player.best_position,
    };

    const tempSquad = [...squad, newPlayer];
    const assignedSquad = assignPositions(tempSquad, formation);
    const newPlayerInAssignedSquad = assignedSquad.find(p => p.player_slug === newPlayer.player_slug);

    if (!newPlayerInAssignedSquad || !newPlayerInAssignedSquad.position) {
      return false;
    }

    const formationPositions = Object.keys(FORMATIONS[formation]);
    const maxDefenders = formationPositions.filter(p => isDefender(p)).length;
    const maxMidfielders = formationPositions.filter(p => isMidfielder(p)).length;
    const maxForwards = formationPositions.filter(p => isForward(p)).length;

    const numDefenders = assignedSquad.filter(p => p.position && isDefender(p.position)).length;
    const numMidfielders = assignedSquad.filter(p => p.position && isMidfielder(p.position)).length;
    const numForwards = assignedSquad.filter(p => p.position && isForward(p.position)).length;

    if (numDefenders > maxDefenders) return false;
    if (numMidfielders > maxMidfielders) return false;
    if (numForwards > maxForwards) return false;

    return true;
  }, [squad, formation, assignPositions]);

  const buyPlayer = useCallback(async (player: Player) => {
    const price = parseFloat(player.value.replace(/[^0-9.]/g, '')) * (player.value.includes('M') ? 1000000 : 1);
    if (purse < price) {
      toast({ title: "Not enough funds", variant: "destructive" });
      return;
    }
    
    if (!canBuyPlayer(player)) {
      toast({ title: "Cannot add player", description: "No available slot for this player in your formation.", variant: "destructive" });
      return;
    }

    const newPlayer: DraftedPlayer = {
      player_slug: player.name,
      name: player.name,
      overall_rating: player.overall_rating,
      original_overall_rating: player.overall_rating,
      display_rating: player.overall_rating,
      purchase_price: price,
      best_position: player.best_position,
    };

    const tempSquad = [...squad, newPlayer];
    const assignedSquad = assignPositions(tempSquad, formation);

    const newPurse = purse - price;
    setPurse(newPurse);
    setSquad(assignedSquad);

    try {
      const { error } = await supabase
        .from('drafts')
        .update({ purse: newPurse, squad: assignedSquad })
        .eq('id', draftId);
      if (error) throw error;

      toast({ title: "Player Purchased!" });
    } catch (error) {
      toast({ title: "Error buying player", variant: "destructive" });
      // Revert state if DB operations fail
      setPurse(purse);
      setSquad(squad);
    }
  }, [draftId, purse, squad, toast, formation, assignPositions, canBuyPlayer]);

  const sellPlayer = useCallback(async (playerSlug: string) => {
    const playerToSell = squad.find(p => p.player_slug === playerSlug);
    if (!playerToSell) return;

    const newPurse = purse + playerToSell.purchase_price;
    const newSquad = squad.filter(p => p.player_slug !== playerSlug);
    const assignedSquad = assignPositions(newSquad, formation);

    setPurse(newPurse);
    setSquad(assignedSquad);

    try {
      const { error } = await supabase
        .from('drafts')
        .update({ purse: newPurse, squad: assignedSquad })
        .eq('id', draftId);
      if (error) throw error;

      toast({ title: "Player Sold!" });
    } catch (error) {
      toast({ title: "Error selling player", variant: "destructive" });
      setPurse(purse);
      setSquad(squad);
    }
  }, [draftId, purse, squad, toast, formation, assignPositions]);

  useEffect(() => {
    const newSquad = assignPositions(squad, formation);
    if (JSON.stringify(newSquad) !== JSON.stringify(squad)) {
      setSquad(newSquad);
    }
  }, [formation, assignPositions, squad]);


  const addBonusMoney = useCallback((amount: number) => {
    setBonusMoney(prev => prev + amount);
  }, []);

  return { draftId, purse, squad, setSquad, isActive, startDraft, buyPlayer, sellPlayer, stopDraft, refreshBudget, bonusMoney, addBonusMoney, formation, setFormation, canBuyPlayer, gameMode, targetOvr, timeLeft, resetDraft };
};
