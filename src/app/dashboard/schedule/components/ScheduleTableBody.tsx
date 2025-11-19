'use client';

import { Event } from '@/lib/types/components';
import ScheduleTableRow from './ScheduleRow';

interface Props {
  events: Event[];
  activeTab: string;
}

export default function ScheduleTableBody({ events, activeTab }: Props) {
  const filteredEvents = events.filter((e) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return e.status === 'PENDING';
    if (activeTab === 'UPCOMING') return e.status === 'UPCOMING';
    if (activeTab === 'PAST') return e.status === 'PAST';
    return true;
  });

  if (!filteredEvents.length) {
    return <div className="p-6 text-center text-gray-500">No schedules found.</div>;
  }

  return (
    <div className="max-h-[600px] divide-y overflow-y-auto rounded-md bg-white">
      {filteredEvents.map((event) => (
        <ScheduleTableRow key={event._id} item={event} />
      ))}
    </div>
  );
}
