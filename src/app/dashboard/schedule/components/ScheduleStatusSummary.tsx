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
  onTabChange
}: ScheduleStatusSummaryProps) {

  const items: { label: TabLabel; count: number }[] = [
    { label: 'All', count: totalSchedules },
    { label: 'Pending', count: pendingCount },
    { label: 'Upcoming', count: upcomingCount },
    { label: 'Past', count: pastCount },
  ];

  return (
    <div className="px-4 border-b border-gray-200">

    <div className="flex items-center gap-3 text-sm py-2">

  {items.map((item) => (
    <button
      key={item.label}
      onClick={() => onTabChange(item.label)}
      className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors duration-150
        ${activeTab === item.label
          ? 'bg-sky-100 text-black font-semibold'
          : 'text-gray-700 hover:bg-gray-200'}
      `}
    >
      {item.label}

      <span
        className={`ml-1 px-2 py-0.5 rounded-md text-xs
          ${activeTab === item.label
            ? 'bg-white text-black'
            : 'bg-gray-200 text-gray-700'}
        `}
      >
        {item.count}
      </span>
    </button>
  ))}
  <div className="flex items-center gap-2 ml-auto text-sky-600 cursor-pointer hover:text-sky-700">
    <span className="font-medium">Export</span>

    <Download className="h-4 w-4" />
  </div>
</div>


  <div className="mt-2 bg-sky-50 rounded-md overflow-hidden">
  <ScheduleHeader />
</div>

    </div>
  );
}
