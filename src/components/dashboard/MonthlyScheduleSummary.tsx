'use client';

import { CalendarDays } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MonthlyScheduleSummaryProps {
  month: string;
  scheduleCount: number;
}

export default function MonthlyScheduleSummary({
  month,
  scheduleCount,
}: MonthlyScheduleSummaryProps) {
  return (
    <Card className="flex flex-row items-center justify-between border-none bg-transparent px-6 py-3 shadow-none">
      {/* Left side — text */}
      <div className="flex flex-col">
        <p className="text-sm text-gray-600">
          You have <span className="font-medium text-gray-900">{scheduleCount}</span> schedules this
          month.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <CalendarDays className="h-6 w-6 text-gray-500" />
        <h2 className="text-sm font-semibold text-gray-800">{month}</h2>
      </div>
    </Card>
  );
}
