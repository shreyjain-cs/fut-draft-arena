import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Shield } from "lucide-react";

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
  disabled?: boolean;
}

export const PlayerCard = ({ player, onBuyPlayer, disabled }: PlayerCardProps) => {
  const formatValue = (value: string) => {
    const num = parseFloat(value);
    return `€${(num / 1000000).toFixed(1)}M`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 85) return "text-gold";
    if (rating >= 80) return "text-silver";
    return "text-muted-foreground";
  };

  const getPositionColor = (position: string) => {
    const colors: { [key: string]: string } = {
      'GK': 'bg-yellow-500/20 text-yellow-300',
      'CB': 'bg-red-500/20 text-red-300',
      'LB': 'bg-red-500/20 text-red-300',
      'RB': 'bg-red-500/20 text-red-300',
      'CDM': 'bg-blue-500/20 text-blue-300',
      'CM': 'bg-blue-500/20 text-blue-300',
      'CAM': 'bg-green-500/20 text-green-300',
      'LM': 'bg-green-500/20 text-green-300',
      'RM': 'bg-green-500/20 text-green-300',
      'LW': 'bg-green-500/20 text-green-300',
      'RW': 'bg-green-500/20 text-green-300',
      'ST': 'bg-purple-500/20 text-purple-300',
      'CF': 'bg-purple-500/20 text-purple-300',
      'LWB': 'bg-orange-500/20 text-orange-300',
      'RWB': 'bg-orange-500/20 text-orange-300'
    };
    return colors[position] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card className={`group bg-gradient-to-br from-card to-card/80 border-border hover:border-pitch-green/50 transition-all duration-300 ${disabled ? 'opacity-50' : 'hover:shadow-[var(--shadow-pitch)]'}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Player Image & Rating */}
          <div className="relative">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              {player.image ? (
                <img 
                  src={player.image} 
                  alt={player.full_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <Shield className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <Badge className={`absolute -top-2 -right-2 ${getRatingColor(player.overall_rating)} bg-card border-border text-xs font-bold min-w-[2rem] justify-center`}>
              {player.overall_rating}
            </Badge>
          </div>

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{player.full_name}</h3>
              <Badge className={`${getPositionColor(player.best_position)} text-xs font-semibold`}>
                {player.best_position}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              {player.country_flag && (
                <img 
                  src={player.country_flag} 
                  alt="Country" 
                  className="w-4 h-3 object-cover rounded-sm"
                />
              )}
              <MapPin className="w-3 h-3" />
              <span className="truncate">{player.club_name}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-gold fill-gold" />
                <span className="text-sm font-semibold text-foreground">{formatValue(player.value)}</span>
              </div>
              
              <Button
                size="sm"
                onClick={() => onBuyPlayer(player)}
                disabled={disabled}
                className="bg-gradient-to-r from-pitch-green to-pitch-dark hover:from-pitch-dark hover:to-pitch-green text-primary-foreground font-semibold"
              >
                {disabled ? 'Owned' : 'Buy'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};