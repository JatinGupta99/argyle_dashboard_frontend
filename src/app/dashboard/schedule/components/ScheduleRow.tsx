'use client';
import { DataTableColumnHeader } from '@/app/dashboard/schedule/components/data-table-column-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Event } from '@/lib/types/components';
import { ColumnDef } from '@tanstack/react-table';
import { Clock, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import EventId from '../cells/EventId';
import FormattedDate from '../cells/FormattedDate';
import StatusBadge from '../cells/StatusBadge';

function formatTime(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Make this a function that accepts callbacks
export const scheduleColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
}): ColumnDef<Event>[] => [
  {
    accessorKey: '_id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Event ID" />,
    cell: ({ row }) => <EventId id={row.original._id} />,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => (
      <Link
        href={`/dashboard/events/${row.original._id}`}
        className="line-clamp-2 block max-w-[350px] min-w-[240px] cursor-pointer font-medium text-gray-700 hover:text-sky-600 hover:underline"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: 'EventDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => <FormattedDate date={row.original.EventDate} />,
  },
  {
    accessorKey: 'schedule',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Time" />,
    cell: ({ row }) => {
      const item = row.original;
      const start = item?.schedule?.startTime ? formatTime(item.schedule.startTime) : '--';
      const end = item?.schedule?.endTime ? formatTime(item.schedule.endTime) : '--';
      return (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Clock className="h-4 w-4 text-sky-400" />
          <span>
            {start} – {end}
          </span>
        </div>
      );
    },
  },
  {
    id: 'speakers',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Speakers" />,

    cell: ({ row }) => {
      const speakers = row.original.speakerPreview || [];
      const totalSpeakers = row.original.speakerCount || 0;

      // Take first 2 speakers for avatars
      const visibleSpeakers = speakers.slice(0, 2);
      const remainingCount = totalSpeakers - visibleSpeakers.length;

      return (
        <div className="flex items-center gap-1">
          <div className="flex -space-x-2">
            {visibleSpeakers.map((sp: any) => (
              <Avatar key={sp.id} className="h-6 w-6 border-2 border-white">
                {sp.photo && sp.photo.trim() !== '' ? (
                  <AvatarImage
                    src={sp.photo}
                    alt={sp.name || 'image'}
                    onError={(e) => {
                      e.currentTarget.onerror = null; // prevent looping
                      e.currentTarget.src = '/images/avatar-fallback.png'; // force fallback rendering
                    }}
                  />
                ) : null}

                <AvatarFallback className="bg-gray-200 text-[8px] text-gray-700">
                  Speaker not found
                </AvatarFallback>
              </Avatar>
            ))}
          </div>

          {remainingCount > 0 && (
            <span className="text-xs text-gray-600">+{remainingCount} more people</span>
          )}
        </div>
      );
    },
  },

  {
    id: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: 'actions',
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md p-2 hover:bg-gray-100">
              <MoreHorizontal className="h-5 w-5 text-gray-600" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => onEdit?.(event)}>
                <Pencil className="mr-2 h-4 w-4 text-sky-500" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onDelete?.(event)}
                className="text-red-600 focus:text-red-600"
              >
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
