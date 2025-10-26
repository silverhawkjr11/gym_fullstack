export interface TrainingSession {
  id: number;
  trainer: number;
  trainer_name?: string;
  member: number;
  member_name?: string;
  session_type: 'personal' | 'group' | 'class';
  scheduled_date: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  price: string;
  created_at: string;
  updated_at: string;
}

export interface SessionRequest {
  trainer: number;
  member: number;
  session_type: string;
  scheduled_date: string;
  duration_minutes: number;
  status?: string;
  notes?: string;
  price: string;
}
