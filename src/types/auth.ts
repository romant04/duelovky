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

export interface UserFirebaseResponse {
  email: string;
  password: string;
  username: string;
}

export interface User {
  email: string;
  username: string;
}

export interface SigninApiResponse {
  id: string;
  userData: User;
}
