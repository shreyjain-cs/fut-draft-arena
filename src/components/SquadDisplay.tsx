import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trash2, Shield, LayoutGrid, List } from "lucide-react";
import { NewPitch } from '@/components/NewPitch';

interface DraftedPlayer {
  player_slug: string;
  name: string;
  overall_rating: number;
  purchase_price: number;
  best_position: string;
  position?: string;
  image?: string;
}

interface SquadDisplayProps {
  squad: DraftedPlayer[];
  onSellPlayer: (playerSlug: string) => void;
}

export const SquadDisplay = ({ squad, onSellPlayer }: SquadDisplayProps) => {
  const [view, setView] = useState('list'); // 'list' or 'field'

  const formatCurrency = (amount: number) => {
    return `€${(amount / 1000000).toFixed(1)}M`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 85) return "text-gold";
    if (rating >= 80) return "text-silver";
    return "text-muted-foreground";
  };

  const averageRating = squad.length > 0 
    ? Math.round(squad.reduce((sum, player) => sum + player.overall_rating, 0) / squad.length)
    : 0;

  return (
    <Card className="bg-gradient-to-br from-card to-card/80 border-border shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-pitch-green" />
            Squad ({squad.length}/11)
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
              {squad.map((player, index) => (
                <div
                  key={`${player.player_slug}-${index}`}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50 hover:border-pitch-green/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground truncate text-sm">
                        {player.name}
                      </h4>
                      <Badge className={`${getRatingColor(player.overall_rating)} bg-card border-border text-xs font-bold`}>
                        {player.overall_rating}
                      </Badge>
                      <Badge variant="outline">{player.best_position}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Bought for {formatCurrency(player.purchase_price)}
                    </p>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSellPlayer(player.player_slug)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="h-[500px]">
            <NewPitch squad={squad} onBack={() => setView('list')} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};