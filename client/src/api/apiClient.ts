import axios from "axios";

// 共通のAPIクライアント設定
const apiClient = axios.create({
  baseURL: "http://localhost:7000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// リクエストインターセプターでトークンをヘッダーに追加
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("refreshToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// レスポンスインターセプターでエラーハンドリングを追加
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        // リフレッシュトークンがない場合はログアウト
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // または他のログアウト処理
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          "http://localhost:7000/api/auth/refresh-token",
          { token: refreshToken },
        );
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        apiClient.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return apiClient(originalRequest);
      } catch (err) {
        // リフレッシュトークンの更新に失敗した場合はログアウト
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // または他のログアウト処理
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
