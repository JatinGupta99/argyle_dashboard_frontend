'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchSponsors } from '@/redux/slices/sponsor-slice';
export const useSponsors = () => {
  const dispatch = useAppDispatch();

  // Match EXACT fields from SponsorState
  const { eventId, items, loading, error } = useAppSelector((state) => state.sponsors);

  const refresh = () => {
    if (eventId) {
      dispatch(fetchSponsors());
    }
  };

  useEffect(() => {
    refresh();
  }, [eventId]);

  return {
    sponsors: items,
    loading,
    error,
    refresh,
  };
};
