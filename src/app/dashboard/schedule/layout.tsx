'use client';

import { EventsContextProvider } from '@/components/providers/EventsContextProvider';
import { useAllEvents } from '@/hooks/useAllEvents';
import { Loader2 } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { events, isLoading, error } = useAllEvents();
  console.log(events, 'events in schedule layout before loading check');
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-primary animate-spin" size={32} />
      </div>
    );
  }
  if (error || !events) {
    console.error('❌ Failed to load events:', error);
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Failed to load events details.
      </div>
    );
  }
  console.log(events, 'events in schedule layout');
  return (
    <EventsContextProvider events={events}>
      <div>{children}</div>
    </EventsContextProvider>
  );
}
