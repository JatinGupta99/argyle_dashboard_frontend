'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { getAuthToken, setAuthToken, clearAuthToken } from '@/utils/auth';
import type { UserProfile } from '@/lib/types/auth';

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean; // only for global/session check
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
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Initialize auth session
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
        if (!pathname.startsWith('/auth')) router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [router, pathname]);

  // ✅ Login (does not affect global loading)
  const login = async (email: string, password: string) => {
    try {
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

      // Wait for cookies to write before redirect
      await new Promise((r) => setTimeout(r, 100));
      router.replace('/dashboard');
    } catch (err) {
      clearAuthToken();
      setUser(null);
      throw err;
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await AuthService.logout();
    } catch {
      // Ignore API errors
    } finally {
      clearAuthToken();
      setUser(null);
      router.replace('/auth/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
