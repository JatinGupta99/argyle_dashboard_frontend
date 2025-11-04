'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AgendaTableProps {
  data: any[];
  height?: string; // optional height
}

export function AgendaTable({ data, height = '60vh' }: AgendaTableProps) {
  return (
    <div className="rounded-lg border border-gray-200 shadow-sm" style={{ height }}>
      <div className="h-full overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-sky-200">
            <tr className="text-left text-blue-500">
              <th className="sticky top-0 bg-gray-50 p-2">Session ID</th>
              <th className="sticky top-0 bg-gray-50 p-2">Title</th>
              <th className="sticky top-0 bg-gray-50 p-2">Time & Date</th>
              <th className="sticky top-0 bg-gray-50 p-2">Audience Polls</th>
              <th className="sticky top-0 bg-gray-50 p-2">Speaker</th>
            </tr>
          </thead>

          <tbody className="[&_tr:last-child]:border-0">
            {(data || []).map((row) => (
              <tr
                key={row.id || `${row.title}-${Math.random()}`}
                className="border-b transition-colors hover:bg-gray-50"
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
                          .map((n: string[]) => n[0])
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
    </div>
  );
}
