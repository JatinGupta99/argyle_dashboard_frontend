export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
}
