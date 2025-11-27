'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchAgendas } from '@/redux/slices/agenda-thunks';
import { RootState } from '@/redux/store';

interface AgendasContextType {
  agendas: any[];
  meta: { total: number; totalPages: number };
  query: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  };
  setQuery: (q: any) => void;
  isLoading: boolean;
  error: string | null;
}

const AgendasContext = createContext<AgendasContextType | undefined>(undefined);

export const AgendasContextProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  const { items, meta, query, loading, error, eventId } = useAppSelector(
    (s: RootState) => s.agendas
  );

  const [internalQuery, setInternalQuery] = useState(query);

  // Sync Redux -> local query
  useEffect(() => {
    setInternalQuery(query);
  }, [query]);

  // Fetch on query change
  useEffect(() => {
    if (!eventId) return;
    dispatch(fetchAgendas());
  }, [internalQuery, eventId, dispatch]);

  return (
    <AgendasContext.Provider
      value={{
        agendas: items,
        meta,
        query: internalQuery,
        setQuery: setInternalQuery,
        isLoading: loading,
        error,
      }}
    >
      {children}
    </AgendasContext.Provider>
  );
};

export const useAgendasContext = () => {
  const ctx = useContext(AgendasContext);
  if (!ctx) throw new Error('useAgendasContext must be used inside AgendasContextProvider');
  return ctx;
};
