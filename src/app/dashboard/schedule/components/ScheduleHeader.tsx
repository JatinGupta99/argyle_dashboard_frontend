import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ScheduleHeader() {
  return (
    <TableHeader className="bg-sky-50 !px-0">
      <TableRow>
        <TableHead className="w-[140px] border-r bg-sky-50 px-4">Event ID</TableHead>

        <TableHead className="max-w-[350px] min-w-[240px] border-r bg-sky-50 px-4">Title</TableHead>

        <TableHead className="w-[140px] border-r bg-sky-50 px-4">Date</TableHead>

        <TableHead className="w-[170px] border-r bg-sky-50 px-4">Time</TableHead>

        <TableHead className="w-[220px] border-r bg-sky-50 px-4">Speakers</TableHead>

        <TableHead className="w-[120px] bg-sky-50 px-4">Status</TableHead>
      </TableRow>
    </TableHeader>
  );
}
