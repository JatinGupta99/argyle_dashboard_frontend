import { ENDPOINTS } from '@/lib/api-endpoints';
import { fetchApi } from '@/lib/fetch-api';
import type { Speaker, CreateSpeakerDto, UpdateSpeakerDto } from '@/lib/types/speaker';

export const SpeakerService = {
  getAll: async (): Promise<Speaker[]> => {
    const res = await fetchApi<any>(ENDPOINTS.SPEAKERS.ROOT);
    return Array.isArray(res) ? res : res.data || [];
  },

  getById: async (id: string): Promise<Speaker> => {
    const res = await fetchApi<any>(ENDPOINTS.SPEAKERS.BY_ID(id));
    return res.data || res;
  },

  create: async (payload: CreateSpeakerDto) => {
    return fetchApi(ENDPOINTS.SPEAKERS.ROOT, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: UpdateSpeakerDto) => {
    return fetchApi(ENDPOINTS.SPEAKERS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  remove: async (id: string) => {
    return fetchApi(ENDPOINTS.SPEAKERS.BY_ID(id), {
      method: 'DELETE',
    });
  },
};
