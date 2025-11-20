'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Agenda } from '@/lib/types/agenda';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export interface AgendaTableProps {
  data: Agenda[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}
function formatAgendaTime(start?: string, end?: string) {
  const to12Hour = (time?: string) => {
    if (!time) return "—"; // safe fallback

    const [h, m] = time.split(":").map(Number);

    if (isNaN(h) || isNaN(m)) return "—";

    const period = h < 12 ? "AM" : "PM";
    const hour = h % 12 || 12;

    return `${hour.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")} ${period}`;
  };

  const startFormatted = to12Hour(start);
  const endFormatted = to12Hour(end);

  return `${startFormatted} - ${endFormatted}`;
}


export function AgendaTable({ data, onEdit, onDelete }: AgendaTableProps) {
  const isEmpty = data.length === 0;

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-sky-300 text-left">
            <th className="p-2">Session Title</th>
            <th className="p-2">Time</th>
            <th className="p-2">Audience Polls</th>
            <th className="p-2">Speaker</th>
            <th className="w-20 rounded-r-lg p-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={5}>
                <EmptyState message="No agenda found for this event" />
              </td>
            </tr>
          ) : (
            data.map((row: Agenda) => {
              console.log(row,'ancslknslacn')
              const speakerCount = row.speakers?.length ?? 0;

              return (
                <tr key={row._id} className="hover:bg-muted/30 border-b transition-colors">
                  <td className="p-2 font-medium">{row.title}</td>

                  <td className="p-2">{formatAgendaTime(row.startTime, row.endTime)}</td>

                  <td
                    className={`p-2 font-semibold ${
                      row.hasPoll ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {row.hasPoll ? 'Yes' : 'No'}
                  </td>

                  <td className="p-2">
                    {speakerCount ? (
                      `${speakerCount} speaker(s)`
                    ) : (
                      <span className="text-gray-400">No speaker</span>
                    )}
                  </td>

                  <td className="p-2 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="rounded-md p-2 hover:bg-gray-100">
                        <MoreHorizontal className="h-5 w-5 text-gray-600" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-32">
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(row)}>
                            <Pencil className="mr-2 h-4 w-4 text-sky-500" />
                            Modify
                          </DropdownMenuItem>
                        )}

                        {onDelete && (
                          <DropdownMenuItem
                            onClick={() => onDelete(row)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
