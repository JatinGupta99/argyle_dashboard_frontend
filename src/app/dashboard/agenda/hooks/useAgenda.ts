'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Agenda {
  id: string;
  title: string;
  date: string;
  speaker: string;
  audiencePoll: boolean;
  position: string;
  profileUrl: string;
  [key: string]: any;
}

export const useAgendas = () => {
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgendas = useCallback(async () => {
    setLoading(true);
    try {
      // Simulated data
      const data = Array.from({ length: 100 }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        title: `AI & Cloud Conference ${i + 1}`,
        date: '23-10-2025 10:00 AM - 12:00 AM',
        speaker: 'John Deo',
        audiencePoll: i % 2 === 0,
        position: 'CEO of Melonleaf',
        profileUrl: '/images/schedule.webp',
      }));
      setAgendas(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgendas();
  }, [fetchAgendas]);

  return {
    agendas,
    loading,
    error,
    fetchAgendas, // expose it if you need to refetch after add/edit
  };
};
