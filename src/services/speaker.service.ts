import { ENDPOINTS } from '@/lib/api-endpoints';
import { fetchApi } from '@/lib/fetch-api';
import type { CreateSpeakerDto, UpdateSpeakerDto } from '@/lib/types/speaker';
import { HTTP_METHODS } from 'next/dist/server/web/http';

export interface PresignedUrlResponse {
  statusCode: number;
  data: {
    key: string;
    url: string;
  };
}

export const SpeakerService = {
  getAll: async (
  eventId: string,
  query?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
) => {
  const params = new URLSearchParams();
  params.append('page', String(query?.page ?? 1));
  params.append('limit', String(query?.limit ?? 10));

  if (query?.search) params.append('search', query.search);
  if (query?.sortBy) params.append('sortBy', query.sortBy);
  if (query?.sortOrder) params.append('sortOrder', query.sortOrder);
  return await fetchApi(
    `${ENDPOINTS.SPEAKERS.ROOT(eventId)}?${params.toString()}`,
    {
      method: HTTP_METHODS[0], // GET
    }
  );
},
  getById: async (eventId: string, speakerId: string) => {
    return fetchApi(ENDPOINTS.SPEAKERS.BY_ID(eventId, speakerId), {
      method: HTTP_METHODS[0],
    });
  },

  create: async (eventId: string, payload: CreateSpeakerDto) => {
    return fetchApi(ENDPOINTS.SPEAKERS.ROOT(eventId), {
      method: HTTP_METHODS[3],
      body: JSON.stringify(payload),
    });
  },

  update: async (eventId: string, speakerId: string, payload: UpdateSpeakerDto) => {
    return fetchApi(ENDPOINTS.SPEAKERS.BY_ID(eventId, speakerId), {
      method: HTTP_METHODS[6],
      body: JSON.stringify(payload),
    });
  },

  remove: async (eventId: string, speakerId: string) => {
    return fetchApi(ENDPOINTS.SPEAKERS.BY_ID(eventId, speakerId), {
      method: HTTP_METHODS[5],
    });
  },

  getUploadUrl: async (params: {
    eventId: string;
    speakerId: string;
    contentType: string;
    type: 'logo' | 'document' | 'photo';
  }): Promise<PresignedUrlResponse> => {
    const { eventId, speakerId, contentType, type } = params;

    return fetchApi(ENDPOINTS.SPEAKERS.UPLOAD_URL(eventId, speakerId), {
      method: 'POST',
      body: JSON.stringify({ contentType, type }),
    });
  },
};
