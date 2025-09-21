export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bonus_questions: {
        Row: {
          correct_answer: string
          created_at: string
          id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question_text: string
          reward_amount: number
        }
        Insert: {
          correct_answer: string
          created_at?: string
          id?: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question_text: string
          reward_amount?: number
        }
        Update: {
          correct_answer?: string
          created_at?: string
          id?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question_text?: string
          reward_amount?: number
        }
        Relationships: []
      }
      drafts: {
        Row: {
          consecutive_wrong_answers: number
          created_at: string
          draft_active: boolean
          end_time: string | null
          formation: string
          id: string
          purse: number
          squad: Json | null
          start_time: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          consecutive_wrong_answers?: number
          created_at?: string
          draft_active?: boolean
          end_time?: string | null
          formation?: string
          id?: string
          purse?: number
          squad?: Json | null
          start_time?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          consecutive_wrong_answers?: number
          created_at?: string
          draft_active?: boolean
          end_time?: string | null
          formation?: string
          id?: string
          purse?: number
          squad?: Json | null
          start_time?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      male_players: {
        Row: {
          acceleration: number | null
          aggression: number | null
          agility: number | null
          balance: number | null
          ball_control: number | null
          best_position: string | null
          club_league_name: string | null
          club_logo: string | null
          club_name: string | null
          composure: number | null
          country_flag: string | null
          country_league_name: string | null
          country_name: string | null
          created_at: string
          crossing: number | null
          curve: number | null
          defensive_awareness: number | null
          dribbling: number | null
          finishing: number | null
          fk_accuracy: number | null
          full_name: string | null
          gk_diving: number | null
          gk_handling: number | null
          gk_kicking: number | null
          gk_positioning: number | null
          gk_reflexes: number | null
          heading_accuracy: number | null
          id: number
          image: string | null
          interceptions: number | null
          jumping: number | null
          long_passing: number | null
          long_shots: number | null
          name: string | null
          overall_rating: number | null
          penalties: number | null
          play_styles: string | null
          player_slug: string | null
          positioning: number | null
          positions: string | null
          potential: number | null
          reactions: number | null
          short_passing: number | null
          shot_power: number | null
          sliding_tackle: number | null
          sprint_speed: number | null
          stamina: number | null
          standing_tackle: number | null
          strength: number | null
          value: string | null
          vision: number | null
          volleys: number | null
        }
        Insert: {
          acceleration?: number | null
          aggression?: number | null
          agility?: number | null
          balance?: number | null
          ball_control?: number | null
          best_position?: string | null
          club_league_name?: string | null
          club_logo?: string | null
          club_name?: string | null
          composure?: number | null
          country_flag?: string | null
          country_league_name?: string | null
          country_name?: string | null
          created_at?: string
          crossing?: number | null
          curve?: number | null
          defensive_awareness?: number | null
          dribbling?: number | null
          finishing?: number | null
          fk_accuracy?: number | null
          full_name?: string | null
          gk_diving?: number | null
          gk_handling?: number | null
          gk_kicking?: number | null
          gk_positioning?: number | null
          gk_reflexes?: number | null
          heading_accuracy?: number | null
          id?: number
          image?: string | null
          interceptions?: number | null
          jumping?: number | null
          long_passing?: number | null
          long_shots?: number | null
          name?: string | null
          overall_rating?: number | null
          penalties?: number | null
          play_styles?: string | null
          player_slug?: string | null
          positioning?: number | null
          positions?: string | null
          potential?: number | null
          reactions?: number | null
          short_passing?: number | null
          shot_power?: number | null
          sliding_tackle?: number | null
          sprint_speed?: number | null
          stamina?: number | null
          standing_tackle?: number | null
          strength?: number | null
          value?: string | null
          vision?: number | null
          volleys?: number | null
        }
        Update: {
          acceleration?: number | null
          aggression?: number | null
          agility?: number | null
          balance?: number | null
          ball_control?: number | null
          best_position?: string | null
          club_league_name?: string | null
          club_logo?: string | null
          club_name?: string | null
          composure?: number | null
          country_flag?: string | null
          country_league_name?: string | null
          country_name?: string | null
          created_at?: string
          crossing?: number | null
          curve?: number | null
          defensive_awareness?: number | null
          dribbling?: number | null
          finishing?: number | null
          fk_accuracy?: number | null
          full_name?: string | null
          gk_diving?: number | null
          gk_handling?: number | null
          gk_kicking?: number | null
          gk_positioning?: number | null
          gk_reflexes?: number | null
          heading_accuracy?: number | null
          id?: number
          image?: string | null
          interceptions?: number | null
          jumping?: number | null
          long_passing?: number | null
          long_shots?: number | null
          name?: string | null
          overall_rating?: number | null
          penalties?: number | null
          play_styles?: string | null
          player_slug?: string | null
          positioning?: number | null
          positions?: string | null
          potential?: number | null
          reactions?: number | null
          short_passing?: number | null
          shot_power?: number | null
          sliding_tackle?: number | null
          sprint_speed?: number | null
          stamina?: number | null
          standing_tackle?: number | null
          strength?: number | null
          value?: string | null
          vision?: number | null
          volleys?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
