'use client';

import { Agenda, SpeakerAssiciatedwithAgendas } from '@/lib/types/agenda';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/app/dashboard/schedule/components/data-table-column-header';
import { MoreHorizontal, Pencil, Trash2, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function formatAgendaTime(start?: string, end?: string) {
  const to12Hour = (time?: string) => {
    if (!time) return '—';
    const [h, m] = time.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return '—';
    const period = h < 12 ? 'AM' : 'PM';
    const hour = h % 12 || 12;
    return `${hour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
  };
  return `${to12Hour(start)} - ${to12Hour(end)}`;
}

export const getAgendaColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit?: (agenda: Agenda) => void;
  onDelete?: (agenda: Agenda) => void;
}): ColumnDef<Agenda>[] => [
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Session Title" />,
    cell: ({ row }) => (
      <span className="line-clamp-2 cursor-pointer text-gray-700 font-medium">{row.original.title}</span>
    ),
  },
{
  id: 'time',
  header: ({ column }) => <DataTableColumnHeader column={column} title="Time" />,
  cell: ({ row }) => {
    const { startTime, endTime } = row.original; // use direct properties
    return (
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Clock className="h-4 w-4 text-sky-400" />
        <span>{formatAgendaTime(startTime, endTime)}</span>
      </div>
    );
  },
},
 {
  accessorKey: 'audiencePolls',
  header: ({ column }) => <DataTableColumnHeader column={column} title="Audience Polls" />,
  cell: ({ row }) => {
    const hasPoll = row.original.hasPoll;
    return (
      <span className={hasPoll ? 'text-green-600 font-bold' : 'text-red-600'}>
        {hasPoll ? 'Yes' : 'No'}
      </span>
    );
  },
},
{
  id: 'speaker',
  header: ({ column }) => <DataTableColumnHeader column={column} title="Speaker" />,
  cell: ({ row }) => {
    const speaker = row.original.speakers?.[0]; // Assuming first speaker from the array
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6 border-2 border-white">
          {speaker?.pictureUrl ? (
            <AvatarImage src={speaker.pictureUrl} alt={`${speaker.name.firstName} ${speaker.name.lastName}`} />
          ) : (
            <AvatarFallback className="bg-gray-200 text-[8px] text-gray-700">N/A</AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium text-sm">{`${speaker?.name.firstName || ''} ${speaker?.name.lastName || ''}`}</span>
          <span className="text-xs text-gray-500">{speaker?.title || '—'}</span>
        </div>
      </div>
    );
  },
}
,
  {
    id: 'actions',
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => {
      const agenda = row.original;
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md p-2 hover:bg-gray-100">
              <MoreHorizontal className="h-5 w-5 text-gray-600" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => onEdit?.(agenda)}>
                <Pencil className="mr-2 h-4 w-4 text-sky-500" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(agenda)} className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
