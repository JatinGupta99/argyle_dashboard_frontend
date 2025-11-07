'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchSpeakers } from '@/redux/slices/speaker-slice';
import { setExportLabel } from '@/redux/slices/toolbar-slice';
import { useEffect } from 'react';

export const useSpeakers = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((state) => state.speakers);

  useEffect(() => {
    dispatch(setExportLabel('Add Speaker'));
    dispatch(fetchSpeakers());
  }, [dispatch]);

  return { list, loading, error };
};
