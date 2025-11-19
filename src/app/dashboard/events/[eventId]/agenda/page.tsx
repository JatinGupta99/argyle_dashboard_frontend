'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { setExportLabel } from '@/redux/slices/toolbar-slice';
import { toast } from 'sonner';

import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import { Header } from '@/components/layout/Header';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';

import { AgendaService } from '@/services/agenda.service';
import type { Agenda } from '@/lib/types/agenda';

import { AgendaFormDialog } from './components/AgendaFormDialog';
import { DeleteConfirmDialog } from '@/components/form/DeleteConfirmDialog';
import { AgendaTable, AgendaRow } from './components/AgendaTable';
import { mapAgendaToRow } from '@/utils/agenda.mapper';

export default function AgendaPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const dispatch = useAppDispatch();

  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Agenda | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Agenda | null>(null);

  const loadAgendas = async () => {
    if (!eventId) return;
    try {
      const res = await AgendaService.getAll(eventId);
      setAgendas(res.data ?? []);
    } catch {
      toast.error('Failed to load agendas');
    }
  };

  useEffect(() => {
    loadAgendas();
    dispatch(setExportLabel('Add Agenda'));
  }, [dispatch, eventId]);

  const handleAddAgenda = () => {
    setEditData(null);
    setOpen(true);
  };

  const findAgenda = (row: AgendaRow) => agendas.find((a) => a._id === row._id) ?? null;

  const handleEditAgenda = (row: AgendaRow) => {
    const original = findAgenda(row);
    if (original) {
      setEditData(original);
      setOpen(true);
    }
  };

  const handleDeleteAgenda = (row: AgendaRow) => {
    const original = findAgenda(row);
    if (original) setDeleteTarget(original);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !eventId) return;

    try {
      await AgendaService.remove(eventId, deleteTarget._id);
      toast.success('Agenda deleted');
      loadAgendas();
    } catch {
      toast.error('Failed to delete agenda');
    } finally {
      setDeleteTarget(null);
    }
  };

  const summaryData = useMemo(
    () => ({
      month: new Date().toLocaleString('default', { month: 'long' }),
      scheduleCount: agendas.length,
      label: 'Agendas',
    }),
    [agendas.length],
  );

  const tableData: AgendaRow[] = useMemo(() => agendas.map(mapAgendaToRow), [agendas]);

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header />

      <DashboardToolbar customLabel="Add Agenda" onPrimaryClick={handleAddAgenda} />

      <MonthlyScheduleSummary
        month={summaryData.month}
        scheduleCount={summaryData.scheduleCount}
        label={summaryData.label}
      />

      <main className="flex flex-1 flex-col p-2 pb-10">
        <section className="flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <AgendaTable data={tableData} onEdit={handleEditAgenda} onDelete={handleDeleteAgenda} />
        </section>
      </main>

      <AgendaFormDialog
        open={open}
        onOpenChange={setOpen}
        editData={editData}
        eventId={eventId}
        onSuccess={loadAgendas}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        title="Delete Agenda"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
