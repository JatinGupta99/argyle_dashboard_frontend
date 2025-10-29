'use client';

import { Linkedin } from 'lucide-react';
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
  refetch?: () => void;
}

export function SpeakersTable({ speakers }: SpeakersTableProps) {
  if (!Array.isArray(speakers) || speakers.length === 0) {
    return <div className="py-10 text-center text-gray-500">No speakers found.</div>;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-center">LinkedIn</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {speakers.map((speaker) => {
            const initials = `${speaker.name?.firstName?.[0] ?? ''}${speaker.name?.lastName?.[0] ?? ''}`;
            return (
              <TableRow key={speaker._id}>
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
