'use client';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ScheduleHeader() {
  return (
    <TableHeader>
      <TableRow>
        {/* Add padding + optional width */}
        <TableHead className="w-[140px] border-r px-4">Event ID</TableHead>

        <TableHead className="w-[240px] border-r px-4">Title</TableHead>

        <TableHead className="w-[140px] border-r px-4">Date</TableHead>

        <TableHead className="w-[160px] border-r px-4">Time</TableHead>

        <TableHead className="w-[200px] border-r px-4">Speakers</TableHead>

        <TableHead className="px-4">Status</TableHead>
      </TableRow>
    </TableHeader>
  );
}
