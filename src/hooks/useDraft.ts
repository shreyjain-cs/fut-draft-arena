import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DraftedPlayer {
  player_slug: string;
  full_name: string;
  overall_rating: number;
  purchase_price: number;
  [key: string]: any; // Make it compatible with JSON
}

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

export const useDraft = () => {
  const { toast } = useToast();
  const [draftId, setDraftId] = useState<string | null>(null);
  const [purse, setPurse] = useState(500000000);
  const [squad, setSquad] = useState<DraftedPlayer[]>([]);
  const [isActive, setIsActive] = useState(false);

  // Load existing draft on mount
  useEffect(() => {
    loadExistingDraft();
  }, []);

  const loadExistingDraft = async () => {
    try {
      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('draft_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setDraftId(data.id);
        setPurse(data.purse);
        setSquad((data.squad as DraftedPlayer[]) || []);
        setIsActive(true);
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  const startDraft = async () => {
    try {
      const { data, error } = await supabase
        .from('drafts')
        .insert({
          purse: 500000000,
          formation: '4-3-3',
          squad: [],
          consecutive_wrong_answers: 0,
          draft_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setDraftId(data.id);
      setPurse(500000000);
      setSquad([]);
      setIsActive(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start draft",
        variant: "destructive"
      });
    }
  };

  const buyPlayer = async (player: Player) => {
    if (!draftId) return;

    const playerValue = parseFloat(player.value);
    
    if (playerValue > purse) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough money to buy this player",
        variant: "destructive"
      });
      return;
    }

    if (squad.some(p => p.full_name === player.full_name)) {
      toast({
        title: "Player Already Owned",
        description: "You already have this player in your squad",
        variant: "destructive"
      });
      return;
    }

    try {
      const newPlayer: DraftedPlayer = {
        player_slug: player.id.toString(),
        full_name: player.full_name,
        overall_rating: player.overall_rating,
        purchase_price: playerValue
      };

      const newSquad = [...squad, newPlayer];
      const newPurse = purse - playerValue;

      const { error } = await supabase
        .from('drafts')
        .update({
          purse: newPurse,
          squad: newSquad as any
        })
        .eq('id', draftId);

      if (error) throw error;

      setSquad(newSquad);
      setPurse(newPurse);

      toast({
        title: "Player Purchased!",
        description: `${player.full_name} added to your squad`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to buy player",
        variant: "destructive"
      });
    }
  };

  const sellPlayer = async (playerSlug: string) => {
    if (!draftId) return;

    const playerToSell = squad.find(p => p.player_slug === playerSlug);
    if (!playerToSell) return;

    try {
      const sellPrice = playerToSell.purchase_price * 0.8; // 20% loss on sale
      const newSquad = squad.filter(p => p.player_slug !== playerSlug);
      const newPurse = purse + sellPrice;

      const { error } = await supabase
        .from('drafts')
        .update({
          purse: newPurse,
          squad: newSquad as any
        })
        .eq('id', draftId);

      if (error) throw error;

      setSquad(newSquad);
      setPurse(newPurse);

      toast({
        title: "Player Sold",
        description: `${playerToSell.full_name} sold for €${(sellPrice / 1000000).toFixed(1)}M`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sell player",
        variant: "destructive"
      });
    }
  };

  const stopDraft = async () => {
    if (!draftId) return;

    try {
      const { error } = await supabase
        .from('drafts')
        .update({
          draft_active: false,
          end_time: new Date().toISOString()
        })
        .eq('id', draftId);

      if (error) throw error;

      setIsActive(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop draft",
        variant: "destructive"
      });
    }
  };

  // Set up real-time updates for the current draft
  useEffect(() => {
    if (!draftId) return;

    const channel = supabase
      .channel('draft-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'drafts',
          filter: `id=eq.${draftId}`
        },
        (payload) => {
          const newData = payload.new as any;
          setPurse(newData.purse);
          setSquad((newData.squad as DraftedPlayer[]) || []);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [draftId]);

  return {
    draftId,
    purse,
    squad,
    isActive,
    startDraft,
    buyPlayer,
    sellPlayer,
    stopDraft
  };
};