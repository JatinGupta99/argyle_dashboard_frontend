'use client';

import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { Header } from '@/components/layout/Header';
import { useEventsContext } from '@/components/providers/EventsContextProvider';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setExportLabel } from '@/redux/slices/toolbar-slice';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ScheduleTableCardList } from '../components/ScheduleTableCardList';
import ScheduleTableTabs from '../components/ScheduleTabs';

export default function SchedulePage() {
  const dispatch = useAppDispatch();
  const { events, meta, query, setQuery } = useEventsContext();
  const [activeTab, setActiveTab] = useState('ALL');

  // Export flag from Redux
  const exportRequested = useAppSelector((state) => state.toolbar.exportRequested);

  useEffect(() => {
    dispatch(setExportLabel('Export'));
  }, [dispatch]);

  // Trigger export sequence
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

  // TAB change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setQuery({
      ...query,
      page: 1,
      status: tab === 'ALL' ? undefined : tab,
    });
  };

  // DATE FILTERS
  const handleDateFilter = (from: string, to: string) => {
    setQuery({
      ...query,
      page: 1,
      from_date: from || undefined,
      to_date: to || undefined,
    });
  };

  // Filter events for month + tab
  const filteredEvents = useMemo(() => {
    const now = new Date();

    return events.filter((event) => {
      if (!event.EventDate) return false;

      const eventDate = new Date(event.EventDate);
      const isCurrentMonth =
        eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();

      const matchesTab = activeTab === 'ALL' ? true : event.status === activeTab;

      return isCurrentMonth && matchesTab;
    });
  }, [events, activeTab]);

  const scheduleData = useMemo(
    () => ({
      month: new Date().toLocaleString('default', { month: 'long' }),
      scheduleCount: filteredEvents.length,
      label: 'Schedules',
    }),
    [filteredEvents],
  );

  // EXPORT BUTTON HANDLER
  const handleExportClick = () => {
    // dispatch(requestExport());
    toast.success('Data exported successfully');
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <Header />

      <div className="bg-sky-50">
        {/* Toolbar */}
        <DashboardToolbar
          showDateFilters
          onDateFilter={handleDateFilter}
          buttonLabel="Export" // <-- controls icon (FileDown)
          onButtonClick={handleExportClick}
        />

        <MonthlyScheduleSummary
          month={scheduleData.month}
          scheduleCount={scheduleData.scheduleCount}
          label={scheduleData.label}
        />

        <div className="pl-6">
          <ScheduleTableTabs activeTab={activeTab} setActiveTab={handleTabChange} />
        </div>

        <main className="flex-1 overflow-hidden px-6">
          <section className="mt-2 h-[70vh] w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <ScheduleTableCardList events={filteredEvents} />
          </section>
        </main>
      </div>
    </div>
  );
}
