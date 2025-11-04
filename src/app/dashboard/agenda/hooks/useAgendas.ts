'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Agenda {
  id: string;
  title: string;
  date: string;
  speaker: string;
  position?: string;
  profileUrl?: string;
  audiencePoll?: boolean;
}

export function useAgendas() {
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgendas = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ Hardcoded dummy data
      const data: Agenda[] = Array.from({ length: 100 }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        title: `AI & Cloud Conference ${i + 1}`,
        date: '23-10-2025 10:00 AM - 12:00 PM',
        speaker: 'John Deo',
        position: 'CEO of Melonleaf',
        profileUrl: '/images/schedule.webp',
        audiencePoll: i % 2 === 0,
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

  return { agendas, loading, error, fetchAgendas };
}
