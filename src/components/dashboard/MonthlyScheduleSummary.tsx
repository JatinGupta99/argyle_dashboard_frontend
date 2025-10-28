'use client';

import { CalendarDays } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function MonthlyScheduleSummary() {
  return (
    <Card className="flex flex-row items-center justify-between px-6 py-3 border-none shadow-none bg-transparent">
      {/* Left side — text */}
      <div className="flex flex-col">
        <p className="text-sm text-gray-600">
          You have <span className="font-medium text-gray-900">24</span> schedules this month.
        </p>
      </div>

      {/* Right side — calendar + month name */}
      <div className="flex items-center space-x-2">
        <CalendarDays className="h-6 w-6 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-800">October</h2>
      </div>
    </Card>
  );
}
