import { ENDPOINTS } from '@/lib/api-endpoints';
import { fetchApi } from '@/lib/fetch-api';
import type {
  CreateSponsorDto,
  Sponsor,
  CreateSponsorDto as UpdateSponsorDto,
} from '@/lib/types/sponsor';
import { HTTP_METHODS } from 'next/dist/server/web/http';

export interface PresignedUrlResponse {
  statusCode: number;
  data: {
    key: string;
    url: string;
  };
}

export const SponsorService = {
  getAll: async (eventId: string) => {
    const data = fetchApi<{ results: Sponsor[] }>(ENDPOINTS.SPONSORS.ROOT(eventId), {
      method: HTTP_METHODS[0],
    });
    return (await data).data.results;
  },

  getById: async (eventId: string, sponsorId: string) => {
    return fetchApi(ENDPOINTS.SPONSORS.BY_ID(eventId, sponsorId), {
      method: HTTP_METHODS[0],
    });
  },

  create: async (eventId: string, payload: CreateSponsorDto) => {
    return fetchApi(ENDPOINTS.SPONSORS.ROOT(eventId), {
      method: HTTP_METHODS[3],
      body: JSON.stringify(payload),
    });
  },

  update: async (eventId: string, sponsorId: string, payload: UpdateSponsorDto) => {
    return fetchApi(ENDPOINTS.SPONSORS.BY_ID(eventId, sponsorId), {
      method: HTTP_METHODS[6],
      body: JSON.stringify(payload),
    });
  },

  remove: async (eventId: string, sponsorId: string) => {
    return fetchApi(ENDPOINTS.SPONSORS.BY_ID(eventId, sponsorId), {
      method: HTTP_METHODS[5],
    });
  },

  getUploadUrl: async ({
    eventId,
    sponsorId,
    contentType,
  }: {
    eventId: string;
    sponsorId: string;
    contentType: string;
  }): Promise<PresignedUrlResponse> => {
    return fetchApi(ENDPOINTS.SPONSORS.UPLOAD_URL(eventId, sponsorId), {
      method: HTTP_METHODS[3],
      body: JSON.stringify({ contentType }),
    });
  },
};
