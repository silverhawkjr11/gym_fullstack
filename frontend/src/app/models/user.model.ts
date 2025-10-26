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
  password_confirm: string;
  first_name: string;
  last_name: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  message: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}
