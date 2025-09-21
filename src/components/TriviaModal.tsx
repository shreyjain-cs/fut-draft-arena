import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Brain, HelpCircle, CheckCircle, XCircle, Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BonusQuestion {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  reward_amount: number;
}

interface TriviaModalProps {
  draftId: string | null;
}

export const TriviaModal = ({ draftId }: TriviaModalProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState<BonusQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchRandomQuestion = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bonus_questions')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      setQuestion(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load question",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!question || !selectedAnswer || !draftId) return;

    setSubmitting(true);
    try {
      const correct = selectedAnswer === question.correct_answer;
      setIsCorrect(correct);
      setShowResult(true);

      // Calculate reward/penalty
      const amount = correct ? question.reward_amount : -25000000;
      
      // Get current draft state
      const { data: draft, error: fetchError } = await supabase
        .from('drafts')
        .select('purse, consecutive_wrong_answers')
        .eq('id', draftId)
        .single();

      if (fetchError) throw fetchError;

      let penalty = 25000000;
      let newConsecutiveWrong = draft.consecutive_wrong_answers;

      if (!correct) {
        // Double penalty for consecutive wrong answers
        penalty = 25000000 * Math.pow(2, draft.consecutive_wrong_answers);
        newConsecutiveWrong = draft.consecutive_wrong_answers + 1;
      } else {
        newConsecutiveWrong = 0; // Reset consecutive wrong answers
      }

      const finalAmount = correct ? amount : -penalty;
      const newPurse = Math.max(0, draft.purse + finalAmount);

      // Update draft
      const { error: updateError } = await supabase
        .from('drafts')
        .update({
          purse: newPurse,
          consecutive_wrong_answers: newConsecutiveWrong
        })
        .eq('id', draftId);

      if (updateError) throw updateError;

      toast({
        title: correct ? "Correct!" : "Wrong Answer",
        description: correct 
          ? `You earned €${(amount / 1000000).toFixed(1)}M!`
          : `You lost €${(penalty / 1000000).toFixed(1)}M`,
        variant: correct ? "default" : "destructive"
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit answer",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuestion = () => {
    setQuestion(null);
    setSelectedAnswer("");
    setShowResult(false);
    setIsCorrect(false);
  };

  const handleNewQuestion = () => {
    resetQuestion();
    fetchRandomQuestion();
  };

  const handleOpenModal = () => {
    resetQuestion();
    setIsOpen(true);
    fetchRandomQuestion();
  };

  const formatCurrency = (amount: number) => {
    return `€${(amount / 1000000).toFixed(1)}M`;
  };

  const options = question ? [
    { key: 'A', text: question.option_a },
    { key: 'B', text: question.option_b },
    { key: 'C', text: question.option_c },
    { key: 'D', text: question.option_d }
  ] : [];

  return (
    <>
      <Card className="bg-gradient-to-br from-card to-card/80 border-border shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Brain className="w-5 h-5 text-gold" />
            Bonus Trivia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Answer football trivia questions to earn bonus funds for your draft!
          </p>
          <Button
            onClick={handleOpenModal}
            disabled={!draftId}
            className="w-full bg-gradient-to-r from-gold to-warning hover:from-warning hover:to-gold text-black font-semibold"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Get Question
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Brain className="w-5 h-5 text-gold" />
              Bonus Question
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading question...</p>
            </div>
          ) : question ? (
            <div className="space-y-4">
              {!showResult && (
                <Badge className="bg-gradient-to-r from-gold to-warning text-black font-semibold">
                  <Coins className="w-3 h-3 mr-1" />
                  Reward: {formatCurrency(question.reward_amount)}
                </Badge>
              )}

              <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                <p className="text-foreground font-medium">{question.question_text}</p>
              </div>

              {!showResult ? (
                <div className="space-y-2">
                  {options.map((option) => (
                    <Button
                      key={option.key}
                      variant={selectedAnswer === option.key ? "default" : "outline"}
                      className={`w-full justify-start text-left h-auto p-3 ${
                        selectedAnswer === option.key 
                          ? 'bg-pitch-green text-primary-foreground' 
                          : 'bg-card hover:bg-muted text-foreground'
                      }`}
                      onClick={() => setSelectedAnswer(option.key)}
                    >
                      <span className="font-semibold mr-2">{option.key}.</span>
                      <span>{option.text}</span>
                    </Button>
                  ))}

                  <Button
                    onClick={submitAnswer}
                    disabled={!selectedAnswer || submitting}
                    className="w-full mt-4 bg-gradient-to-r from-pitch-green to-pitch-dark hover:from-pitch-dark hover:to-pitch-green text-primary-foreground font-semibold"
                  >
                    {submitting ? "Submitting..." : "Submit Answer"}
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                    isCorrect ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                  }`}>
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <span className="font-semibold">
                      {isCorrect ? 'Correct!' : 'Wrong Answer'}
                    </span>
                  </div>

                  <p className="text-muted-foreground">
                    The correct answer was: <span className="font-semibold text-foreground">{question.correct_answer}</span>
                  </p>

                  <div className="flex gap-2">
                    <Button onClick={handleNewQuestion} className="flex-1">
                      Next Question
                    </Button>
                    <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No questions available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};