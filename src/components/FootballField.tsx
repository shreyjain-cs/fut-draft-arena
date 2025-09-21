import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Pitch } from '@/components/Pitch';
import NewPitch from '@/components/NewPitch';

interface DraftedPlayer {
  player_slug: string;
  full_name: string;
  overall_rating: number;
  purchase_price: number;
  best_position: string;
  position?: string;
}

interface FootballFieldProps {
  squad: DraftedPlayer[];
  onSquadChange: (squad: DraftedPlayer[]) => void;
}

export const FootballField = ({ squad, onSquadChange }: FootballFieldProps) => {
  const [formation, setFormation] = useState('4-3-3');

  const handlePlayerMove = (playerSlug: string, newPosition: string) => {
    const playerToMove = squad.find(p => p.player_slug === playerSlug);
    const playerInTargetPosition = squad.find(p => p.position === newPosition);

    const updatedSquad = squad.map(p => {
      if (p.player_slug === playerSlug) {
        return { ...p, position: newPosition };
      }
      if (playerInTargetPosition && p.player_slug === playerInTargetPosition.player_slug) {
        return { ...p, position: playerToMove?.position };
      }
      return p;
    });

    onSquadChange(updatedSquad);
  };

  const handleFormationChange = (newFormation: string) => {
    setFormation(newFormation);
    const updatedSquad = squad.map(player => ({ ...player, position: undefined }));
    onSquadChange(updatedSquad);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative w-full h-full">
        <NewPitch />
        <Pitch 
          squad={squad} 
          onPlayerMove={handlePlayerMove}
          formation={formation}
          onFormationChange={handleFormationChange}
        />
      </div>
    </DndProvider>
  );
};