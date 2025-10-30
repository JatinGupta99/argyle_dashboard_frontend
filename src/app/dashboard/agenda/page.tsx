'use client';

import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { useAppDispatch } from '@/redux/hooks';
import { setExportClick, setExportLabel } from '@/redux/slices/toolbar-slice';
import { useEffect, useState } from 'react';
import { AgendaFormDialog } from './components/AgendaFormDialog';
import { AgendaTable } from './components/AgendaTable';

export default function AgendaPage() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [agendas, setAgendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  // ✅ Fetch agendas (replace with your actual service later)
  const fetchAgendas = async () => {
    setLoading(true);
    try {
      // Simulated fetch — replace with real API/service call
     const data = [
    {
      id: '#12341',
      title: 'AI & Cloud Conference',
      date: '23-10-2025 10:00 AM -12:00 AM',
      speaker: 'John Deo',
      audiencePoll:true,
      position: 'CEO of Melonleaf',
      profileUrl:'/images/schedule.webp'
    },
    {
      id: '#12342',
      title: 'AI & Cloud Conference',
      date: '23-10-2025 10:00 AM -12:00 AM',
      speaker: 'John Deo',
      position: 'CEO of Melonleaf',
      audiencePoll:true,
      profileUrl:'/images/schedule.webp'
    },
    {
      id: '#12343',
      title: 'AI & Cloud Conference',
      date: '23-10-2025 10:00 AM -12:00 AM',
      speaker: 'John Deo',
      position: 'CEO of Melonleaf',
      audiencePoll:true,
      profileUrl:'/images/schedule.webp'
    },
    {
      id: '#12344',
      title: 'AI & Cloud Conference',
      date: '23-10-2025 10:00 AM -12:00 AM',
      speaker: 'John Deo',
      audiencePoll:false,
      position: 'CEO of Melonleaf',
      profileUrl:'/images/schedule.webp'
    },
    {
      id: '#12345',
      title: 'AI & Cloud Conference',
      date: '23-10-2025 10:00 AM -12:00 AM',
      speaker: 'John Deo',
      audiencePoll:false,
      position: 'CEO of Melonleaf',
      profileUrl:'/images/schedule.webp'
    },
    {
      id: '#12346',
      title: 'AI & Cloud Conference',
      date: '23-10-2025 10:00 AM -12:00 AM',
      speaker: 'John Deo',
      audiencePoll:true,
      position: 'CEO of Melonleaf',
      profileUrl:'/images/schedule.webp'
    },
    {
      id: '#12347',
      title: 'AI & Cloud Conference',
      date: '23-10-2025 10:00 AM -12:00 AM',
      speaker: 'John Deo',
      audiencePoll:true,
      position: 'CEO of Melonleaf',
      profileUrl:'/images/schedule.webp'
    },
  ];
      setAgendas(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendas();

    // ✅ Setup toolbar button globally like "Add Speaker"
    dispatch(setExportLabel('Add Agenda'));
    dispatch(setExportClick(() => setOpen(true)));

  }, [dispatch]);

  const scheduleData = {
    month: new Date().toLocaleString('default', { month: 'long' }),
    scheduleCount: agendas.length,
    label: 'Agenda',
  };

  return (
    <div className="w-full space-y-6">
      <DashboardToolbar />
      <MonthlyScheduleSummary
        month={scheduleData.month}
        scheduleCount={scheduleData.scheduleCount}
        label={scheduleData.label}
      />

      {loading && <p>Loading agendas...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && <AgendaTable data={agendas} />}
      <AgendaFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={fetchAgendas}
        editData={editData}
      />
    </div>
  );
}
