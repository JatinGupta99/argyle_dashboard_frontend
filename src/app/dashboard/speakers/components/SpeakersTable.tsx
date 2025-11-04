'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Speaker } from '@/lib/types/speaker';
import { Pencil } from 'lucide-react';

interface SpeakersTableProps {
  speakers: Speaker[];
  onEdit?: (speaker: Speaker) => void;
  height?: string;
}

export function SpeakersTable({ speakers, onEdit, height = '60vh' }: SpeakersTableProps) {
  return (
    <div className="rounded-lg border border-gray-200 shadow-sm" style={{ height }}>
      <div className="h-full overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-sky-200">
            <tr className="text-left text-blue-500">
              <th className="sticky top-0 bg-sky-200 p-2">ID</th>
              <th className="sticky top-0 bg-sky-200 p-2">Name</th>
              <th className="sticky top-0 bg-sky-200 p-2">Title</th>
              <th className="sticky top-0 bg-sky-200 p-2">Company</th>
              <th className="sticky top-0 bg-sky-200 p-2">Email</th>
              <th className="sticky top-0 bg-sky-200 p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {speakers.map((speaker) => {
              const fullName = `${speaker.name.firstName} ${speaker.name.lastName}`;
              return (
                <tr key={speaker._id} className="border-b transition-colors hover:bg-gray-50">
                  <td className="p-2 font-semibold text-sky-500">{speaker._id}</td>
                  <td className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      {speaker.pictureUrl ? (
                        <AvatarImage src={speaker.pictureUrl} alt={fullName} />
                      ) : (
                        <AvatarFallback>
                          {speaker.name.firstName[0]}
                          {speaker.name.lastName[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {fullName}
                  </td>
                  <td className="p-2">{speaker.title}</td>
                  <td className="p-2">{speaker.companyName}</td>
                  <td className="p-2">{speaker.email}</td>
                  <td className="p-2">
                    <button
                      className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
                      onClick={() => onEdit?.(speaker)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
