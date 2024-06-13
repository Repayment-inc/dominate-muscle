import React from "react";

import { Navigate, useLocation } from "react-router-dom";
import { fetchWorkoutHistory } from "@/hooks/useAPI";

export const ProtectedRoutes = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // TODO: Use authentication token
  const localStorageToken = localStorage.getItem("accessToken");
  const location = useLocation();

  if (!localStorageToken) {
    return (
      // 再ログイン後、元々いたページにリダイレクトさせる。
      <Navigate
        to={`/auth/login?redirectTo=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // ログインが成功したタイミングでヒストリーデータを取得するAPIを呼び出す
  fetchWorkoutHistory();

  return children;
};

// 参考ソース https://github.com/remix-run/react-router/issues/10637
