import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins } from "lucide-react";

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

interface PlayerCardProps {
  player: Player;
  onBuyPlayer: (player: Player) => void;
  disabled: boolean;
}

export const PlayerCard = ({ player, onBuyPlayer, disabled }: PlayerCardProps) => {
  const formatCurrency = (value: string) => {
    const numberValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (value.includes('M')) {
      return `€${numberValue}M`;
    }
    return `€${(numberValue / 1000000).toFixed(1)}M`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 85) return "bg-gold text-primary-foreground";
    if (rating >= 80) return "bg-silver text-primary-foreground";
    return "bg-bronze text-primary-foreground";
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50 ${disabled ? 'opacity-50' : 'hover:border-pitch-green/30'} transition-colors`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-700 flex-shrink-0">
          {getInitials(player.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-foreground truncate">
              {player.name}
            </h4>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge className={`${getRatingColor(player.overall_rating)}`}>{player.overall_rating} OVR</Badge>
            <Badge variant="outline">{player.best_position}</Badge>
            <span className="text-xs text-muted-foreground">{player.club_name}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className="font-bold text-foreground text-sm">{formatCurrency(player.value)}</p>
          <p className="text-xs text-muted-foreground">Market Value</p>
        </div>
        <Button
          size="sm"
          onClick={() => onBuyPlayer(player)}
          disabled={disabled}
          className="bg-gradient-to-r from-pitch-green to-pitch-dark hover:from-pitch-dark hover:to-pitch-green text-primary-foreground font-semibold"
        >
          <Coins className="w-4 h-4 mr-1" /> Buy
        </Button>
      </div>
    </div>
  );
};