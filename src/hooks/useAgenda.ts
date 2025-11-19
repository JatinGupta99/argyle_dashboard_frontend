'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchAgendas } from '@/redux/slices/agenda-thunks';

export const useAgendas = (eventId: string) => {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((state) => state.agendas);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchAgendas(eventId));
    }
  }, [dispatch, eventId]);

  return {
    agendas: list,
    loading,
    error,
  };
};
