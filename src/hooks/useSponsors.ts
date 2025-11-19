'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchSponsors } from '@/redux/slices/sponsors-thunks';

export const useAgendas = (eventId: string) => {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((state) => state.agendas);

  const refresh = () => {
    if (eventId) dispatch(fetchSponsors(eventId));
  };

  useEffect(() => {
    refresh();
  }, [eventId]);

  return {
    sponsors: list,
    loading,
    error,
    refresh,
  };
};
