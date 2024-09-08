export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "メールアドレスを入力してください";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "メールアドレスの形式が正しくありません";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "パスワードを入力してください";
  }
  if (password.length < 8) {
    return "パスワードは8文字以上で入力してください";
  }
  return null;
};
