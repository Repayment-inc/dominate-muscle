import { ApiResponse } from "../common/utils/response";

type Valid = {
  message: string;
  error: string;
};

export function userValidation(
  username: string,
  email: string,
  password: string
): null | Valid {
  if (!username || !email || !password) {
    const validResult: Valid = {
      message: "バリデーションエラー",
      error: "すべての項目を入力してください",
    };

    return validResult;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      message: "バリデーションエラー",
      error: "無効なメールアドレス形式です",
    };
  }

  return null;
}
