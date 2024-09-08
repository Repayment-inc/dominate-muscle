import apiClient from '@/lib/api-client';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  username: string;
}

export async function login(credentials: LoginCredentials) {
  try {
    const response = await apiClient.post('/auth/dlogin', credentials);
    console.log("login response:", response);
    return response.data.resultData;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function register(credentials: RegisterCredentials) {
  try {
    const response = await apiClient.post('/auth/dregister', credentials);
    return response.data.resultData;
  } catch (error :any) {
    console.error('Registration failed:', error);
    console.error('Registration failed:', error.response.data);
    throw error;
  }
}

export async function logout() {
  try {
    // await apiClient.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.reload();
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}


export const getProfile = async () => {
  try {
    console.log("getProfile");
    const response = await apiClient.post("/auth/profile");
    console.log("response:", response);
    return response.data.resultData;
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};