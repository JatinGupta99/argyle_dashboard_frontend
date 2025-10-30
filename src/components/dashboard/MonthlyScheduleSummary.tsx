'use client';

import { CalendarDays } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MonthlySummaryProps {
  month: string;
  scheduleCount: number;
  label: string; // e.g., "schedules", "events", "meetings"
}

export default function MonthlySummary({ month, scheduleCount, label }: MonthlySummaryProps) {
  return (
    <Card className="flex flex-row items-center justify-between border-none bg-transparent px-6 py-3 shadow-none">
      {/* Left side — text */}
      <div className="flex flex-col">
        <p className="text-sm text-gray-600">
          You have <span className="font-semibold text-sky-500">{scheduleCount}</span>{' '}
          <span className="text-sky-500">{scheduleCount === 1 ? label.slice(0, -1) : label}</span>{' '}
          this month.
        </p>
      </div>

      {/* Right side — icon + month */}
      <div className="flex items-center space-x-2">
        <CalendarDays className="h-6 w-6 text-gray-500" />
        <h2 className="text-sm font-semibold text-gray-800">{month}</h2>
      </div>
    </Card>
  );
}
