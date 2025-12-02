import { ENDPOINTS } from '@/lib/api-endpoints';
import { fetchApi } from '@/lib/fetch-api';
import { Agenda } from '@/lib/types/agenda';
import { HTTP_METHODS } from 'next/dist/server/web/http';

export const AgendaService = {
  getAll: async (
    eventId: string,
    query?: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    },
  ) => {
    const params = new URLSearchParams();
    params.append('page', String(query?.page ?? 1));
    params.append('limit', String(query?.limit ?? 10));

    if (query?.search) params.append('search', query.search);
    if (query?.sortBy) params.append('sortBy', query.sortBy);
    if (query?.sortOrder) params.append('sortOrder', query.sortOrder);

    return await fetchApi(`${ENDPOINTS.AGENDAS.ROOT(eventId)}?${params.toString()}`, {
      method: HTTP_METHODS[0], // GET
    });
  },

  getById: async (eventId: string, agendaId: string) => {
    return await fetchApi<Agenda>(ENDPOINTS.AGENDAS.BY_ID(eventId, agendaId), {
      method: HTTP_METHODS[0],
    });
  },

  create: async (eventId: string, payload: any) => {
    return fetchApi(ENDPOINTS.AGENDAS.ROOT(eventId), {
      method: HTTP_METHODS[3],
      body: JSON.stringify(payload),
    });
  },
  update: async (eventId: string, agendaId: string, payload: any) => {
    return fetchApi(ENDPOINTS.AGENDAS.BY_ID(eventId, agendaId), {
      method: HTTP_METHODS[6],
      body: JSON.stringify(payload),
    });
  },

  remove: async (eventId: string, agendaId: string) => {
    return fetchApi(ENDPOINTS.AGENDAS.BY_ID(eventId, agendaId), {
      method: HTTP_METHODS[5],
    });
  },
};
