'use client';

import { useEffect } from 'react';
import ScheduleTable from './ScheduleTable';
import { useEventsContext } from '@/components/providers/EventsContextProvider';

interface Props {
  activeTab: string; // ALL, PENDING, UPCOMING, PAST
}

export default function ScheduleTableBody({ activeTab }: Props) {
  const { events, isLoading, error, query, setQuery } = useEventsContext();

  useEffect(() => {
    setQuery({
      ...query,
      page: 1,
      status: activeTab !== 'ALL' ? activeTab : undefined,
    });
  }, [activeTab, ]);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <span className="text-primary animate-spin">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Failed to load events.</div>;
  }

  if (!events.length) {
    return <div className="p-6 text-center text-gray-500">No schedules found.</div>;
  }

  return (
    <div className="max-h-[600px] w-full divide-y overflow-y-auto rounded-md bg-white">
      <ScheduleTable />
    </div>
  );
}
