'use client';

import { Header } from '@/components/layout/Header';
import { useEventsContext } from '@/components/providers/EventsContextProvider';
import ScheduleTableBody from '../components/ScheduleTableBody';
import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlySummary from '@/components/dashboard/MonthlyScheduleSummary';
import { useMemo, useState } from 'react';
import ScheduleHeader from '../components/ScheduleHeader';
import ScheduleTableTabs from '../components/ScheduleTableTabs';

export default function ScheduleTableContent() {
  const events = useEventsContext();
  const [activeTab, setActiveTab] = useState('ALL');

  const scheduleData = useMemo(
    () => ({
      month: new Date().toLocaleString('default', { month: 'long' }),
      scheduleCount: events.length,
      label: 'Schedules',
    }),
    [events],
  );

  return (
    <div className="w-full">
      <Header />
      <DashboardToolbar />

      <MonthlySummary
        month={scheduleData.month}
        scheduleCount={scheduleData.scheduleCount}
        label={scheduleData.label}
      />

      <div className="mt-4 mb-2 pl-6">
        <ScheduleTableTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="sticky top-20 z-20 bg-sky-50 shadow-sm">
        <ScheduleHeader />
      </div>

      <ScheduleTableBody events={events} activeTab={activeTab} />
    </div>
  );
}
