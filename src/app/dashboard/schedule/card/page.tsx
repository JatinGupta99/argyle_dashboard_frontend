'use client';

import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { Header } from '@/components/layout/Header';
import { useAppDispatch } from '@/redux/hooks';
import { setExportClick, setExportLabel } from '@/redux/slices/toolbar-slice';
import { useEffect, useMemo } from 'react';
import { ScheduleTabs } from '../components/ScheduleTabs';
import { toast } from 'sonner';

export default function SchedulePage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setExportLabel('Export'));

    dispatch(
      setExportClick(() => {
        toast.info('Data export started...', {
          description: 'Please wait while your data is being exported.',
        });

        setTimeout(() => {
          toast.success('Export completed successfully', {
            description: `Finished at ${new Date().toLocaleTimeString()}`,
          });
        }, 2000);
      })
    );
  }, [dispatch]);

  const scheduleData = useMemo(
    () => ({
      month: new Date().toLocaleString('default', { month: 'long' }),
      scheduleCount: 25,
      label: 'Schedules',
    }),
    []
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <Header />
      <DashboardToolbar />
      <MonthlyScheduleSummary
        month={scheduleData.month}
        scheduleCount={scheduleData.scheduleCount}
        label={scheduleData.label}
      />

      <main className="flex-1 overflow-hidden p-6">
        <section className="h-[70vh] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <ScheduleTabs />
        </section>
      </main>
    </div>
  );
}
