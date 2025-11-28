'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { ListUser, User } from '@/lib/types/user';
import StatusBadge from '../../schedule/cells/StatusBadge';
interface UserColumnsProps {
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export function userColumns({ onEdit, onDelete }: UserColumnsProps,currentPage: number,        // pass in current page
  pageSize: number ): ColumnDef<ListUser>[] {
  return [
   {
      id: 'serial',
      header: 'No',
      cell: ({ row }) => {
        const serial = (currentPage - 1) * pageSize + row.index + 1;
        return <span>{serial}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: 'Name',
      accessorKey: 'name',
      id: 'fullName',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: ({ row }) => <StatusBadge status={row.original.role} />,
    },
    {
      header: 'Created',
      accessorKey: 'createdAt',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-md p-2 hover:bg-gray-100">
                <MoreHorizontal className="h-5 w-5 text-gray-600" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => onEdit?.(user)}>
                  <Pencil className="mr-2 h-4 w-4 text-sky-500" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(user)}
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
}
