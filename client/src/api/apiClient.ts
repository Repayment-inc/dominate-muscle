import axios from "axios";

// 環境変数からAPIのベースURLを取得、デフォルトは 'http://localhost:7000/api'
// const environment = process.env.NODE_ENV;
// const baseURLConfig = {
//   production: import.meta.env.VITE_API_BASE_URL || "",
//   preview: import.meta.env.VITE_API_BASE_URL || "",
//   development: "http://localhost:7000/api",
// };
// const baseURL = baseURLConfig[environment as keyof typeof baseURLConfig];
// console.log("baseURL is " + baseURL);

const isProduction = process.env.NODE_ENV === "production";
const baseURL = isProduction
  ? import.meta.env.VITE_API_BASE_URL
  : "http://localhost:7000/api";

// const baseURL = import.meta.env.VITE_API_BASE_URL;
console.log("API Base URL is " + baseURL);

// 共通のAPIクライアント設定
const apiClient = axios.create({
  baseURL: baseURL,
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
        const response = await apiClient.post("/auth/refresh-token", {
          token: refreshToken,
        });
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
