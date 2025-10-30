'use client';
import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import type { Speaker } from '@/lib/types/speaker';
import { useAppDispatch } from '@/redux/hooks';
import { setExportClick, setExportLabel } from '@/redux/slices/toolbar-slice';
import { SpeakerService } from '@/services/speaker.service';
import { useEffect, useState } from 'react';
import { SpeakerFormDialog } from './components/SpeakerFormDialog';
import { SpeakersTable } from './components/SpeakersTable';

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Speaker | null>(null);
  const dispatch = useAppDispatch();
  const fetchSpeakers = async () => {
    setLoading(true);
    try {
      const data = await SpeakerService.getAll();
      setSpeakers(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();

    // ✅ Set toolbar globally
    dispatch(setExportLabel('Add Speaker'));
    dispatch(
      setExportClick(() => {
        setEditData(null);
        setOpen(true);
      })
    );
  }, [dispatch]);

  const scheduleData = {
    month: new Date().toLocaleString('default', { month: 'long' }),
    scheduleCount: 25,
    label:'Agenda'
  };

  return (
    <div className="w-full space-y-6">
      <DashboardToolbar />
      <MonthlyScheduleSummary
        month={scheduleData.month}
        scheduleCount={scheduleData.scheduleCount}
        label={scheduleData.label}
      />
      {loading && <p>Loading speakers...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && <SpeakersTable speakers={speakers} refetch={fetchSpeakers} />}
      <SpeakerFormDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={fetchSpeakers}
        editData={editData}
      />
    </div>
  );
}
