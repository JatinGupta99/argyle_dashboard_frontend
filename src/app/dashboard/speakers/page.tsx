'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setExportLabel } from '@/redux/slices/toolbar-slice';
import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { Header } from '@/components/layout/Header';
import { SpeakerFormDialog } from './components/SpeakerFormDialog';
import { SpeakersTable } from './components/SpeakersTable';
import { useSpeakers } from './hooks/useSpeakers';
import { fetchSpeakers } from '@/redux/slices/speaker-slice';

export default function SpeakersPage() {
  const dispatch = useAppDispatch();
  const { list: speakers, loading, error } = useSpeakers();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);

  useEffect(() => {
    dispatch(setExportLabel('Add Speaker'));
  }, [dispatch]);

  const handleAddSpeaker = () => {
    setEditData(null);
    setOpen(true);
  };

  const summaryData = useMemo(
    () => ({
      month: new Date().toLocaleString('default', { month: 'long' }),
      scheduleCount: speakers.length,
      label: 'Speakers',
    }),
    [speakers.length]
  );

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header />
      {/* Pass local handler to toolbar button */}
      <DashboardToolbar />
      <MonthlyScheduleSummary
        month={summaryData.month}
        scheduleCount={summaryData.scheduleCount}
        label={summaryData.label}
      />
      <main className="flex flex-1 flex-col p-2 pb-10">
        <section className="flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          {loading && <p className="p-4 text-sm text-gray-600">Loading speakers...</p>}
          {error && <p className="p-4 text-sm text-red-500">{error}</p>}
          {!loading && !error && (
            <SpeakersTable speakers={speakers} refetch={() => dispatch(fetchSpeakers())} />
          )}
        </section>
      </main>

      <SpeakerFormDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => dispatch(fetchSpeakers())}
        editData={editData}
      />
    </div>
  );
}
