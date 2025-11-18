import { ENDPOINTS } from '@/lib/api-endpoints';
import { fetchApi } from '@/lib/fetch-api';
import { Agenda } from '@/lib/types/agenda';
import { HTTP_METHODS } from 'next/dist/server/web/http';

export const AgendaService = {
  getAll: async (eventId: string): Promise<Agenda[]> => {
    const res = await fetchApi<any>(ENDPOINTS.AGENDAS.ROOT(eventId), {
      method: HTTP_METHODS[0],
    });
    return Array.isArray(res) ? res : res.data || [];
  },

  getById: async (eventId: string, agendaId: string) => {
    return await fetchApi<any>(ENDPOINTS.AGENDAS.BY_ID(eventId, agendaId), {
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
