'use client';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ScheduleHeader() {
  return (
    <TableHeader>
      <TableRow>

        {/* Add padding + optional width */}
        <TableHead className="w-[140px] px-4 border-r">Event ID</TableHead>

        <TableHead className="w-[240px] px-4 border-r">Title</TableHead>

        <TableHead className="w-[140px] px-4 border-r">Date</TableHead>

        <TableHead className="w-[160px] px-4 border-r">Time</TableHead>

        <TableHead className="w-[200px] px-4 border-r">Speakers</TableHead>

        <TableHead className="px-4">Status</TableHead>

      </TableRow>
    </TableHeader>
  );
}
