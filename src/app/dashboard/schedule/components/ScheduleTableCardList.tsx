'use client';

import { Card } from '@/components/ui/card';
import { TabLabel } from '@/lib/types/schedule';
import ScheduleStatusSummary from './ScheduleStatusSummary';
import ScheduleTableContent from './ScheduleTableContent';

interface Props {
  summaryCount: number;
  upcoming: number;
  past: number;
  pending: number;
  activeTab: TabLabel;
  onTabChange: (label: TabLabel) => void;
  schedules: any[];
  loading: boolean;
  error: string | null;
}

export function ScheduleTableCardList({
  summaryCount,
  upcoming,
  past,
  pending,
  activeTab,
  onTabChange,
  schedules,
  loading,
  error,
}: Props) {
  return (
    <Card className="mx-auto mt-0 flex h-[78vh] w-[98%] rounded-xl shadow-sm">
      <ScheduleStatusSummary
        totalSchedules={summaryCount}
        upcomingCount={upcoming}
        pastCount={past}
        pendingCount={pending}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <ScheduleTableContent schedules={schedules} loading={loading} error={error} />
      </div>
    </Card>
  );
}
