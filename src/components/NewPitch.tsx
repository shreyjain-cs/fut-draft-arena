import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DraftedPlayer {
  player_slug: string;
  name: string;
  overall_rating: number;
  purchase_price: number;
  best_position: string;
  position?: string;
  image?: string;
}

interface NewPitchProps {
  squad: DraftedPlayer[];
  onBack: () => void;
}

const FORMATION = {
  GK: { top: '85%', left: '50%' },
  LB: { top: '70%', left: '15%' },
  CB1: { top: '70%', left: '35%' },
  CB2: { top: '70%', left: '65%' },
  RB: { top: '70%', left: '85%' },
  CM1: { top: '50%', left: '35%' },
  CM2: { top: '50%', left: '65%' },
  CAM: { top: '35%', left: '50%' },
  LW: { top: '20%', left: '15%' },
  RW: { top: '20%', left: '85%' },
  ST: { top: '5%', left: '50%' },
};

export const NewPitch = ({ squad, onBack }: NewPitchProps) => {
  const getPlayerForPosition = (position: string) => {
    // This is a simplified logic. In a real app, you'd have a more robust way to assign players to positions.
    return squad.find(p => p.best_position === position);
  };

  return (
    <div className="relative w-full h-full bg-pitch-dark rounded-lg overflow-hidden shadow-inner shadow-black/50">
      <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-2 left-2 z-10 text-white">
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <div className="absolute inset-0 bg-no-repeat bg-center bg-contain" style={{ backgroundImage: 'url(/pitch-lines.svg)' }}></div>
      <div className="relative w-full h-full">
        {Object.entries(FORMATION).map(([position, style]) => {
          const player = getPlayerForPosition(position);
          return (
            <div
              key={position}
              style={{ position: 'absolute', ...style, transform: 'translate(-50%, -50%)' }}
              className="w-16 h-16 flex flex-col items-center"
            >
              {player ? (
                <div className="relative">
                  <img src={player.image} alt={player.name} className="w-12 h-12 rounded-full border-2 border-gold" />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/50 px-2 py-0.5 rounded-md text-white text-xs font-bold">
                    {player.name}
                  </div>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center">
                  <span className="text-white/50 text-xs font-bold">{position}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};