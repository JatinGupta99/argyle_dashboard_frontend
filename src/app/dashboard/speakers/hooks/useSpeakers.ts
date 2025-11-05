'use client';

import { useEffect } from 'react';
import { fetchSpeakers } from '@/redux/slices/speaker-slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setExportAction, setExportLabel } from '@/redux/slices/toolbar-slice';

export const useSpeakers = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((state) => state.speakers);

  useEffect(() => {
    dispatch(setExportLabel('Add Speaker'));
    dispatch(setExportAction('addSpeaker'));
    dispatch(fetchSpeakers());
  }, [dispatch]);

  return { list, loading, error };
};
