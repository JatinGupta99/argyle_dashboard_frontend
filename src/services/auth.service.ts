import { ENDPOINTS } from '@/lib/api-endpoints';
import { fetchApi } from '@/lib/fetch-api';
import { UserLoginDto, UserProfile, AuthResponse } from '@/lib/types/auth';
export const AuthService = {
  login: async (payload: UserLoginDto): Promise<AuthResponse> => {
    const { data } = await fetchApi<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return data;
  },

  logout: async () => {
    await fetchApi<null>(ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
  },

  getProfile: async (): Promise<UserProfile> => {
    const { data } = await fetchApi<UserProfile>(ENDPOINTS.USER.GET_PROFILE, {
      method: 'GET',
    });
    return data;
  },
};
