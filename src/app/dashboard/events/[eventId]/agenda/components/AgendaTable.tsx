'use client';

import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface AgendaTableProps {
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void; // <-- added
}

function formatAgendaTime(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);

  const date = s.toLocaleDateString();
  const startTime = s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return `${date} • ${startTime} - ${endTime}`;
}

export function AgendaTable({ data, onEdit, onDelete }: AgendaTableProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-sky-300 text-left">
            <th className="p-2">Session Title</th>
            <th className="p-2">Time</th>
            <th className="p-2">Audience Polls</th>
            <th className="p-2">Speaker</th>
            <th className="rounded-r-lg p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={row._id}
              className="hover:bg-muted/30 border-b transition-colors"
            >
              {/* Title */}
              <td className="p-2 font-medium">{row.title}</td>

              {/* Time */}
              <td className="p-2">
                {formatAgendaTime(row.startDateTime, row.endDateTime)}
              </td>

              {/* Poll */}
              <td
                className={`p-2 font-semibold ${
                  row.hasPoll ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {row.hasPoll ? 'Yes' : 'No'}
              </td>

              {/* Speaker */}
              <td className="p-2">
                {row.speakers?.length ? (
                  <span>{row.speakers.length} speaker(s)</span>
                ) : (
                  <span className="text-gray-400">No speaker</span>
                )}
              </td>

              {/* Actions */}
              <td className="p-2 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(row)}
                  className="p-1"
                >
                  <Pencil className="h-4 w-4 text-sky-500" />
                </Button>

                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(row)}
                    className="p-1"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
