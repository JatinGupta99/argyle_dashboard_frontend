import { ScheduleStatus } from '@/lib/types/schedule';
import React from 'react';

export default function StatusBadge({ status }: { status: ScheduleStatus }) {
  const styles = {
    Upcoming: 'bg-blue-100 text-sky-600',
    Pending: 'bg-yellow-100 text-yellow-700',
    Past: 'bg-green-100 text-green-700',
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}>{status}</span>
  );
}
