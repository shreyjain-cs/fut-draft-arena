import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Timer, Trophy, Users, Coins, Star, ArrowLeft } from "lucide-react";
import { PlayerCard } from "@/components/PlayerCard";
import { SquadDisplay } from "@/components/SquadDisplay";
import { TriviaModal } from "@/components/TriviaModal";
import { useDraft, GameMode } from "@/hooks/useDraft";
import { useToast } from "@/hooks/use-toast";
import { PlayerSearch } from "@/components/PlayerSearch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Player {
  id: number;
  name: string;
  image: string;
  overall_rating: number;
  value: string;
  best_position: string;
  club_name: string;
  club_logo: string;
  country_flag: string;
}

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

const Index = () => {
  const { toast } = useToast();
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const {
    draftId,
    purse,
    squad,
    isActive,
    startDraft,
    buyPlayer,
    sellPlayer,
    stopDraft,
    refreshBudget,
    formation,
    setFormation,
    canBuyPlayer,
    gameMode,
    targetOvr,
    timeLeft,
    resetDraft
  } = useDraft();

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (!isActive && draftId) {
      setShowSummary(true);
    }
  }, [isActive, draftId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && gameMode === 'classic') {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, gameMode]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('male_players')
        .select('id,name,image,overall_rating,value,best_position,club_name,club_logo,country_flag')
        .not('overall_rating', 'is', null)
        .not('value', 'is', null)
        .order('overall_rating', { ascending: false })
        .limit(250);

      if (error) throw error;
      setPlayers(data || []);
      setFilteredPlayers(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load players",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartDraft = async (mode: GameMode) => {
    await startDraft(mode);
    setElapsedTime(0);
    setShowSummary(false);
    toast({
      title: "Draft Started!",
      description: "Build your dream team within budget",
    });
  };

  const handleStopDraft = async () => {
    await stopDraft('Classic Player');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return `€${(amount / 1000000000).toFixed(2)}B`;
  };

  const maxBudget = gameMode === 'classic' ? 500000000 : 1000000000;
  const squadValue = squad.reduce((sum, p) => sum + p.purchase_price, 0);
  const budgetProgress = (squadValue / maxBudget) * 100;

  if (!isActive && !draftId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center bg-card border-border shadow-[var(--shadow-card)]">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pitch-green to-pitch-dark rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground mb-2">FutDraft Auction</CardTitle>
              <p className="text-muted-foreground">Choose your game mode</p>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <Button 
              onClick={() => handleStartDraft('classic')} 
              size="lg" 
              className="w-full bg-gradient-to-r from-pitch-green to-pitch-dark hover:from-pitch-dark hover:to-pitch-green text-primary-foreground font-semibold"
            >
              Classic Mode
            </Button>
            <Button 
              onClick={() => handleStartDraft('wildcard')} 
              size="lg" 
              variant="outline"
              className="w-full border-pitch-green text-pitch-green hover:bg-pitch-green/10 font-semibold"
            >
              <Star className="w-4 h-4 mr-2" />
              Fut Draft Wildcard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={resetDraft}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">FutDraft Auction</h1>
              {isActive && (
                <Badge variant="default" className="bg-gradient-to-r from-pitch-green to-pitch-dark">
                  <Timer className="w-4 h-4 mr-1" />
                  {gameMode === 'classic' ? formatTime(elapsedTime) : formatTime(timeLeft)}
                </Badge>
              )}
            </div>
            {isActive && gameMode === 'classic' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div style={{ pointerEvents: squad.length < 11 ? 'none' : 'auto' }}>
                    <Button onClick={handleStopDraft} variant="destructive" disabled={squad.length < 11}>
                      Stop Draft
                    </Button>
                  </div>
                </TooltipTrigger>
                {squad.length < 11 && (
                  <TooltipContent>
                    <p>You need at least 11 players to stop the draft.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )}
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <Card className="bg-gradient-to-br from-card to-card/80 border-border shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Coins className="w-5 h-5 text-gold" />
                    Budget
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className="font-semibold text-foreground">{formatCurrency(purse)}</span>
                    </div>
                    <Progress value={budgetProgress} className="h-2" />
                    <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                      <span>€0B</span>
                      <span>{gameMode === 'classic' ? '€0.5B' : '€1B'}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Squad Value</p>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(squadValue)}</p>
                  </div>
                </CardContent>
              </Card>

              <PlayerSearch players={players} onFilterChange={setFilteredPlayers} />

              {gameMode === 'classic' && <TriviaModal draftId={draftId} onBudgetChange={refreshBudget} />}
            </div>

            <div className="lg:col-span-6">
              <Card className="h-full bg-card border-border shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Users className="w-5 h-5 text-pitch-green" />
                    Player Market
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-2 border-pitch-green border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-muted-foreground mt-2">Loading players...</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 max-h-[calc(100vh-230px)] overflow-y-auto p-1">
                      {filteredPlayers.map((player) => (
                        <PlayerCard
                          key={player.id}
                          player={player}
                          onBuyPlayer={buyPlayer}
                          disabled={squad.some(p => p.player_slug === player.name) || !canBuyPlayer(player)}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <SquadDisplay squad={squad} onSellPlayer={sellPlayer} formation={formation} setFormation={setFormation} gameMode={gameMode} targetOvr={targetOvr} />
            </div>
          </div>
        </div>

        <Dialog open={showSummary} onOpenChange={setShowSummary}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Draft Complete!</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-pitch-green">{formatTime(gameMode === 'classic' ? elapsedTime : 300 - timeLeft)}</div>
                <p className="text-muted-foreground">Total Draft Time</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-foreground">{squad.length}</div>
                  <p className="text-sm text-muted-foreground">Players</p>
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">
                    {squad.length ? Math.round(squad.reduce((sum, p) => sum + p.display_rating, 0) / squad.length) : 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(squadValue)}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default Index;
