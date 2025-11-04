'use client';

import { useState, useEffect, useCallback } from 'react';
import { SpeakerService } from '@/services/speaker.service';
import type { Speaker } from '@/lib/types/speaker';

export const useSpeakers = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpeakers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await SpeakerService.getAll();
      const unique = Array.from(new Map(data.map((s) => [s._id, s])).values());
      setSpeakers(unique);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpeakers();
  }, [fetchSpeakers]);

  return { speakers, loading, error, refetch: fetchSpeakers };
};
