'use client';

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { EmptyState } from '@/components/ui/empty-state';

import type { Sponsor } from '@/lib/types/sponsor';

interface SponsorsTableProps {
  sponsors: Sponsor[];
  onEdit?: (sponsor: Sponsor) => void;
  onDelete?: (sponsor: Sponsor) => void;
}

export function SponsorsTable({ sponsors, onEdit, onDelete }: SponsorsTableProps) {
  if (!Array.isArray(sponsors) || sponsors.length === 0) {
    return <EmptyState message="No sponsors found for this event" />;
  }

  return (
    <div className="h-[40vh] overflow-y-auto rounded-lg border border-gray-200 shadow-sm">
      <Table className="w-full text-sm">
        <TableHeader className="sticky top-0 z-10 bg-gray-50 shadow-sm">
          <TableRow>
            <TableHead className="w-12 text-center">No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-20 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sponsors.map((s, index) => (
            <TableRow key={s._id} className="hover:bg-gray-50">
              <TableCell className="text-center text-gray-600">{index + 1}</TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={s.logoKey || ''} />
                    <AvatarFallback>{s.name?.charAt(0) ?? '?'}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-900">{s.name}</span>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="rounded-md p-2 hover:bg-gray-100">
                    <MoreHorizontal className="h-5 w-5 text-gray-600" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => onEdit?.(s)}>
                      <Pencil className="mr-2 h-4 w-4 text-sky-500" />
                      Modify
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onDelete?.(s)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
