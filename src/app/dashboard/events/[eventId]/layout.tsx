'use client';

import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useEvent } from '@/hooks/useEvents';
import { EventContextProvider } from '@/components/providers/EventContextProvider';

export default function EventLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const eventId = params?.eventId as string;
  const { event, isLoading, error } = useEvent(eventId);
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-primary animate-spin" size={32} />
      </div>
    );
  }
  console.log('✅ Event loaded:', event);
  if (error || !event) {
    console.error('❌ Failed to load event:', error);
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Failed to load event details.
      </div>
    );
  }

  return (
    <EventContextProvider event={event}>
      <div>{children}</div>
    </EventContextProvider>
  );
}
