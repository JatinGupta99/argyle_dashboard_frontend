import { ENDPOINTS } from '@/lib/api-endpoints';
import { fetchApi } from '@/lib/fetch-api';
import type { CreateUserDto, UpdateUserDto, User } from '@/lib/types/user';

export const UserService = {
  /* ------------------------------------------------------------
     GET ALL USERS
  -------------------------------------------------------------*/
  getAll: async (
    query?: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      role?: string;
    }
  ) => {
    const params = new URLSearchParams();

    if (query?.page) params.append('page', String(query.page));
    if (query?.limit) params.append('limit', String(query.limit));
    if (query?.search) params.append('search', query.search);
    if (query?.sortBy) params.append('sortBy', query.sortBy);
    if (query?.sortOrder) params.append('sortOrder', query.sortOrder);
    if (query?.role) params.append('role', query.role);

    return await fetchApi<{
      data: User[];
      total: number;
      totalPages: number;
    }>(`${ENDPOINTS.USERS.ROOT}?${params.toString()}`, {
      method: 'GET',
    });
  },

  /* ------------------------------------------------------------
     GET USER BY ID
  -------------------------------------------------------------*/
  getById: async (userId: string) => {
    return fetchApi<User>(ENDPOINTS.USERS.BY_ID(userId), {
      method: 'GET',
    });
  },

  /* ------------------------------------------------------------
     CREATE USER
  -------------------------------------------------------------*/
  create: async (payload: CreateUserDto) => {
    return fetchApi<User>(ENDPOINTS.USERS.ROOT, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /* ------------------------------------------------------------
     UPDATE USER
  -------------------------------------------------------------*/
  update: async (userId: string, payload: UpdateUserDto) => {
    return fetchApi<User>(ENDPOINTS.USERS.BY_ID(userId), {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /* ------------------------------------------------------------
     DELETE USER
  -------------------------------------------------------------*/
  remove: async (userId: string) => {
    return fetchApi(ENDPOINTS.USERS.BY_ID(userId), {
      method: 'DELETE',
    });
  },
};
