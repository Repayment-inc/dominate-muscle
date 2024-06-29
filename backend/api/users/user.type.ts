export type User = {
  username: string;
  email: string;
  password: string;
};

export type UnitUser = User & {
  id: number;
};

export type JwtToken = {
  token: string;
  type: string;
};

export type TokenData = {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
};
