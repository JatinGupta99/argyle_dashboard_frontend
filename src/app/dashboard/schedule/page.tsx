'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setExportClick, setExportLabel } from '@/redux/slices/toolbar-slice';
import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import { ScheduleTabs } from './components/ScheduleTabs';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';

export default function SchedulePage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setExportLabel('Export'));
    dispatch(setExportClick(() => {}));
  }, [dispatch]);

  const scheduleData = {
    month: new Date().toLocaleString('default', { month: 'long' }),
    scheduleCount: 25,
  };

  return (
    <div className="w-full space-y-6">
      <DashboardToolbar />
      <MonthlyScheduleSummary
        month={scheduleData.month}
        scheduleCount={scheduleData.scheduleCount}
      />
      <ScheduleTabs />
    </div>
  );
}
