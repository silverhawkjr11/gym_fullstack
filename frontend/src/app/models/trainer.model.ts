export interface Trainer {
  id: number;
  user: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  specialization: string;
  experience_years: number;
  bio?: string;
  hourly_rate: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrainerRequest {
  user: number;
  specialization: string;
  experience_years: number;
  bio?: string;
  hourly_rate: string;
  is_available?: boolean;
}
