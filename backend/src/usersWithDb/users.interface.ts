export interface User {
  username: string;
  email: string;
  password: string;
}

export interface UnitUser extends User {
  id: number;
}

export interface Users {
  [key: string]: UnitUser;
}

export interface JwtToken {
  token: string;
  type: string;
}

export type TokenData = {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
};
