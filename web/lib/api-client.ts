import axios from "axios";

const isServer = typeof window === 'undefined';
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7000/api";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

if (!isServer) {
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const response = await apiClient.post("/auth/refresh-token", { token: refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          apiClient.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

          return apiClient(originalRequest);
        } catch (err) {
          // トークンのリフレッシュに失敗した場合、ユーザーをログアウトさせる
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          // ここでuseAuthのlogout関数を直接呼び出すことはできないので、
          // カスタムイベントをディスパッチしてログアウト処理を行うことができます
          window.dispatchEvent(new Event('authError'));
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
}

export default apiClient;