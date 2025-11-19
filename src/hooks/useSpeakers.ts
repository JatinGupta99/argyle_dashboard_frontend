'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchSpeakers } from '@/redux/slices/speaker-thunks';

export const useSpeakers = (eventId: string) => {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((state) => state.speakers);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchSpeakers(eventId));
    }
  }, [dispatch, eventId]);

  return {
    speakers: list,
    loading,
    error,
  };
};
