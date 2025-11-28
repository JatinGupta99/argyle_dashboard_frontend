'use client';

import { DataTableColumnHeader } from '@/app/dashboard/schedule/components/data-table-column-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Speaker } from '@/lib/types/speaker';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

export const getSpeakerColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit?: (speaker: Speaker) => void;
  onDelete?: (speaker: Speaker) => void;
}): ColumnDef<Speaker>[] => [
  {
    id: 'no',
    header: ({column}) => <DataTableColumnHeader column={column} title="No" />,
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const speaker = row.original as Speaker;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {speaker.pictureUrl ? (
              <AvatarImage src={speaker.pictureUrl} alt={speaker.name.firstName} />
            ) : (
              <AvatarFallback>{speaker.name.firstName?.charAt(0) ?? '?'}</AvatarFallback>
            )}
          </Avatar>
          <span className="font-medium text-gray-900">{speaker.name.firstName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => <span>{row.original.title || '—'}</span>,
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
                <Pencil className="mr-2 h-4 w-4 text-sky-500" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(speaker)} className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
