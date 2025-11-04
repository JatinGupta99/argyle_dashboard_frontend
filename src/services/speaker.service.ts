import { ENDPOINTS } from '@/lib/api-endpoints';
import { fetchApi } from '@/lib/fetch-api';
import type { Speaker, CreateSpeakerDto, UpdateSpeakerDto } from '@/lib/types/speaker';

interface ApiResponse<T> {
  statusCode: number;
  message?: string;
  data: T;
}

export const SpeakerService = {
  // ✅ Always unwrap data from the NestJS TransformInterceptor response
  getAll: async (): Promise<Speaker[]> => {
    const res = await fetchApi<ApiResponse<Speaker[]>>(ENDPOINTS.SPEAKERS.ROOT);
    return res.data ?? [];
  },

  getById: async (id: string): Promise<Speaker> => {
    const res = await fetchApi<ApiResponse<Speaker>>(ENDPOINTS.SPEAKERS.BY_ID(id));
    return res.data;
  },

  create: async (payload: CreateSpeakerDto): Promise<Speaker> => {
    const res = await fetchApi<ApiResponse<Speaker>>(ENDPOINTS.SPEAKERS.ROOT, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  update: async (id: string, payload: UpdateSpeakerDto): Promise<Speaker> => {
    const res = await fetchApi<ApiResponse<Speaker>>(ENDPOINTS.SPEAKERS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  remove: async (id: string): Promise<{ message?: string }> => {
    const res = await fetchApi<ApiResponse<null>>(ENDPOINTS.SPEAKERS.BY_ID(id), {
      method: 'DELETE',
    });
    return { message: res.message };
  },
};
