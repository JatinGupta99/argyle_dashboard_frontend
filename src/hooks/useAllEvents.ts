import { privateApiClient } from '@/lib/api-client-private';
import { ENDPOINTS } from '@/lib/api-endpoints';
import { Event } from '@/lib/types/components';
import { useApiRequest } from '@/lib/useApiRequest';

export function useAllEvents() {
  const { data, isLoading, error, refetch } = useApiRequest<{ data: Event[] }>(
    () => privateApiClient.get(ENDPOINTS.Event.FETCH_ALL),
    [],
  );
  console.log('Events data:', data);
  const events: Event[] = data?.data || [];

  return {
    events,
    isLoading,
    error,
    refetch,
  };
}
