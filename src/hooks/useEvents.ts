import { privateApiClient } from '@/lib/api-client-private';
import { ENDPOINTS } from '@/lib/api-endpoints';
import { Event } from '@/lib/types/components';
import { useApiRequest } from '@/lib/useApiRequest';

export function useEvent(eventId: string) {
  const { data, isLoading, error, refetch } = useApiRequest<{ data: Event }>(
    () => privateApiClient.get(ENDPOINTS.Event.FETCH_BY_ID(eventId)),
    [eventId]
  );

  const event: Event | undefined = data?.data;
  return {
    event,
    isLoading,
    error,
    refetch,
  };
}
