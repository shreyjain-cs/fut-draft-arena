import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FORMATIONS } from '@/lib/formations';

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

interface NewPitchProps {
  squad: DraftedPlayer[];
  formation: keyof typeof FORMATIONS;
  onBack: () => void;
}

export const NewPitch = ({ squad, formation, onBack }: NewPitchProps) => {
  const getPlayerForPosition = (position: string) => {
    return squad.find(p => p.position === position);
  };

  const currentFormation = FORMATIONS[formation];

  return (
    <div className="relative w-full h-full bg-pitch-dark rounded-lg overflow-hidden shadow-inner shadow-black/50">
      <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-2 left-2 z-10 text-white">
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <div className="absolute inset-0 bg-no-repeat bg-center bg-contain" style={{ backgroundImage: 'url(/pitch-lines.svg)' }}></div>
      <div className="relative w-full h-full">
        {Object.entries(currentFormation).map(([position, style]) => {
          const player = getPlayerForPosition(position);
          return (
            <div
              key={position}
              style={{ position: 'absolute', ...style, transform: 'translate(-50%, -50%)' }}
              className="w-16 h-16 flex flex-col items-center"
            >
              {player ? (
                <div className="relative">
                  <img src={player.image || './placeholder.png'} alt={player.name} className="w-12 h-12 rounded-full border-2 border-gold" />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/50 px-2 py-0.5 rounded-md text-white text-xs font-bold">
                    {player.name} ({player.display_rating})
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