import { ENDPOINTS } from '@/lib/api-endpoints';
import { fetchApi } from '@/lib/fetch-api';
import type { CreateSpeakerDto, Speaker, UpdateSpeakerDto } from '@/lib/types/speaker';
import { HTTP_METHODS } from 'next/dist/server/web/http';

export interface PresignedUrlResponse {
  statusCode: number;
  data: {
    key: string;
    url: string;
  };
}

export const SpeakerService = {
  getAll: async (eventId: string) => {
    return fetchApi<Speaker[]>(ENDPOINTS.SPEAKERS.ROOT(eventId), {
      method: HTTP_METHODS[0],
    });
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

  getUploadUrl: async ({
    eventId,
    speakerId,
    contentType,
  }: {
    eventId: string;
    speakerId: string;
    contentType: string;
  }): Promise<PresignedUrlResponse> => {
    return fetchApi(ENDPOINTS.SPEAKERS.UPLOAD_URL(eventId, speakerId), {
      method: HTTP_METHODS[3],
      body: JSON.stringify({ contentType }),
    });
  },
};
