import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trash2, Shield, LayoutGrid, List } from "lucide-react";
import { NewPitch } from '@/components/NewPitch';
import { formationOptions, FORMATIONS } from '@/lib/formations';
import { POSITION_GROUPS } from '@/lib/position-groups';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface SquadDisplayProps {
  squad: DraftedPlayer[];
  onSellPlayer: (playerSlug: string) => void;
  onSquadChange: (squad: DraftedPlayer[]) => void;
}

export const SquadDisplay = ({ squad, onSellPlayer, onSquadChange }: SquadDisplayProps) => {
  const [view, setView] = useState('list');
  const [formation, setFormation] = useState<keyof typeof FORMATIONS>('4-3-3');

  useEffect(() => {
    const assignPositions = () => {
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

      const finalSquad = [...assignedPlayers, ...unassignedAfterSecondPass].sort((a,b) => (squad.findIndex(p => p.player_slug === a.player_slug)) - (squad.findIndex(p => p.player_slug === b.player_slug)));
      
      const squadChanged = JSON.stringify(squad) !== JSON.stringify(finalSquad);

      if (squadChanged) {
        onSquadChange(finalSquad);
      }
    };
    
    assignPositions();
  }, [squad, formation, onSquadChange]);

  const formatCurrency = (amount: number) => {
    return `€${(amount / 1000000).toFixed(1)}M`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 85) return "text-gold";
    if (rating >= 80) return "text-silver";
    return "text-muted-foreground";
  };

  const averageRating = squad.length > 0 
    ? Math.round(squad.reduce((sum, player) => sum + (player.display_rating || player.overall_rating), 0) / squad.length)
    : 0;
  
  const sortedSquad = useMemo(() => {
    return [...squad].sort((a, b) => {
      if (a.position && !b.position) return -1;
      if (!a.position && b.position) return 1;
      return (b.original_overall_rating || b.overall_rating) - (a.original_overall_rating || a.overall_rating);
    });
  }, [squad]);


  return (
    <Card className="bg-gradient-to-br from-card to-card/80 border-border shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-pitch-green" />
            Squad ({squad.filter(p=>p.position).length}/{Object.keys(FORMATIONS[formation]).length})
          </div>
          <div className="flex items-center gap-2">
            {squad.length > 0 && (
              <Badge className={`${getRatingColor(averageRating)} bg-card border-border font-bold`}>
                {averageRating} OVR
              </Badge>
            )}
            <Button variant="ghost" size="icon" onClick={() => setView(view === 'list' ? 'field' : 'list')}>
              {view === 'list' ? <LayoutGrid className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {view === 'list' ? (
          squad.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No players in squad</p>
              <p className="text-sm text-muted-foreground">Start buying players to build your team</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {sortedSquad.map((player) => (
                <div
                  key={player.player_slug}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50 hover:border-pitch-green/30 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={player.image || './placeholder.png'} alt={player.name} className="w-12 h-12 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground truncate text-sm">
                          {player.name}
                        </h4>
                        <Badge className={`${getRatingColor(player.display_rating)} bg-card border-border text-xs font-bold`}>
                          {player.display_rating}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        Bought for {formatCurrency(player.purchase_price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <Badge variant="outline">{player.best_position}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onSellPlayer(player.player_slug)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="h-[500px]">
            <div className="mb-4">
              <Select value={formation} onValueChange={(value) => setFormation(value as keyof typeof FORMATIONS)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select formation" />
                </SelectTrigger>
                <SelectContent>
                  {formationOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <NewPitch squad={squad} formation={formation} onBack={() => setView('list')} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};