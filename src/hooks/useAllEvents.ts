import { Event } from '@/lib/types/components';
import { privateApiClient } from '@/lib/api-client-private';
import { ENDPOINTS } from '@/lib/api-endpoints';

export interface EventQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  from_date?: string;
  to_date?: string;
}

export interface PaginatedEventsResponse {
  events: Event[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function fetchEvents(query: EventQuery): Promise<PaginatedEventsResponse> {
  try {
    const params = new URLSearchParams(
      Object.entries(query).reduce(
        (acc, [k, v]) => {
          if (v !== undefined && v !== null) acc[k] = String(v);
          return acc;
        },
        {} as Record<string, string>,
      ),
    );

    const response = await privateApiClient.get(
      ENDPOINTS.EVENTS.FETCH_ALL_EVENT_DETAILS + `?${params.toString()}`,
    );

    const data = response.data;
    console.log(data, 'acslkascnl'); // request response log

    const meta = data;
    const res = {
      events: meta?.events || [],
      meta: {
        page: meta?.page || 1,
        limit: meta?.limit || 10,
        total: meta?.total || 0,
        totalPages: meta?.totalPages || 1,
      },
    };
    console.log(res, 'csancsl'); // final processed log

    return res;
  } catch (err) {
    console.error('Error fetching events', err);
    throw err; // propagate error to React Query or calling function
  }
}
