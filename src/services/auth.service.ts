import { ENDPOINTS } from '@/lib/api-endpoints';
import { fetchApi } from '@/lib/fetch-api';
import { UserLoginDto, UserProfile, AuthResponse } from '@/lib/types/auth';
import { HTTP_METHODS } from 'next/dist/server/web/http';
export const AuthService = {
  login: async (payload: UserLoginDto): Promise<AuthResponse> => {
    const { data } = await fetchApi<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
      method: HTTP_METHODS[3],
      body: JSON.stringify(payload),
    });

    return data;
  },

  logout: async () => {
    await fetchApi<null>(ENDPOINTS.AUTH.LOGOUT, {
      method: HTTP_METHODS[3],
    });
  },

  getProfile: async (): Promise<UserProfile> => {
    const { data } = await fetchApi<UserProfile>(ENDPOINTS.USER.GET_PROFILE, {
      method: HTTP_METHODS[0],
    });
    return data;
  },
};
