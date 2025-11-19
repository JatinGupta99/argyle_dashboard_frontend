'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { setExportLabel } from '@/redux/slices/toolbar-slice';
import { toast } from 'sonner';

import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';

import { AgendaTable } from './components/AgendaTable';
import { AgendaFormDialog } from './components/AgendaFormDialog';

import { useAgendas } from '@/hooks/useAgenda';
import { AgendaService } from '@/services/agenda.service';
import { DeleteConfirmDialog } from '@/components/form/DeleteConfirmDialog';

export default function AgendaPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const eventId = params.eventId as string;

  const { agendas, loading, error, refresh } = useAgendas(eventId);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(agendas.length / itemsPerPage);

  const paginatedAgendas = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return agendas.slice(start, start + itemsPerPage);
  }, [agendas, currentPage]);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const scheduleData = useMemo(
    () => ({
      month: new Date().toLocaleString('default', { month: 'long' }),
      scheduleCount: agendas.length,
      label: 'Agenda',
    }),
    [agendas.length]
  );

  useEffect(() => {
    dispatch(setExportLabel('Add Agenda'));
  }, [dispatch]);

  // Delete Agenda
  const handleDeleteAgenda = (agenda: any) => {
    setDeleteTarget(agenda);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await AgendaService.remove(eventId, deleteTarget._id);
      toast.success("Agenda deleted");
      refresh();
    } catch (err) {
      console.error('Failed to delete agenda', err);
      toast.error("Failed to delete agenda");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <Header />

      <DashboardToolbar
        customLabel="Add Agenda"
        onPrimaryClick={() => {
          setEditData(null);
          setOpen(true);
        }}
      />

      <MonthlyScheduleSummary {...scheduleData} />

      <main className="flex-1 overflow-auto p-6 pb-10">
        <section className="mb-6 min-h-[70vh] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">

          {loading ? (
            <p className="p-4 text-gray-500">Loading agendas...</p>
          ) : error ? (
            <p className="p-4 text-red-500">{error}</p>
          ) : (
            <>
              <AgendaTable
                data={paginatedAgendas}
                onEdit={(row) => {
                  setEditData(row);
                  setOpen(true);
                }}
                onDelete={handleDeleteAgenda} // Added delete handler
              />

              <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 1}>
                  &lt;
                </Button>

                <span className="text-sm text-gray-600">
                  Page <strong>{currentPage}</strong> of {totalPages}
                </span>

                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </Button>
              </div>
            </>
          )}
        </section>
      </main>

      {/* Agenda Form Dialog */}
      <AgendaFormDialog
        open={open}
        onOpenChange={setOpen}
        editData={editData}
        eventId={eventId}
        onSubmit={() => {
          refresh();
          setEditData(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
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
