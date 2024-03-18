export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  token: string;
}