import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET() {
  const supabase = createClient();

  try {
    // Get the count of all bonus questions
    const { count, error: countError } = await supabase
      .from('bonus_questions')
      .select('*', { count: 'exact', head: true });

    if (countError || count === null) {
      console.error('Error fetching bonus question count:', countError);
      return NextResponse.json({ error: 'Could not fetch bonus question count' }, { status: 500 });
    }

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * count);

    // Fetch a random bonus question
    const { data: bonus_questions, error } = await supabase
      .from('bonus_questions')
      .select('*')
      .range(randomIndex, randomIndex)
      .single();

    if (error || !bonus_questions) {
      console.error('Error fetching bonus question:', error);
      return NextResponse.json({ error: 'Could not fetch bonus question' }, { status: 500 });
    }

    // Omit the correct answer from the response
    const { correct_answer, ...questionData } = bonus_questions;

    return NextResponse.json(questionData);
  } catch (error) {
    console.error('Unexpected error in bonus question route:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
