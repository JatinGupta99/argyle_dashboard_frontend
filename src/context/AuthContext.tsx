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
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  // 🧠 default implementations now throw clear errors if used before provider
  login: async () => {
    throw new Error('AuthContext not initialized yet. Wrap your app in <AuthProvider>.');
  },
  logout: async () => {
    throw new Error('AuthContext not initialized yet. Wrap your app in <AuthProvider>.');
  },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // --- ✅ Check existing token and fetch profile on load ---
  useEffect(() => {
    const initAuth = async () => {
      console.log('[Auth] Initializing...');
      const { access_token } = getAuthToken() || {};

      if (!access_token) {
        console.log('[Auth] No token found, user unauthenticated');
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        console.log('[Auth] Token found, fetching profile...');
        const profile = await AuthService.getProfile();
        setUser(profile);
        console.log('[Auth] Profile fetched successfully:', profile);
      } catch (err) {
        console.error('[Auth] Invalid token. Clearing credentials.');
        clearAuthToken();
        setUser(null);
        if (!pathname.startsWith('/auth')) router.replace('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [router, pathname]);

  // --- ✅ Login Flow ---

const login = async ({ email, password }: UserLoginDto): Promise<AuthResponse> => {
  const data = await AuthService.login({ email, password });
  const { access_token, expires_in, user } = data;
  if (!access_token) throw new Error('No access token returned from API.');
  
  setAuthToken({
    access_token,
    refresh_token: '',
    expires_in,
    refresh_expires_in: 0,
    token_type: 'Bearer',
    session_state: '',
  });
  const UserProfile=await AuthService.getProfile()
  console.log(UserProfile,'1221121212121221')
  setUser(UserProfile);

  router.replace('/dashboard/schedule/card');

  return data;
};

  // --- ✅ Logout Flow ---
  const logout = async () => {
    console.log('[Auth] Logging out...');
    try {
      await AuthService.logout();
    } catch (err) {
      console.warn('[Auth] Backend logout failed:', err);
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
