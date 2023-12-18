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

export interface SupabaseUser {
  id: number;
  username: string;
  email: string;
  password: string;
  uid: string;
  horolezci_mmr: number;
  prsi_mmr: number;
  fotbal_mmr: number;
}
