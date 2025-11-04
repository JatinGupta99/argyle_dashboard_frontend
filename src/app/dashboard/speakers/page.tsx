'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setExportAction, setExportClick, setExportLabel } from '@/redux/slices/toolbar-slice';

import { Header } from '@/components/layout/Header';
import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { SpeakerFormDialog } from './components/SpeakerFormDialog';
import { SpeakersTable } from './components/SpeakersTable';
import type { Speaker } from '@/lib/types/speaker';
import { useSpeakers } from './hooks/useSpeakers';
import { Button } from '@/components/ui/button';

export default function SpeakersPage() {
  const dispatch = useAppDispatch();
  const { speakers: allSpeakers, loading, error, refetch } = useSpeakers();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Speaker | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(allSpeakers.length / itemsPerPage);

  const paginatedSpeakers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return allSpeakers.slice(start, start + itemsPerPage);
  }, [allSpeakers, currentPage]);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleOpenSpeakerDialog = (speaker: Speaker | null = null) => {
    setEditData(speaker);
    setOpen(true);
  };

  const summaryData = useMemo(
    () => ({
      month: new Date().toLocaleString('default', { month: 'long' }),
      scheduleCount: allSpeakers.length,
      label: 'Speakers',
    }),
    [allSpeakers.length]
  );

  useEffect(() => {
    dispatch(setExportLabel('Add Speaker'));
    dispatch(setExportClick(() => handleOpenSpeakerDialog()));
    dispatch(setExportAction('openSpeakerDialog'));

    return () => {
      dispatch(setExportLabel('Export'));
      dispatch(setExportAction(null));
    };
  }, [dispatch]);

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header />
      <DashboardToolbar />
      <MonthlyScheduleSummary {...summaryData} />

      <main className="flex-1 overflow-auto p-6 pb-10">
        <section className="mb-6 min-h-[70vh] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          {loading && <p className="p-4 text-gray-500">Loading speakers...</p>}
          {error && <p className="p-4 text-red-500">{error}</p>}
          {!loading && !error && (
            <>
              <SpeakersTable
                speakers={paginatedSpeakers}
                onEdit={handleOpenSpeakerDialog}
                height="60vh"
              />

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

      <SpeakerFormDialog
        open={open}
        onOpenChange={setOpen}
        editData={editData}
        onSuccess={refetch}
      />
    </div>
  );
}
