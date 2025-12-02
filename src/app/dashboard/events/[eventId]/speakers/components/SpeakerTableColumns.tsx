'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/app/dashboard/schedule/components/data-table-column-header';
import { MoreHorizontal, Pencil, Trash2, Linkedin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Speaker } from '@/lib/types/schedule';

export const getSpeakerColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit?: (speaker: Speaker) => void;
  onDelete?: (speaker: Speaker) => void;
}): ColumnDef<Speaker>[] => [
  {
    accessorKey: 'name', // used as id internally
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const speaker = row.original;
      const first = speaker.name?.firstName || '';
      const last = speaker.name?.lastName || '';
      const initials = `${first[0] ?? ''}${last[0] ?? ''}` || '?';
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {speaker.pictureUrl ? (
              <AvatarImage src={speaker.pictureUrl} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
          <span className="font-medium text-gray-900">
            {first} {last}
          </span>
        </div>
      );
    },
  },
  {
    id: 'linkedin',
    header: ({ column }) => <DataTableColumnHeader column={column} title="LinkedIn" />,
    cell: ({ row }) => {
      const speaker = row.original;
      if (!speaker.linkedInUrl) {
        return <span className="text-gray-400">—</span>;
      }

      return (
        <a
          href={speaker.linkedInUrl}
          target="_blank" // opens in new tab
          rel="noopener noreferrer" // security best practice
          className="flex items-center justify-center text-blue-600 hover:text-blue-800"
        >
          <Linkedin className="h-4 w-4" />
        </a>
      );
    },
    meta: { className: 'text-center' },
  },
  {
    id: 'actions',
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const speaker = row.original;
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md p-2 hover:bg-gray-100">
              <MoreHorizontal className="h-5 w-5 text-gray-600" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => onEdit?.(speaker)}>
                <Pencil className="mr-2 h-4 w-4 text-sky-500" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(speaker)}
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
