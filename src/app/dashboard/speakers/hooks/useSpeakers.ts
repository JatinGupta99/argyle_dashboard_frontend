'use client';

import { useEffect } from 'react';
import { fetchSpeakers } from '@/redux/slices/speaker-slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export const useSpeakers = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((state) => state.speakers);

  useEffect(() => {
    dispatch(fetchSpeakers());
  }, [dispatch]);

  return { list, loading, error };
};
