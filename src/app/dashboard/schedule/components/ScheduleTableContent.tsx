'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock } from 'lucide-react';

export type ScheduleStatus = 'Upcoming' | 'Pending' | 'Past';

export interface ScheduleItem {
  title: string;
  date: string;
  time: string;
  speaker: {
    profileUrl: string;
    name: string;
    designation: string;
  };
  status: ScheduleStatus;
}

interface ScheduleTableContentProps {
  schedules: ScheduleItem[];
  loading: boolean;
  error: string | null;
}

export function ScheduleTableContent({ schedules, loading, error }: ScheduleTableContentProps) {
  return (
    <Card className="mt-1 h-full rounded-xl border border-gray-200 shadow-sm">
      <CardContent className="p-0">
        {loading && <p className="p-4 text-sm text-gray-600">Loading schedules...</p>}
        {error && <p className="p-4 text-sm text-red-500">{error}</p>}

        {!loading && !error && (
          // ✅ Scroll container wraps the table
          <div className="max-h-[60vh] overflow-y-auto">
            <Table className="w-full text-sm">
              {/* ✅ Header stays sticky inside the same table */}
              <TableHeader className="sticky top-0 z-20 bg-white shadow-sm">
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Speaker</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {schedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-gray-500">
                      No schedules found.
                    </TableCell>
                  </TableRow>
                ) : (
                  schedules.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-sky-400">{item.title}</TableCell>
                      <TableCell>{new Date(item.date).toLocaleDateString('en-GB')}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-sky-400" />
                        <span>{item.time}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={item.speaker.profileUrl} alt={item.speaker.name} />
                            <AvatarFallback>
                              {item.speaker.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{item.speaker.name}</span>
                            <span className="text-xs text-gray-500">
                              {item.speaker.designation}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            item.status === 'Upcoming'
                              ? 'bg-blue-100 text-sky-400'
                              : item.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
