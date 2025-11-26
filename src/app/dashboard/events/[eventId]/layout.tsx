'use client';

import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useEvent } from '@/hooks/useEvents';
import { EventContextProvider } from '@/components/providers/EventContextProvider';
export default function EventLayout({ children }: { children: React.ReactNode }) {
  const { eventId } = useParams() as { eventId: string };
  const { event, isLoading, error } = useEvent(eventId);

  /** 1️⃣ Loading */
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-primary animate-spin" size={32} />
      </div>
    );
  }

  /** 2️⃣ Error from API OR missing event */
  if (error || !event) {
    console.error('❌ Failed to load event:', error ?? 'Event not found');
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        {error ?? 'Event not found.'}
      </div>
    );
  }

  /** 3️⃣ Success → Provide event */
  return <EventContextProvider event={event}>{children}</EventContextProvider>;
}
