'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setExportLabel } from '@/redux/slices/toolbar-slice';
import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import { Header } from '@/components/layout/Header';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { SpeakersTable } from './components/SpeakersTable';
import { SpeakerFormDialog } from './components/SpeakerFormDialog';
import { SpeakerService } from '@/services/speaker.service';
import type { Speaker } from '@/lib/types/speaker';

export default function SpeakersPage() {
  const dispatch = useAppDispatch();

  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Speaker | null>(null);

  // 🧠 Load all speakers
  const loadSpeakers = async () => {
    try {
      const data = await SpeakerService.getAll();
      setSpeakers(data);
    } catch (err) {
      console.error('Failed to load speakers', err);
    }
  };

  useEffect(() => {
    loadSpeakers();
    dispatch(setExportLabel('Add Speaker'));
  }, [dispatch]);

  // 🧩 Add speaker
  const handleAddSpeaker = () => {
    setEditData(null); // clear existing data
    setOpen(true); // open in add mode
  };

  // 🧩 Edit speaker
  const handleEditSpeaker = (speaker: Speaker) => {
    setEditData(speaker); // pass selected speaker
    setOpen(true); // open dialog in edit mode
  };

  // 🧩 For summary display
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

      {/* Toolbar → Add Speaker */}
      <DashboardToolbar customLabel="Add Speaker" onPrimaryClick={handleAddSpeaker} />

      <MonthlyScheduleSummary
        month={summaryData.month}
        scheduleCount={summaryData.scheduleCount}
        label={summaryData.label}
      />

      <main className="flex flex-1 flex-col p-2 pb-10">
        <section className="flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <SpeakersTable
            speakers={speakers}
            onEdit={handleEditSpeaker} // ✅ connect edit handler
          />
        </section>
      </main>
      <SpeakerFormDialog
        open={open}
        onOpenChange={setOpen}
        editData={editData}
        onSuccess={loadSpeakers}
      />
    </div>
  );
}
