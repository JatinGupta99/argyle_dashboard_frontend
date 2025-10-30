'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setExportClick, setExportLabel } from '@/redux/slices/toolbar-slice';
import { Header } from '@/components/layout/Header';
import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { ScheduleTabs } from './components/ScheduleTabs';

export default function SchedulePage() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setExportLabel('Export'));
    dispatch(setExportClick(() => {}));
  }, [dispatch]);

  const scheduleData = useMemo(
    () => ({
      month: new Date().toLocaleString('default', { month: 'long' }),
      scheduleCount: 25,
      label: 'Schedules',
    }),
    []
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <Header />
      <DashboardToolbar />
      <MonthlyScheduleSummary
        month={scheduleData.month}
        scheduleCount={scheduleData.scheduleCount}
        label={scheduleData.label}
      />
      <main className="flex-1 overflow-hidden p-6">
        <section className="h-[70vh] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <ScheduleTabs />
        </section>
      </main>
    </div>
  );
}
