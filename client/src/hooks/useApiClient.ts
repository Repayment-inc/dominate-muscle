// 今のところ使い道がわからん
import { useNavigate } from "react-router-dom";
import apiClient from "@/api/apiClient";

export const useApiClient = () => {
  const navigate = useNavigate();

  // インターセプター内でnavigateを使用
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized, redirecting to login.");
        navigate("/login"); // 認証エラーの場合にログインページにリダイレクト
      }
      return Promise.reject(error);
    },
  );

  console.log("test");

  return apiClient;
};
