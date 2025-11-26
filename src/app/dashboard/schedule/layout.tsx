'use client';

import { EventsContextProvider } from '@/components/providers/EventsContextProvider';
import { fetchEvents } from '@/hooks/useAllEvents';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['events', { page: 1, limit: 20 }],
    queryFn: () => fetchEvents({ page: 1, limit: 10 }),
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-primary animate-spin" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Failed to load events.
      </div>
    );
  }

  return (
    <EventsContextProvider
      initialEvents={data?.events || []}
      initialMeta={data?.meta || { page: 1, limit: 20, total: 0, totalPages: 1 }}
    >
      {children}
    </EventsContextProvider>
  );
}
