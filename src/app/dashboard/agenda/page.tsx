'use client';

import { AgendaTable } from './components/AgendaTable';
import { AgendaFormDialog } from './components/AgendaFormDialog';
import { useDialog } from '@/hooks/useDialog';
import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';

export default function AgendaPage() {
  const { open, toggle } = useDialog();
  const scheduleData = {
    month: new Date().toLocaleString('default', { month: 'long' }),
    scheduleCount: 25,
  };
  return (
   <>
    <DashboardToolbar exportLabel="Agenda">
      <div className="flex justify-end mb-3">
        <button
          onClick={toggle}
          className="bg-primary text-white px-3 py-1.5 rounded-md"
        >
          Add Agenda
        </button>
      </div>

      <AgendaTable />
      <AgendaFormDialog open={open} onOpenChange={toggle} />
    </DashboardToolbar>
<MonthlyScheduleSummary
            month={scheduleData.month}
            scheduleCount={scheduleData.scheduleCount}
          /></>
  );
}
