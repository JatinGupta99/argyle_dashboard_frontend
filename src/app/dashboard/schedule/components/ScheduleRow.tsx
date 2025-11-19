'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Event } from '@/lib/types/components';
import { Clock } from 'lucide-react';
import EventId from '../cells/EventId';
import FormattedDate from '../cells/FormattedDate';
import StatusBadge from '../cells/StatusBadge';
import { useSpeakers } from '@/hooks/useSpeakers';

function formatTime(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ScheduleTableRow({ item }: { item: Event }) {
  const { speakers = [], loading } = useSpeakers(item._id);

  return (
    <TableRow className="hover:bg-gray-50">
      {/* 1. Event ID */}
      <TableCell className="w-[140px] px-4 whitespace-nowrap">
        <EventId id={item._id} />
      </TableCell>

      {/* 2. Title */}
      <TableCell className="max-w-[350px] min-w-[240px] px-4">
        <div className="line-clamp-2 font-medium break-words whitespace-normal text-gray-700">
          {item.title}
        </div>
      </TableCell>

      {/* 3. Date */}
      <TableCell className="w-[140px] px-4 whitespace-nowrap">
        <FormattedDate date={item.EventDate} />
      </TableCell>

      {/* 4. Time */}
      <TableCell className="w-[170px] px-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-sky-400" />
          <span>
            {formatTime(item.schedule.startTime)} – {formatTime(item.schedule.endTime)}
          </span>
        </div>
      </TableCell>

      {/* 5. Speakers */}
      <TableCell className="w-[220px] px-4">
        {loading ? (
          <span className="text-xs text-gray-400">Loading...</span>
        ) : speakers.length === 0 ? (
          <span className="text-xs text-gray-400">No speakers</span>
        ) : (
          <div className="flex max-w-[200px] flex-wrap gap-2">
            {speakers.map((sp) => (
              <div key={sp._id} className="flex max-w-[180px] items-center gap-1 overflow-hidden">
                <img
                  src={sp.pictureUrl || '/placeholder-user.jpg'}
                  alt={sp.name.firstName}
                  className="h-6 w-6 flex-shrink-0 rounded-full border object-cover"
                />
                <span className="truncate text-xs text-gray-700">
                  {sp.name.firstName} {sp.name.lastName}
                </span>
              </div>
            ))}
          </div>
        )}
      </TableCell>

      {/* 6. Status */}
      <TableCell className="w-[120px] px-4 whitespace-nowrap">
        <StatusBadge status={item.status} />
      </TableCell>
    </TableRow>
  );
}
