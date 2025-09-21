import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isDefender, isMidfielder, isForward } from "@/lib/position-groups";

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

const MAX_DEFENDERS = 4;
const MAX_MIDFIELDERS = 4;
const MAX_FORWARDS = 3;

export const useDraft = () => {
  const { toast } = useToast();
  const [draftId, setDraftId] = useState<string | null>(null);
  const [purse, setPurse] = useState(500000000);
  const [squad, setSquad] = useState<DraftedPlayer[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [bonusMoney, setBonusMoney] = useState(0);

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

  const startDraft = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('drafts')
        .insert([{ purse: 500000000 }])
        .select();
      if (error) throw error;
      const newDraftId = data[0].id;
      setDraftId(newDraftId);
      setPurse(500000000);
      setSquad([]);
      setIsActive(true);
      setBonusMoney(0);
    } catch (error) {
      toast({ title: "Error starting draft", variant: "destructive" });
    }
  }, [toast]);

  const buyPlayer = useCallback(async (player: Player) => {
    if (squad.some(p => p.player_slug === player.name)) {
      toast({ title: "Player already in squad", variant: "destructive" });
      return;
    }

    const price = parseFloat(player.value.replace(/[^0-9.]/g, '')) * (player.value.includes('M') ? 1000000 : 1);
    if (purse < price) {
      toast({ title: "Not enough funds", variant: "destructive" });
      return;
    }
    if (squad.length >= 11) {
      toast({ title: "Squad is full", variant: "destructive" });
      return;
    }

    const numDefenders = squad.filter(p => isDefender(p.best_position)).length;
    const numMidfielders = squad.filter(p => isMidfielder(p.best_position)).length;
    const numForwards = squad.filter(p => isForward(p.best_position)).length;

    if (isDefender(player.best_position) && numDefenders >= MAX_DEFENDERS) {
      toast({ title: "You can't have more than 4 defenders", variant: "destructive" });
      return;
    }

    if (isMidfielder(player.best_position) && numMidfielders >= MAX_MIDFIELDERS) {
      toast({ title: "You can't have more than 4 midfielders", variant: "destructive" });
      return;
    }

    if (isForward(player.best_position) && numForwards >= MAX_FORWARDS) {
      toast({ title: "You can't have more than 3 forwards", variant: "destructive" });
      return;
    }


    const newPurse = purse - price;
    const newPlayer: DraftedPlayer = {
      player_slug: player.name,
      name: player.name,
      overall_rating: player.overall_rating,
      original_overall_rating: player.overall_rating,
      display_rating: player.overall_rating,
      purchase_price: price,
      best_position: player.best_position,
    };
    const newSquad = [...squad, newPlayer];

    setPurse(newPurse);
    setSquad(newSquad);

    try {
      const { error } = await supabase
        .from('drafts')
        .update({ purse: newPurse, squad: newSquad })
        .eq('id', draftId);
      if (error) throw error;

      toast({ title: "Player Purchased!" });
    } catch (error) {
      toast({ title: "Error buying player", variant: "destructive" });
      // Revert state if DB operations fail
      setPurse(purse);
      setSquad(squad);
    }
  }, [draftId, purse, squad, toast]);

  const sellPlayer = useCallback(async (playerSlug: string) => {
    const playerToSell = squad.find(p => p.player_slug === playerSlug);
    if (!playerToSell) return;

    const newPurse = purse + playerToSell.purchase_price;
    const newSquad = squad.filter(p => p.player_slug !== playerSlug);

    setPurse(newPurse);
    setSquad(newSquad);

    try {
      const { error } = await supabase
        .from('drafts')
        .update({ purse: newPurse, squad: newSquad })
        .eq('id', draftId);
      if (error) throw error;

      toast({ title: "Player Sold!" });
    } catch (error) {
      toast({ title: "Error selling player", variant: "destructive" });
      setPurse(purse);
      setSquad(squad);
    }
  }, [draftId, purse, squad, toast]);

  const addBonusMoney = useCallback((amount: number) => {
    setBonusMoney(prev => prev + amount);
  }, []);

  const stopDraft = useCallback(async (username: string) => {
    if (draftId) {
      try {
        const finalScore = purse + bonusMoney;
        const { error } = await supabase
          .from('drafts')
          .update({ draft_active: false, end_time: new Date().toISOString() })
          .eq('id', draftId);
        if (error) throw error;

        // Save to leaderboard
        const { error: leaderboardError } = await supabase
          .from('leaderboard')
          .insert([{ username, score: finalScore }]);
        if (leaderboardError) throw leaderboardError;

        setIsActive(false);
      } catch (error) {
        toast({ title: "Error stopping draft", variant: "destructive" });
      }
    }
  }, [draftId, toast, purse, bonusMoney]);

  return { draftId, purse, squad, setSquad, isActive, startDraft, buyPlayer, sellPlayer, stopDraft, refreshBudget, bonusMoney, addBonusMoney };
};