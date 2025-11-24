import { ENDPOINTS } from '@/lib/api-endpoints';
import { fetchApi } from '@/lib/fetch-api';
import type { CreateEventDto, Event, UpdateEventDto } from '@/lib/types/components';
import { HTTP_METHODS } from 'next/dist/server/web/http';

export interface PresignedUrlResponse {
  statusCode: number;
  data: {
    key: string;
    url: string;
  };
}

export const EventService = {
  getAll: async (query: { page?: number; limit?: number; search?: string } = {}) => {
    return fetchApi<Event[]>(ENDPOINTS.EVENTS.FETCH_ALL_EVENT_DETAILS, {
      method: HTTP_METHODS[0],
      query,
    });
  },

  getById: async (eventId: string) => {
    return fetchApi<Event>(ENDPOINTS.EVENTS.UPDATE_BY_ID(eventId), {
      method: HTTP_METHODS[0],
    });
  },

  create: async (payload: CreateEventDto) => {
    return fetchApi<Event>(ENDPOINTS.EVENTS.ROOT, {
      method: HTTP_METHODS[3],
      body: JSON.stringify(payload),
    });
  },

  update: async (eventId: string, payload: UpdateEventDto) => {
    return fetchApi<Event>(ENDPOINTS.EVENTS.UPDATE_BY_ID(eventId), {
      method: HTTP_METHODS[6],
      body: JSON.stringify(payload),
    });
  },

  remove: async (eventId: string) => {
    return fetchApi<void>(ENDPOINTS.EVENTS.DELETE_BY_ID(eventId), {
      method: HTTP_METHODS[5],
    });
  },

  // Presigned URL for uploading event logo or documents
  getUploadUrl: async (params: {
    eventId: string;
    contentType: string;
    type: 'logo' | 'document';
  }): Promise<PresignedUrlResponse> => {
    const { eventId, contentType, type } = params;

    return fetchApi<PresignedUrlResponse>(ENDPOINTS.EVENTS.UPLOAD_URL(eventId), {
      method: 'POST',
      body: JSON.stringify({ contentType, type }),
    });
  },
};
