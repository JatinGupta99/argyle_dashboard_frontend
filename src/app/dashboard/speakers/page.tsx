'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setExportClick, setExportLabel } from '@/redux/slices/toolbar-slice';
import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { Header } from '@/components/layout/Header';
import { SpeakerFormDialog } from './components/SpeakerFormDialog';
import { SpeakersTable } from './components/SpeakersTable';
import { SpeakerService } from '@/services/speaker.service';
import type { Speaker } from '@/lib/types/speaker';

export default function SpeakersPage() {
  const dispatch = useAppDispatch();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Speaker | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSpeakers = async () => {
      setLoading(true);
      try {
        const data = await SpeakerService.getAll();
        if (mounted) {
          const unique = Array.from(new Map(data.map((s) => [s._id, s])).values());
          setSpeakers(unique);
        }
      } catch (err: any) {
        if (mounted) setError(err.message || 'Something went wrong');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSpeakers();
    dispatch(setExportLabel('Add Speaker'));
    dispatch(
      setExportClick(() => {
        setEditData(null);
        setOpen(true);
      })
    );

    return () => {
      mounted = false;
    };
  }, [dispatch]);

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
            <SpeakersTable
              speakers={speakers}
              refetch={() => {
                SpeakerService.getAll().then((data) => {
                  const unique = Array.from(new Map(data.map((s) => [s._id, s])).values());
                  setSpeakers(unique);
                });
              }}
            />
          )}
        </section>
      </main>

      <SpeakerFormDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => {
          SpeakerService.getAll().then((data) => {
            const unique = Array.from(new Map(data.map((s) => [s._id, s])).values());
            setSpeakers(unique);
          });
        }}
        editData={editData}
      />
    </div>
  );
}
