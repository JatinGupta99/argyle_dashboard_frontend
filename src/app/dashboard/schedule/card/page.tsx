'use client';

import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { Header } from '@/components/layout/Header';
import { useEventsContext } from '@/components/providers/EventsContextProvider';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setExportLabel } from '@/redux/slices/toolbar-slice';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { ScheduleTabs } from '../components/ScheduleTabs';

export default function SchedulePage() {
  const dispatch = useAppDispatch();
  const events = useEventsContext();

  // Read export flag from Redux
  const exportRequested = useAppSelector((state) => state.toolbar.exportRequested);

  useEffect(() => {
    dispatch(setExportLabel('Export'));
  }, [dispatch]);

  useEffect(() => {
    if (!exportRequested) return;

    toast.info('Data export started...', {
      description: 'Please wait while your data is being exported.',
    });

    setTimeout(() => {
      toast.success('Export completed successfully', {
        description: `Finished at ${new Date().toLocaleTimeString()}`,
      });
    }, 2000);
  }, [exportRequested]);

  // Filter events for the current month
  const monthlyEvents = useMemo(() => {
    const now = new Date();

    return events.filter((event) => {
      if (!event.EventDate) return false;

      const eventDate = new Date(event.EventDate);

      return (
        eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear()
      );
    });
  }, [events]);

  const scheduleData = useMemo(
    () => ({
      month: new Date().toLocaleString('default', { month: 'long' }),
      scheduleCount: monthlyEvents.length,
      label: 'Schedules',
    }),
    [monthlyEvents],
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
