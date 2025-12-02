'use client';

import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlySummary from '@/components/dashboard/MonthlyScheduleSummary';
import { Header } from '@/components/layout/Header';
import { useEventsContext } from '@/components/providers/EventsContextProvider';
import { useMemo, useState } from 'react';

import { DeleteConfirmDialog } from '@/components/form/DeleteConfirmDialog';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { openEventForm, setEventDeleteTarget } from '@/redux/slices/event-slice';
import { deleteEvent } from '@/redux/slices/event-thunks';
import { Plus } from 'lucide-react';
import { EventFormDialog } from '../components/EventFormDialog';
import ScheduleTableBody from '../components/ScheduleTableBody';
import ScheduleTableTabs from '../components/ScheduleTabs';

export default function ScheduleTableContent() {
  const { meta, query, setQuery } = useEventsContext();
  const [activeTab, setActiveTab] = useState('ALL');
  const dispatch = useAppDispatch();
  const { deleteTarget } = useAppSelector((s) => s.events);

  const scheduleData = useMemo(
    () => ({
      month: new Date().toLocaleString('default', { month: 'long' }),
      scheduleCount: meta.total,
      label: 'Schedules',
    }),
    [meta],
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setQuery({
      ...query,
      page: 1,
      status: tab === 'ALL' ? undefined : tab,
    });
  };

  const handleDateFilter = (from: string, to: string) => {
    setQuery({
      ...query,
      page: 1,
      from_date: from || undefined,
      to_date: to || undefined,
    });
  };

  const openCreateEventForm = () => dispatch(openEventForm(null));

  return (
    <div className="w-full">
      <Header />
      <DashboardToolbar
        buttonLabel="Add Event"
        buttonIcon={<Plus className="h-4 w-4" />}
        onButtonClick={openCreateEventForm}
        showDateFilters
        onDateFilter={handleDateFilter}
      />
      <MonthlySummary
        month={scheduleData.month}
        scheduleCount={scheduleData.scheduleCount}
        label={scheduleData.label}
      />
      <div className="mt-4 mb-2 pl-6">
        <ScheduleTableTabs activeTab={activeTab} setActiveTab={handleTabChange} />
        <ScheduleTableBody activeTab={activeTab} />
      </div>

      {/* Event Form Modal */}
      <EventFormDialog />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteTarget}
        title="Delete Event"
        message={`Delete "${deleteTarget?.title}"?`}
        onConfirm={async () => {
          try {
            await dispatch(deleteEvent(deleteTarget!._id)).unwrap(); // unwrap to catch errors
            dispatch(setEventDeleteTarget(null));
            setQuery({ ...query, page: 1 }); // close the modal
          } catch (err) {
            console.error('Failed to delete event', err);
          }
        }}
        onCancel={() => dispatch(setEventDeleteTarget(null))}
      />
    </div>
  );
}
