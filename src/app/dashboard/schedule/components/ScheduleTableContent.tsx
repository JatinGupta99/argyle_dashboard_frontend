'use client';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody } from '@/components/ui/table';
import ScheduleRow from './ScheduleRow';
import { ScheduleItem } from '@/lib/types/schedule';

export interface ScheduleTableContentProps {
  schedules: ScheduleItem[];
  loading: boolean;
  error: string | null;
}

export default function ScheduleTableContent({
  schedules,
  loading,
  error
}: ScheduleTableContentProps) {

  return (
    <div className="w-full">
      {loading && <p className="p-4 text-sm text-gray-600">Loading schedules...</p>}
      {error && <p className="p-4 text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="relative overflow-y-auto max-h-[60vh] pr-1">
          <Table className="w-full text-sm">
            <TableBody>
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    No schedules found.
                  </td>
                </tr>
              ) : (
                schedules.map((item) => <ScheduleRow key={item._id} item={item} />)
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
