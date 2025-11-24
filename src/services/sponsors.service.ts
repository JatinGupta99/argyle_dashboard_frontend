import { ENDPOINTS } from '@/lib/api-endpoints';
import { fetchApi } from '@/lib/fetch-api';
import type {
  CreateSponsorDto,
  Sponsor,
  CreateSponsorDto as UpdateSponsorDto,
} from '@/lib/types/sponsor';

export interface PresignedUrlResponse {
  statusCode: number;
  data: {
    key: string; // S3 Key
    uploadUrl: string; // Pre-signed PUT URL
  };
}

export const SponsorService = {
  /* ------------------------------------------------------------
     GET ALL SPONSORS
  -------------------------------------------------------------*/
  getAll: async (eventId: string) => {
    return await fetchApi<{ results: Sponsor[] }>(ENDPOINTS.SPONSORS.ROOT(eventId), {
      method: 'GET',
    });
  },

  /* ------------------------------------------------------------
     GET SPONSOR BY ID
  -------------------------------------------------------------*/
  getById: async (eventId: string, sponsorId: string) => {
    return fetchApi(ENDPOINTS.SPONSORS.BY_ID(eventId, sponsorId), { method: 'GET' });
  },

  /* ------------------------------------------------------------
     CREATE SPONSOR (NO FILES HERE)
  -------------------------------------------------------------*/
  create: async (eventId: string, payload: CreateSponsorDto) => {
    return fetchApi(ENDPOINTS.SPONSORS.ROOT(eventId), {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /* ------------------------------------------------------------
     UPDATE SPONSOR
  -------------------------------------------------------------*/
  update: async (eventId: string, sponsorId: string, payload: UpdateSponsorDto) => {
    return fetchApi(ENDPOINTS.SPONSORS.BY_ID(eventId, sponsorId), {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /* ------------------------------------------------------------
     DELETE SPONSOR
  -------------------------------------------------------------*/
  remove: async (eventId: string, sponsorId: string) => {
    return fetchApi(ENDPOINTS.SPONSORS.BY_ID(eventId, sponsorId), { method: 'DELETE' });
  },

  /* ------------------------------------------------------------
     GET PRE-SIGNED URL
  -------------------------------------------------------------*/
  getUploadUrl: async (params: {
    eventId: string;
    sponsorId: string;
    contentType: string;
    type: 'logo' | 'document';
  }): Promise<PresignedUrlResponse> => {
    const { eventId, sponsorId, contentType, type } = params;

    return fetchApi(ENDPOINTS.SPONSORS.UPLOAD_URL(eventId, sponsorId), {
      method: 'POST',
      body: JSON.stringify({ contentType, type }),
    });
  },

  /* ------------------------------------------------------------
     UPLOAD TO PRESIGNED S3 URL
  -------------------------------------------------------------*/
  uploadToPresignedUrl: async (uploadUrl: string, file: File) => {
    return fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
  },

  /* ------------------------------------------------------------
     CONFIRM FILE UPLOAD TO BACKEND (OPTIONAL)
     Use ONLY IF your backend expects a confirmation.
  -------------------------------------------------------------*/
  confirmUpload: async (params: {
    eventId: string;
    sponsorId: string;
    key: string;
    type: 'logo' | 'document';
  }) => {
    const { eventId, sponsorId, key, type } = params;

    return fetchApi(ENDPOINTS.SPONSORS.CONFIRM_UPLOAD(eventId, sponsorId), {
      method: 'POST',
      body: JSON.stringify({ key, type }),
    });
  },
};
