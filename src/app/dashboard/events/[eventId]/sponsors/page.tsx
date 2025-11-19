'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setExportLabel } from '@/redux/slices/toolbar-slice';
import { toast } from 'sonner';

import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import { Header } from '@/components/layout/Header';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { useEventContext } from '@/components/providers/EventContextProvider';

import { SponsorFormDialog } from '../sponsors/components/SponsorFormDialog';
import { SponsorsTable } from '../sponsors/components/SponsorsTable';
import { SponsorService } from '@/services/sponsors.service';

import type { Sponsor } from '@/lib/types/sponsor';
import { DeleteConfirmDialog } from '@/components/form/DeleteConfirmDialog';

export default function SponsorsPage() {
  const dispatch = useAppDispatch();
  const event = useEventContext();
  const eventId = event?._id || '';

  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Sponsor | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Sponsor | null>(null);

  /* ---------- Load Sponsors ---------- */
  const loadSponsors = useCallback(async () => {
    if (!eventId) return;

    try {
      const res = await SponsorService.getAll(eventId);
      setSponsors(res ?? []); // make sure it's an array
    } catch (err) {
      console.error('Failed to load sponsors', err);
      toast.error('Failed to load sponsors');
    }
  }, [eventId]);

  useEffect(() => {
    loadSponsors();
    dispatch(setExportLabel('Add Sponsor'));
  }, [loadSponsors, dispatch]);

  /* ---------- Add / Edit ---------- */
  const handleAddSponsor = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEditSponsor = (sponsor: Sponsor) => {
    setEditData(sponsor);
    setOpen(true);
  };

  /* ---------- Delete ---------- */
  const handleDeleteSponsor = (sponsor: Sponsor) => {
    setDeleteTarget(sponsor);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await SponsorService.remove(eventId, deleteTarget._id);
      toast.success('Sponsor deleted');
      loadSponsors();
    } catch (err) {
      console.error('Delete failed', err);
      toast.error('Failed to delete sponsor');
    } finally {
      setDeleteTarget(null);
    }
  };

  /* ---------- Summary widget ---------- */
  const summaryData = useMemo(
    () => ({
      month: new Date().toLocaleString('default', { month: 'long' }),
      scheduleCount: sponsors.length,
      label: 'Sponsors',
    }),
    [sponsors.length]
  );

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header />

      <DashboardToolbar customLabel="Add Sponsor" onPrimaryClick={handleAddSponsor} />

      <MonthlyScheduleSummary
        month={summaryData.month}
        scheduleCount={summaryData.scheduleCount}
        label={summaryData.label}
      />

      <main className="flex flex-1 flex-col p-2 pb-10">
        <section className="flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <SponsorsTable
            sponsors={sponsors}
            onEdit={handleEditSponsor}
            onDelete={handleDeleteSponsor}
          />
        </section>
      </main>

      <SponsorFormDialog
        eventId={eventId}
        open={open}
        onOpenChange={setOpen}
        editData={editData}
        onSuccess={loadSponsors}
      />

      <SponsorFormDialog
        eventId={eventId}
        open={open}
        onOpenChange={setOpen}
        editData={editData}
        onSuccess={loadSponsors}
      />

      {deleteTarget && (
        <DeleteConfirmDialog
          open={true}
          title="Delete Sponsor"
          message={`Are you sure you want to delete "${deleteTarget.name}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
