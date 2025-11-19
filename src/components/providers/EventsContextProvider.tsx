'use client';

import type { Event } from '@/lib/types/components';
import { createContext, useContext, useMemo } from 'react';

// Context holds an ARRAY of events
const EventsContext = createContext<Event[] | undefined>(undefined);

export function EventsContextProvider({
  events,
  children,
}: {
  events: Event[];
  children: React.ReactNode;
}) {
  // Normalize all events
  const normalizedEvents = useMemo(() => {
    return events.map((event) => {
      if (!event.schedule) return event;

      return {
        ...event,
        schedule: {
          ...event.schedule,
          startTime: new Date(event.schedule.startTime),
          endTime: new Date(event.schedule.endTime),
        },
      };
    });
  }, [events]);

  return <EventsContext.Provider value={normalizedEvents}>{children}</EventsContext.Provider>;
}

export function useEventsContext() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEventsContext must be used within EventsContextProvider');
  }
  return context;
}
