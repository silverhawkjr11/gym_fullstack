export interface Plan {
  id: number;
  trainee: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  trainee_name: string;
  description: string;
  machines: string; // comma-separated machine IDs
  days: string; // e.g., "Monday,Wednesday,Friday"
  sets: number;
  reps: number;
  duration_minutes: number | null;
  created_at: string;
}

export interface PlanRequest {
  trainee_id: number;
  description: string;
  machines: string;
  days: string;
  sets: number;
  reps: number;
  duration_minutes?: number | null;
}
