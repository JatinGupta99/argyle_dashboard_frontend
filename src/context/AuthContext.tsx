'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { getAuthToken, setAuthToken, clearAuthToken } from '@/utils/auth';
import type { UserProfile, UserLoginDto, AuthResponse } from '@/lib/types/auth';

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  login: (payload: UserLoginDto) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resetPassword: (payload: { token: string; newPassword: string }) => Promise<void>;
  setupPassword: (payload: { token: string; newPassword: string }) => Promise<void>; // ← Added
  forgotPassword: (payload: { email: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => { throw new Error('AuthContext not initialized yet'); },
  logout: async () => { throw new Error('AuthContext not initialized yet'); },
  resetPassword: async () => { throw new Error('AuthContext not initialized yet'); },
  setupPassword: async () => { throw new Error('AuthContext not initialized yet'); }, // ← Added
  forgotPassword: async () => { throw new Error('AuthContext not initialized yet'); },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const { access_token } = getAuthToken() || {};
      if (!access_token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await AuthService.getProfile();
        setUser(profile);
      } catch(err) {
        clearAuthToken();
        setUser(null);
        if (!pathname.startsWith('/auth')) router.replace('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [router, pathname]);

  // --- Login ---
  const login = async ({ email, password }: UserLoginDto): Promise<AuthResponse> => {
    const data = await AuthService.login({ email, password });

    if (!data.access_token) throw new Error('No access token returned');

    setAuthToken({
      access_token: data.access_token,
      refresh_token: '',
      expires_in: data.expires_in,
      refresh_expires_in: 0,
      token_type: 'Bearer',
      session_state: '',
    });

    const profile = await AuthService.getProfile();
    setUser(profile);

    router.replace('/dashboard/schedule/card');
    return data;
  };

  // --- Logout ---
  const logout = async () => {
    try { await AuthService.logout(); } catch (err) { console.warn(err); }
    finally {
      clearAuthToken();
      setUser(null);
      router.replace('/auth/login');
    }
  };

  // --- Reset Password ---
  const resetPassword = async ({ token, newPassword }: { token: string; newPassword: string }) => {
    try {
      await AuthService.resetPassword({ token, newPassword });
    } catch (err) {
      console.error('[Auth] Reset password failed:', err);
      throw err;
    }
  };

  // --- Setup Password (new) ---
  const setupPassword = async ({ token, newPassword }: { token: string; newPassword: string }) => {
    try {
      await AuthService.setupPassword({ token, newPassword });
    } catch (err) {
      console.error('[Auth] Setup password failed:', err);
      throw err;
    }
  };

  // --- Forgot Password ---
  const forgotPassword = async ({ email }: { email: string }) => {
    try {
      await AuthService.forgotPassword({ email });
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message;
      if (backendMessage === 'User not found' || err?.status === 404) return;
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, resetPassword, setupPassword, forgotPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
