'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { setExportLabel } from '@/redux/slices/toolbar-slice';
import { toast } from 'sonner';

import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import { Header } from '@/components/layout/Header';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';

import { SpeakersTable } from './components/SpeakersTable';
import { SpeakerFormDialog } from './components/SpeakerFormDialog';

import { SpeakerService } from '@/services/speaker.service';
import type { Speaker } from '@/lib/types/speaker';
import { DeleteConfirmDialog } from '@/components/form/DeleteConfirmDialog';

export default function SpeakersPage(eventId: string) {
  const dispatch = useAppDispatch();

  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Speaker | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Speaker | null>(null);

  // Load speakers
  const loadSpeakers = async () => {
    if (!eventId) return;
    try {
      const res = await SpeakerService.getAll(String(eventId));
      setSpeakers(res.data ?? []);
    } catch (err) {
      console.error('Failed to load speakers', err);
      toast.error('Failed to load speakers');
    }
  };

  useEffect(() => {
    loadSpeakers();
    dispatch(setExportLabel('Add Speaker'));
  }, [dispatch, eventId]);

  // Add / Edit Speaker
  const handleAddSpeaker = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEditSpeaker = (speaker: Speaker) => {
    setEditData(speaker);
    setOpen(true);
  };

  // Delete Speaker
  const handleDeleteSpeaker = (speaker: Speaker) => {
    setDeleteTarget(speaker);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !eventId) return;

    try {
      await SpeakerService.remove(String(eventId), deleteTarget._id);
      toast.success('Speaker deleted');
      await loadSpeakers();
    } catch (err) {
      console.error('Failed to delete speaker', err);
      toast.error('Failed to delete speaker');
    } finally {
      setDeleteTarget(null);
    }
  };

  // Summary
  const summaryData = useMemo(
    () => ({
      month: new Date().toLocaleString('default', { month: 'long' }),
      scheduleCount: speakers.length,
      label: 'Speakers',
    }),
    [speakers.length],
  );

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <main className="flex flex-1 flex-col p-2 pb-10">
        <section className="flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <SpeakersTable
            speakers={speakers}
            onEdit={handleEditSpeaker}
            onDelete={handleDeleteSpeaker}
          />
        </section>
      </main>

      <SpeakerFormDialog
        open={open}
        onOpenChange={setOpen}
        editData={editData}
        eventId={eventId}
        onSuccess={loadSpeakers}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        title="Delete Speaker"
        message={`Are you sure you want to delete "${deleteTarget?.name.firstName} ${deleteTarget?.name.lastName}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
