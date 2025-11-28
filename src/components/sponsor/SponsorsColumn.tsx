'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Sponsor } from '@/lib/types/sponsor';
import { DataTableColumnHeader } from '@/app/dashboard/schedule/components/data-table-column-header';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export const getSponsorColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit?: (sponsor: Sponsor) => void;
  onDelete?: (sponsor: Sponsor) => void;
}): ColumnDef<Sponsor>[] => [
  {
    id: 'no',
    header: ({ column }) => <DataTableColumnHeader column={column} title="No" />,
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const sponsor = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {sponsor.logoKey ? (
              <AvatarImage src={sponsor.logoKey} alt={sponsor.name} />
            ) : (
              <AvatarFallback>{sponsor.name?.charAt(0) ?? '?'}</AvatarFallback>
            )}
          </Avatar>
          <span className="font-medium text-gray-900">{sponsor.name}</span>
        </div>
      );
    },
  },
{
  accessorKey: 'website',
  header: ({ column }) => <DataTableColumnHeader column={column} title="Website" />,
cell: ({ row }) => row.original.websiteUrl ? (
  <a href={row.original.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline line-clamp-2">
    {row.original.websiteUrl}
  </a>
) : null
},
  {
    id: 'actions',
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const sponsor = row.original;
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md p-2 hover:bg-gray-100">
              <MoreHorizontal className="h-5 w-5 text-gray-600" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => onEdit?.(sponsor)}>
                <Pencil className="mr-2 h-4 w-4 text-sky-500" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(sponsor)} className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
