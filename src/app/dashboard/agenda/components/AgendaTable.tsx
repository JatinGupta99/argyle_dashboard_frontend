'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AgendaTableProps {
  data: any[];
}

export function AgendaTable({ data }: AgendaTableProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-sky-300 text-left">
            <th className="rounded-l-lg p-2">Session ID</th>
            <th className="p-2">Title</th>
            <th className="p-2">Time & Date</th>
            <th className="p-2">Audience Polls</th>
            <th className="rounded-r-lg p-2">Speaker</th>
          </tr>
        </thead>

        <tbody>
          {(data || []).map((row) => (
            <tr
              key={row.id || `${row.title}-${Math.random()}`}
              className="hover:bg-muted/30 border-b transition-colors"
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
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{row.speaker}</span>
                    <span className="text-xs text-gray-500">{row.position}</span>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
