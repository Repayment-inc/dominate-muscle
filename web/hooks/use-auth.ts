import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { register as registerApi, login as loginApi, logout as logoutApi, getProfile } from '@/services/api/auth';

interface AuthUser {
  // id: string;
  // email: string;
  name: string;
  // 他の必要なユーザー情報
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // トークンの有効性を確認するAPIを呼び出す
        const { username } = await getProfile();
        if (username) {
          setUser({ name: username });
        } else {
          throw new Error('Invalid token');
        }
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await registerApi({ username, email, password });
      login(email, password)
    } catch (error) {
      console.error('Register failed:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { username, accessToken, refreshToken } = await loginApi({ email, password });
      console.log("login user:", username);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser({ name: username });
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { user, loading, register, login, logout };
}