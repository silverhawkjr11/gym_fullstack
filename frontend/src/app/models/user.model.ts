export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'trainer' | 'member';
  phone_number?: string;
  date_joined: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: string;
  phone_number?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}
