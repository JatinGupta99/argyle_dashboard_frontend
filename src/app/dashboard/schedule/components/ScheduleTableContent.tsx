'use client';
import { Table, TableBody } from '@/components/ui/table';
import { Event } from '@/lib/types/components';
import ScheduleRow from './ScheduleRow';

export interface ScheduleTableContentProps {
  schedules: Event[];
  loading: boolean;
  error: string | null;
}

export default function ScheduleTableContent({
  schedules,
  loading,
  error,
}: ScheduleTableContentProps) {
  return (
    <div className="w-full">
      {loading && <p className="p-4 text-sm text-gray-600">Loading schedules...</p>}

      {error && <p className="p-4 text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        // ⬇ Only inner table area scrolls
        <div className="max-h-[55vh] overflow-y-auto pr-1">
          <Table className="w-full text-sm">
            <TableBody>
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    No schedules found.
                  </td>
                </tr>
              ) : (
                schedules.map((item: Event) => <ScheduleRow key={item._id} item={item} />)
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
