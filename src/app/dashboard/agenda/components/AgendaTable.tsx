'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgendaTableProps {
  data: any[];
  onEdit?: (row: any) => void;
}

export function AgendaTable({ data, onEdit }: AgendaTableProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-sky-300 text-left">
            <th className="rounded-l-lg p-2">Session ID</th>
            <th className="p-2">Title</th>
            <th className="p-2">Time & Date</th>
            <th className="p-2">Audience Polls</th>
            <th className="p-2">Speaker</th>
            <th className="rounded-r-lg p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id ?? `${row.title}-${Math.random()}`}
              className="border-b transition-colors hover:bg-muted/30"
            >
              <td className="p-2 font-semibold text-sky-500">{row.id}</td>
              <td className="p-2">{row.title}</td>
              <td className="p-2">{row.date}</td>
              <td
                className={`p-2 font-semibold ${
                  row.audiencePoll ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {row.audiencePoll ? 'Yes' : 'No'}
              </td>
              <td className="p-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={row.profileUrl} alt={row.speaker} />
                    <AvatarFallback>
                      {row.speaker
                        ?.split(' ')
                        .map((n: string) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {row.speaker}
                    </span>
                    <span className="text-xs text-gray-500">
                      {row.position}
                    </span>
                  </div>
                </div>
              </td>
              <td className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(row)}
                  className="p-1"
                >
                  <Pencil className="h-4 w-4 text-sky-500" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
