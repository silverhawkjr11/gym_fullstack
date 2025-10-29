export interface Member {
  id: number;
  user: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  membership_type: 'basic' | 'premium' | 'vip';
  membership_start_date: string;
  membership_end_date: string;
  is_active: boolean;
  emergency_contact?: string;
  medical_conditions?: string;
  created_at: string;
  updated_at: string;
}

export interface MemberRequest {
  user: number;
  membership_type: string;
  membership_start_date: string;
  membership_end_date: string;
  emergency_contact?: string;
  medical_conditions?: string;
}

export interface MemberCreateRequest {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  password: string;
  membership_type: string;
  membership_start_date: string;
  membership_end_date: string;
  emergency_contact?: string;
  medical_conditions?: string;
  is_active?: boolean;
}
