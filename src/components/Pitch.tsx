import { useDrop, useDrag } from 'react-dnd';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DraftedPlayer {
  player_slug: string;
  full_name: string;
  overall_rating: number;
  purchase_price: number;
  best_position: string;
  position?: string;
}

interface PlayerProps {
  player: DraftedPlayer;
  isOutOfPosition: boolean;
  position: string;
}

const Player = ({ player, isOutOfPosition, position }: PlayerProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'player',
    item: { id: player.player_slug },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const ovr = isOutOfPosition ? Math.round(player.overall_rating * 0.9) : player.overall_rating;

  return (
    <div
      ref={drag}
      className={`relative flex flex-col items-center justify-center w-16 h-20 p-1 rounded-lg shadow-lg cursor-move ${isDragging ? 'opacity-50' : ''}`}>
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-700 mb-1">
        {position}
      </div>
      <p className="text-xs font-bold text-white truncate w-full text-center">{player.full_name}</p>
      <div className={`absolute top-0 right-0 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${isOutOfPosition ? 'bg-red-500' : 'bg-blue-500'}`}>{ovr}</div>
    </div>
  );
};

interface PositionBoxProps {
  position: string;
  player: DraftedPlayer | null;
  onPlayerMove: (playerSlug: string, newPosition: string) => void;
  isOutOfPosition: boolean;
}

const PositionBox = ({ position, player, onPlayerMove, isOutOfPosition }: PositionBoxProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'player',
    drop: (item: { id: string }) => onPlayerMove(item.id, position),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className={`absolute w-20 h-24 flex items-center justify-center ${isOver ? 'bg-green-500/50' : ''}`}>
      {player ? <Player player={player} isOutOfPosition={isOutOfPosition} position={position} /> : <p className="text-white/50 text-sm font-bold">{position}</p>}
    </div>
  );
};

interface PitchProps {
  squad: DraftedPlayer[];
  formation: string;
  onPlayerMove: (playerSlug: string, newPosition: string) => void;
  onFormationChange: (formation: string) => void;
}

