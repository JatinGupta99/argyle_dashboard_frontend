import { ENDPOINTS } from '@/lib/api-endpoints';
import { fetchApi } from '@/lib/fetch-api';
import { UserLoginDto, UserProfile } from '@/lib/types/auth';

export const AuthService = {
  login: async (payload: UserLoginDto) => {
    return fetchApi<{
      statusCode: number
      data: {
        access_token: string
        expires_in: number
        user: UserProfile
      }
    }>(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout: async () => {
    return fetchApi(ENDPOINTS.AUTH.LOGOUT, { method: 'POST' });
  },

  getProfile: async (): Promise<UserProfile> => {
    return fetchApi<UserProfile>(ENDPOINTS.USER.GET_PROFILE,{
      method:'GET'
    });
  },
};
