'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
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
  const { eventId } = useParams(); // ✅ get eventId from URL

  const dispatch = useAppDispatch();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Speaker | null>(null);

  // 🧠 Load speakers for THIS eventId
  const loadSpeakers = async () => {
    if (!eventId) return;
    try {
      const data = await SpeakerService.getAllByEvent(String(eventId)); // ✅ eventId passed
      setSpeakers(data);
    } catch (err) {
      console.error('Failed to load speakers', err);
    }
  };

  useEffect(() => {
    loadSpeakers();
    dispatch(setExportLabel('Add Speaker'));
  }, [dispatch, eventId]);

  const handleAddSpeaker = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEditSpeaker = (speaker: Speaker) => {
    setEditData(speaker);
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

      <DashboardToolbar customLabel="Add Speaker" onPrimaryClick={handleAddSpeaker} />

      <MonthlyScheduleSummary
        month={summaryData.month}
        scheduleCount={summaryData.scheduleCount}
        label={summaryData.label}
      />

      <main className="flex flex-1 flex-col p-2 pb-10">
        <section className="flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <SpeakersTable speakers={speakers} onEdit={handleEditSpeaker} />
        </section>
      </main>

      {/* Pass eventId to the dialog too */}
      <SpeakerFormDialog
        open={open}
        onOpenChange={setOpen}
        editData={editData}
        onSuccess={loadSpeakers}
        eventId={String(eventId)}
      />
    </div>
  );
}
