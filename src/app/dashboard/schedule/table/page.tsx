'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchSpeakers,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
  uploadSpeakerImage,
} from '@/redux/slices/speaker-thunks';

import { setExportLabel } from '@/redux/slices/toolbar-slice';
import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import { Header } from '@/components/layout/Header';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { SpeakersTable } from '../../events/[eventId]/sponsors/components/SpeakersTable';
import { SpeakerFormDialog } from '../../events/[eventId]/speakers/components/SpeakerFormDialog';

export default function SpeakersPage() {
  const { eventId } = useParams();
  const dispatch = useAppDispatch();
  const speakers = useAppSelector((state) => state.speakers.list);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchSpeakers(String(eventId)));
      dispatch(setExportLabel('Add Speaker'));
    }
  }, [eventId, dispatch]);

  const handleAddSpeaker = () => {
    setOpen(true);
    setEditData(null);
  };

  const handleEditSpeaker = (speaker) => {
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
        <section className="flex-1 overflow-y-auto rounded-lg border bg-white shadow-sm">
          <SpeakersTable speakers={speakers} onEdit={handleEditSpeaker} />
        </section>
      </main>

      <SpeakerFormDialog
        open={open}
        onOpenChange={setOpen}
        editData={editData}
        eventId={String(eventId)}
      />
    </div>
  );
}
