'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { getAuthToken, setAuthToken, clearAuthToken } from '@/utils/auth';
import type { UserProfile } from '@/lib/types/auth';

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // true until we check token
  const router = useRouter();

  // On mount, check token and fetch profile
  useEffect(() => {
    const initAuth = async () => {
      const { accessToken } = getAuthToken();
      if (!accessToken) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const profile = await AuthService.getProfile();
        setUser(profile);
      } catch {
        clearAuthToken();
        setUser(null);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await AuthService.login({ email, password });
      const { access_token, expires_in } = response.data;

      if (!access_token) throw new Error('No access token returned');

      setAuthToken({
        access_token,
        refresh_token: '',
        expires_in,
        refresh_expires_in: 0,
        token_type: 'Bearer',
        session_state: '',
      });

      const profile = await AuthService.getProfile();
      setUser(profile);

      router.push('/dashboard');
    } catch (err: any) {
      clearAuthToken();
      setUser(null);
      throw err; // allow LoginPage to catch
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
    } catch {}
    clearAuthToken();
    setUser(null);
    router.push('/auth/login');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
