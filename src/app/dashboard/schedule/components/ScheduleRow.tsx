import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Clock } from 'lucide-react';
import { ScheduleItem } from '@/lib/types/schedule';
import EventId from '../cells/EventId';
import FormattedDate from '../cells/FormattedDate';
import SpeakerCell from '../cells/SpeakerCell';
import StatusBadge from '../cells/StatusBadge';

export default function ScheduleRow({ item }: { item: ScheduleItem }) {
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <EventId id={item._id} />
      </TableCell>

      <TableCell className="font-medium text-gray-700">{item.title}</TableCell>

      <TableCell>
        <FormattedDate date={item.date} />
      </TableCell>

      <TableCell className="flex items-center gap-2 pt-3.5">
        <Clock className="h-4 w-4 text-sky-400" />
        <span>{item.time}</span>
      </TableCell>

      <TableCell>
        <SpeakerCell speakers={item.speakers} />
      </TableCell>

      <TableCell>
        <StatusBadge status={item.status} />
      </TableCell>
    </TableRow>
  );
}
