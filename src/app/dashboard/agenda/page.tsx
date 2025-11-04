'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setExportAction, setExportClick, setExportLabel } from '@/redux/slices/toolbar-slice';

import { Header } from '@/components/layout/Header';
import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { AgendaFormDialog } from './components/AgendaFormDialog';
import { AgendaTable } from './components/AgendaTable';
import { Button } from '@/components/ui/button';

export default function AgendaPage() {
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [agendas, setAgendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAgendas = useCallback(async () => {
    setLoading(true);
    try {
      const data = Array.from({ length: 100 }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        title: `AI & Cloud Conference ${i + 1}`,
        date: '23-10-2025 10:00 AM - 12:00 AM',
        speaker: 'John Deo',
        audiencePoll: i % 2 === 0,
        position: 'CEO of Melonleaf',
        profileUrl: '/images/schedule.webp',
      }));
      setAgendas(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgendas();
    dispatch(setExportLabel('Add Agenda'));
    dispatch(setExportClick(() => setOpen(true)));
    dispatch(setExportAction('openAgendaDialog'));
  }, [dispatch, fetchAgendas]);

  // Derived pagination data
  const totalPages = Math.ceil(agendas.length / itemsPerPage);
  const paginatedAgendas = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return agendas.slice(start, start + itemsPerPage);
  }, [agendas, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const scheduleData = useMemo(
    () => ({
      month: new Date().toLocaleString('default', { month: 'long' }),
      scheduleCount: agendas.length,
      label: 'Agenda',
    }),
    [agendas.length]
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <Header />
      <DashboardToolbar />
      <MonthlyScheduleSummary {...scheduleData} />
      <main className="flex-1 overflow-auto p-6 pb-10">
        <section className="mb-6 min-h-[70vh] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <p className="p-4 text-gray-500">Loading agendas...</p>
          ) : error ? (
            <p className="p-4 text-red-500">{error}</p>
          ) : (
            <>
              <AgendaTable data={paginatedAgendas} />
              <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                <Button
                  variant="outline"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="text-sm"
                >
                  &lt;
                </Button>

                <span className="text-sm text-gray-600">
                  Page <strong>{currentPage}</strong> of {totalPages}
                </span>

                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="text-sm"
                >
                  &gt;
                </Button>
              </div>
            </>
          )}
        </section>
      </main>

      <AgendaFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={fetchAgendas}
        editData={editData}
      />
    </div>
  );
}
