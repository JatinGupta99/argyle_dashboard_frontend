'use client';
import { TabLabel } from '@/lib/types/schedule';
import { Download } from 'lucide-react';
import ScheduleHeader from './ScheduleHeader';

interface ScheduleStatusSummaryProps {
  totalSchedules: number;
  upcomingCount: number;
  pastCount: number;
  pendingCount: number;
  activeTab: TabLabel;
  onTabChange: (label: TabLabel) => void;
}

export default function ScheduleStatusSummary({
  totalSchedules,
  upcomingCount,
  pastCount,
  pendingCount,
  activeTab,
  onTabChange,
}: ScheduleStatusSummaryProps) {
  const items: { label: TabLabel; count: number }[] = [
    { label: 'All', count: totalSchedules },
    { label: 'Pending', count: pendingCount },
    { label: 'Upcoming', count: upcomingCount },
    { label: 'Past', count: pastCount },
  ];

  return (
    <div className="border-b border-gray-200 px-4">
      <div className="flex items-center gap-3 py-2 text-sm">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => onTabChange(item.label)}
            className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition-colors duration-150 ${
              activeTab === item.label
                ? 'bg-sky-100 font-semibold text-black'
                : 'text-gray-700 hover:bg-gray-200'
            } `}
          >
            {item.label}

            <span
              className={`ml-1 rounded-md px-2 py-0.5 text-xs ${
                activeTab === item.label ? 'bg-white text-black' : 'bg-gray-200 text-gray-700'
              } `}
            >
              {item.count}
            </span>
          </button>
        ))}
        <div className="ml-auto flex cursor-pointer items-center gap-2 text-sky-600 hover:text-sky-700">
          <span className="font-medium">Export</span>

          <Download className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-2 overflow-hidden rounded-md bg-sky-50">
        <ScheduleHeader />
      </div>
    </div>
  );
}
