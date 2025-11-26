'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Event } from '@/lib/types/components';
import { fetchEvents, EventQuery } from '@/hooks/useAllEvents';

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface EventsContextType {
  events: Event[];
  meta: Meta;
  query: EventQuery;
  setQuery: (q: EventQuery) => void;
  isLoading: boolean;
  error?: any;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsContextProvider({
  children,
  initialEvents = [],
  initialMeta = { page: 1, limit: 10, total: 0, totalPages: 1 },
}: {
  children: React.ReactNode;
  initialEvents?: Event[];
  initialMeta?: Meta;
}) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [meta, setMeta] = useState<Meta>(initialMeta);
  const [query, setQuery] = useState<EventQuery>({ page: 1, limit: initialMeta.limit });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      setError(undefined);
      try {
        const data = await fetchEvents(query);
        console.log(data, 'canlscknasc');
        setEvents(data.events);
        setMeta(data.meta);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [query]);

  return (
    <EventsContext.Provider value={{ events, meta, query, setQuery, isLoading, error }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEventsContext() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEventsContext must be used inside EventsContextProvider');
  return ctx;
}
