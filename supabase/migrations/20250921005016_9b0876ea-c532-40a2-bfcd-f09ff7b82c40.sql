-- Create bonus_questions table for trivia
CREATE TABLE public.bonus_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  reward_amount NUMERIC NOT NULL DEFAULT 10000000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create drafts table for user draft sessions
CREATE TABLE public.drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  purse NUMERIC NOT NULL DEFAULT 500000000,
  formation TEXT NOT NULL DEFAULT '4-3-3',
  squad JSONB DEFAULT '[]'::jsonb,
  consecutive_wrong_answers INTEGER NOT NULL DEFAULT 0,
  draft_active BOOLEAN NOT NULL DEFAULT true,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bonus_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bonus_questions (publicly readable for the trivia game)
CREATE POLICY "Bonus questions are viewable by everyone" 
ON public.bonus_questions 
FOR SELECT 
USING (true);

-- RLS Policies for drafts (users can manage their own drafts)
CREATE POLICY "Users can view their own drafts" 
ON public.drafts 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create drafts" 
ON public.drafts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own drafts" 
ON public.drafts 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_drafts_updated_at
BEFORE UPDATE ON public.drafts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample bonus questions
INSERT INTO public.bonus_questions (question_text, option_a, option_b, option_c, option_d, correct_answer, reward_amount) VALUES
('Which player has won the most Ballon d''Or awards?', 'Cristiano Ronaldo', 'Lionel Messi', 'Luka Modrić', 'Karim Benzema', 'B', 15000000),
('In which year did the first FIFA World Cup take place?', '1928', '1930', '1932', '1934', 'B', 10000000),
('Which club has won the most UEFA Champions League titles?', 'FC Barcelona', 'AC Milan', 'Real Madrid', 'Bayern Munich', 'C', 20000000),
('Who is the all-time top scorer in UEFA Champions League history?', 'Lionel Messi', 'Robert Lewandowski', 'Cristiano Ronaldo', 'Karim Benzema', 'C', 12000000),
('Which country hosted the 2018 FIFA World Cup?', 'Brazil', 'Germany', 'Russia', 'Qatar', 'C', 8000000);

-- Enable RLS on male_players if not already enabled
ALTER TABLE public.male_players ENABLE ROW LEVEL SECURITY;

-- Create policy for male_players (publicly readable for the draft game)
CREATE POLICY "Players are viewable by everyone" 
ON public.male_players 
FOR SELECT 
USING (true);