const FORMATIONS = {
  '4-3-3': { GK: { top: '5%', left: '50%' }, LB: { top: '25%', left: '20%' }, CB1: { top: '25%', left: '40%' }, CB2: { top: '25%', left: '60%' }, RB: { top: '25%', left: '80%' }, CM1: { top: '50%', left: '35%' }, CM2: { top: '50%', left: '65%' }, CAM: { top: '50%', left: '50%' }, LW: { top: '75%', left: '20%' }, RW: { top: '75%', left: '80%' }, ST: { top: '75%', left: '50%' } },
  '4-1-2-1-2': { GK: { top: '5%', left: '50%' }, LB: { top: '25%', left: '20%' }, CB1: { top: '25%', left: '40%' }, CB2: { top: '25%', left: '60%' }, RB: { top: '25%', left: '80%' }, CDM: { top: '40%', left: '50%' }, LM: { top: '55%', left: '30%' }, RM: { top: '55%', left: '70%' }, CAM: { top: '70%', left: '50%' }, ST1: { top: '85%', left: '40%' }, ST2: { top: '85%', left: '60%' } },
  '4-4-1-1': { GK: { top: '5%', left: '50%' }, LB: { top: '25%', left: '20%' }, CB1: { top: '25%', left: '40%' }, CB2: { top: '25%', left: '60%' }, RB: { top: '25%', left: '80%' }, LM: { top: '50%', left: '20%' }, CM1: { top: '50%', left: '40%' }, CM2: { top: '50%', left: '60%' }, RM: { top: '50%', left: '80%' }, CF: { top: '70%', left: '50%' }, ST: { top: '85%', left: '50%' } },
  '5-4-1': { GK: { top: '5%', left: '50%' }, LWB: { top: '25%', left: '15%' }, CB1: { top: '25%', left: '35%' }, CB2: { top: '25%', left: '50%' }, CB3: { top: '25%', left: '65%' }, RWB: { top: '25%', left: '85%' }, LM: { top: '50%', left: '25%' }, CM1: { top: '50%', left: '45%' }, CM2: { top: '50%', left: '65%' }, RM: { top: '50%', left: '85%' }, ST: { top: '75%', left: '50%' } },
  '3-5-2': { GK: { top: '5%', left: '50%' }, CB1: { top: '25%', left: '35%' }, CB2: { top: '25%', left: '50%' }, CB3: { top: '25%', left: '65%' }, LM: { top: '50%', left: '20%' }, CM1: { top: '50%', left: '40%' }, CM2: { top: '50%', left: '60%' }, RM: { top: '50%', left: '80%' }, CAM: { top: '50%', left: '50%' }, ST1: { top: '75%', left: '40%' }, ST2: { top: '75%', left: '60%' } },
  '5-3-2': { GK: { top: '5%', left: '50%' }, LWB: { top: '25%', left: '15%' }, CB1: { top: '25%', left: '35%' }, CB2: { top: '25%', left: '50%' }, CB3: { top: '25%', left: '65%' }, RWB: { top: '25%', left: '85%' }, CM1: { top: '50%', left: '35%' }, CM2: { top: '50%', left: '65%' }, CAM: { top: '50%', left: '50%' }, ST1: { top: '75%', left: '40%' }, ST2: { top: '75%', left: '60%' } },
  '4-4-2': { GK: { top: '5%', left: '50%' }, LB: { top: '25%', left: '20%' }, CB1: { top: '25%', left: '40%' }, CB2: { top: '25%', left: '60%' }, RB: { top: '25%', left: '80%' }, LM: { top: '50%', left: '20%' }, CM1: { top: '50%', left: '40%' }, CM2: { top: '50%', left: '60%' }, RM: { top: '50%', left: '80%' }, ST1: { top: '75%', left: '40%' }, ST2: { top: '75%', left: '60%' } },
  '3-4-3': { GK: { top: '5%', left: '50%' }, CB1: { top: '25%', left: '35%' }, CB2: { top: '25%', left: '50%' }, CB3: { top: '25%', left: '65%' }, LM: { top: '50%', left: '20%' }, CM1: { top: '50%', left: '40%' }, CM2: { top: '50%', left: '60%' }, RM: { top: '50%', left: '80%' }, LW: { top: '75%', left: '20%' }, RW: { top: '75%', left: '80%' }, ST: { top: '75%', left: '50%' } },
  '4-1-4-1': { GK: { top: '5%', left: '50%' }, LB: { top: '25%', left: '20%' }, CB1: { top: '25%', left: '40%' }, CB2: { top: '25%', left: '60%' }, RB: { top: '25%', left: '80%' }, CDM: { top: '40%', left: '50%' }, LM: { top: '60%', left: '20%' }, CM1: { top: '60%', left: '40%' }, CM2: { top: '60%', left: '60%' }, RM: { top: '60%', left: '80%' }, ST: { top: '80%', left: '50%' } },
};

export const Pitch = ({ squad, formation, onPlayerMove, onFormationChange }: PitchProps) => {
  const getPlayerForPosition = (position: string) => {
    return squad.find(p => p.position === position) || null;
  };

  const isOutOfPosition = (player: DraftedPlayer, position: string) => {
    if (!player) return false;
    const bestPos = player.best_position;
    // Simple check, can be made more complex
    return !position.includes(bestPos);
  };

  const positions = FORMATIONS[formation as keyof typeof FORMATIONS];

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-2 left-2 z-10 w-48">
        <Select value={formation} onValueChange={onFormationChange}>
          <SelectTrigger className="w-full bg-background/80 border-border">
            <SelectValue placeholder="Select Formation" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(FORMATIONS).map(f => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {Object.entries(positions).map(([position, style]) => {
        const player = getPlayerForPosition(position);
        const outOfPosition = isOutOfPosition(player!, position);
        return (
          <div key={position} style={{ position: 'absolute', ...style, transform: 'translate(-50%, -50%)' }}>
            <PositionBox 
              position={position}
              player={player}
              onPlayerMove={onPlayerMove}
              isOutOfPosition={outOfPosition}
            />
          </div>
        );
      })}
    </div>
  );
};