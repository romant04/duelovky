export interface SignupData {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface User {
  email: string;
  username: string;
}

export interface SupabaseUser {
  id: number;
  username: string;
  email: string;
  password: string;
  uid: string;
}
