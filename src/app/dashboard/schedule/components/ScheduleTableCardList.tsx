'use client';

import { useState } from 'react';
import { Event } from '@/lib/types/components';
import { ScheduleCardWrapper } from './ScheduleCardWrapper';

export function ScheduleTableCardList({ events }: { events: Event[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!events || events.length === 0) {
    return <div className="py-10 text-center text-gray-500">No schedules found.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <ScheduleCardWrapper
          key={event._id}
          event={event}
          selected={selectedId === event._id}
          onSelect={() => setSelectedId(event._id)}
        />
      ))}
    </div>
  );
}
