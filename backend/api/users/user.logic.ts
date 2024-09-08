import { User, UnitUser } from "./user.type";
import { pool } from "../db/database";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { add } from "date-fns";
import { TokenData } from "./user.type";
import { StatusCodes } from "http-status-codes";
import { errorHandler } from "../middleware/error/errorHandler";

// emailの重複チェック
export const checkEmailExists = async (
  user_email: string
): Promise<null | UnitUser> => {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [user_email];

  try {
    // emailが存在しない場合
    const res = await pool.query(query, values);
    if (res.rows.length === 0) {
      return null;
    }

    const user: UnitUser = {
      id: res.rows[0].id,
      username: res.rows[0].username,
      email: res.rows[0].email,
      password: res.rows[0].password,
    };

    return user;
  } catch (err) {
    console.error(err);
    throw new Error("Database query failed");
  }
};

// パスワードチェック
export const comparePassword = async (
  email: string,
  supplied_password: string
): Promise<null | UnitUser> => {
  const user = await checkEmailExists(email);

  // 復号化したpasswordの照合
  const isMatchDecryptPassword = await bcrypt.compare(
    supplied_password,
    user!.password
  );

  if (!isMatchDecryptPassword) {
    return null;
  }

  return user;
};

// ユーザー登録
export const create = async (userData: User): Promise<number> => {
  const { username, email, password } = userData;

  // パスワードハッシュ化
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Execute a SQL INSERT statement
  const result = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
    [username, email, hashedPassword]
  );

  return result.rows[0].id;
};

// トークンを生成する関数
export const generateTokens = async (userId: number): Promise<TokenData> => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
  const refreshTokenExpiresAt = add(new Date(), { days: 7 });

  // リフレッシュトークンの登録
  await pool.query(
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
    [userId, refreshToken, refreshTokenExpiresAt]
  );

  return { accessToken, refreshToken, refreshTokenExpiresAt };
};

export const refreshToken = async (token: string): Promise<TokenData> => {
  // トークンを検証
  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as JwtPayload;

  // データベースからリフレッシュトークンを取得
  const result = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token = $1",
    [token]
  );

  // トークンが無効または期限切れか確認
  if (
    result.rows.length === 0 ||
    new Date(result.rows[0].expires_at) < new Date()
  ) {
    throw errorHandler(
      StatusCodes.FORBIDDEN,
      "Invalid or expired refresh token"
    );
  }

  const userId = decoded.id;

  // 新しいトークンを生成
  const tokens = await generateTokens(userId);

  // 古いリフレッシュトークンを削除
  await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [token]);

  // 新しいリフレッシュトークンをデータベースに挿入
  await pool.query(
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
    [userId, tokens.refreshToken, tokens.refreshTokenExpiresAt]
  );

  return tokens;
};

// ユーザー情報取得
export const getUserProfile = async (userId: number): Promise<UnitUser | null> => {
  const query = "SELECT id, username, email FROM users WHERE id = $1";
  const values = [userId];

  try {
    const res = await pool.query(query, values);
    if (res.rows.length === 0) {
      return null;
    }

    const user: UnitUser = {
      id: res.rows[0].id,
      username: res.rows[0].username,
      email: res.rows[0].email,
      password: res.rows[0].password,
    };

    return user;
  } catch (err) {
    console.error(err);
    throw new Error("Database query failed");
  }
};