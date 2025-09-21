import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

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

interface PlayerSearchProps {
  players: Player[];
  onFilterChange: (filteredPlayers: Player[]) => void;
}

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST', 'CF'];

export const PlayerSearch = ({ players, onFilterChange }: PlayerSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ovrRange, setOvrRange] = useState([0, 100]);
  const [valueRange, setValueRange] = useState([0, 200]); // In millions
  const [position, setPosition] = useState('all');

  const handleSearch = () => {
    const filtered = players.filter(player => {
      const playerValue = parseFloat(player.value.replace(/[^0-9.]/g, ''));
      const playerValueInMillions = player.value.includes('M') ? playerValue : playerValue / 1000000;

      return (
        player.full_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (player.overall_rating >= ovrRange[0] && player.overall_rating <= ovrRange[1]) &&
        (playerValueInMillions >= valueRange[0] && playerValueInMillions <= valueRange[1]) &&
        (position === 'all' || player.best_position === position)
      );
    });
    onFilterChange(filtered);
  };

  return (
    <div className="p-4 bg-card border border-border rounded-lg shadow-[var(--shadow-card)]">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search for a player..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        {/* OVR Filter */}
        <div>
          <label className="flex justify-between text-sm font-medium mb-2">
            <span>Overall Rating</span>
            <span className="text-muted-foreground">{ovrRange[0]} - {ovrRange[1]}</span>
          </label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={ovrRange}
            onValueChange={setOvrRange}
          />
        </div>

        {/* Market Value Filter */}
        <div>
          <label className="flex justify-between text-sm font-medium mb-2">
            <span>Market Value (€M)</span>
            <span className="text-muted-foreground">{valueRange[0]}M - {valueRange[1]}M</span>
          </label>
          <Slider
            min={0}
            max={200}
            step={5}
            value={valueRange}
            onValueChange={setValueRange}
          />
        </div>

        {/* Position Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Position</label>
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Positions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {POSITIONS.map(pos => (
                <SelectItem key={pos} value={pos}>{pos}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={handleSearch} className="w-full mt-6 bg-gradient-to-r from-pitch-green to-pitch-dark hover:from-pitch-dark hover:to-pitch-green text-primary-foreground font-semibold">
        Search
      </Button>
    </div>
  );
};