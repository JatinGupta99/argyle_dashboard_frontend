'use client';

import { Linkedin, Edit2, Pencil } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Speaker } from '@/lib/types/speaker';

interface SpeakersTableProps {
  speakers: Speaker[];
  onEdit?: (speaker: Speaker) => void; // Callback for editing
}

export function SpeakersTable({ speakers, onEdit }: SpeakersTableProps) {
  if (!Array.isArray(speakers) || speakers.length === 0) {
    return <div className="py-10 text-center text-gray-500">No speakers found.</div>;
  }

  return (
    <div className="h-[40vh] rounded-lg border border-gray-200 shadow-sm">
      <Table className="w-full text-sm">
        <TableHeader className="sticky top-0 z-10 bg-gray-50 shadow-sm">
          <TableRow>
            <TableHead className="sticky top-0 bg-gray-50">Name</TableHead>
            <TableHead className="sticky top-0 bg-gray-50">Email</TableHead>
            <TableHead className="sticky top-0 bg-gray-50">Title</TableHead>
            <TableHead className="sticky top-0 bg-gray-50">Company</TableHead>
            <TableHead className="sticky top-0 bg-gray-50 text-center">LinkedIn</TableHead>
            <TableHead className="sticky top-0 bg-gray-50 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {speakers.map((speaker) => {
            const initials = `${speaker.name?.firstName?.[0] ?? ''}${speaker.name?.lastName?.[0] ?? ''}`;
            return (
              <TableRow key={speaker._id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={speaker.pictureUrl || ''} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-900">
                      {speaker.name?.firstName} {speaker.name?.lastName}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-blue-600 hover:text-blue-800">
                  <a href={`mailto:${speaker.email}`}>{speaker.email}</a>
                </TableCell>

                <TableCell>{speaker.title}</TableCell>
                <TableCell>{speaker.companyName}</TableCell>

                <TableCell className="text-center">
                  {speaker.linkedInUrl ? (
                    <a
                      href={speaker.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  <button
                    onClick={() => onEdit?.(speaker)}
                    className="text-gray-600 hover:text-gray-900"
                    title="Edit Speaker"
                  >
                    <Pencil className="h-4 w-4 text-sky-400" />
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
