export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export type SignInData = {
  email: string
  password: string
}

export type SignUpData = {
  name: string
  email: string
  password: string
}

export type DecodedUser = {
  /** Unique user ID (from JWT 'sub') */
  sub: string

  /** Email of the user */
  email: string

  /** Role (if provided in token) */
  role?: string
  
  avatar?: string

  /** Issued-at timestamp */
  iat?: number

  /** Expiration timestamp */
  exp?: number
}

export type Credentials = {
  access_token: string
  expires_in: number
  refresh_token: string
  refresh_expires_in: number
  token_type: string
  session_state: string
}