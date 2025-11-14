'use client';

import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { Header } from '@/components/layout/Header';
import { ScheduleItem, TabLabel } from '@/lib/types/schedule';
import { useAppDispatch } from '@/redux/hooks';
import { setExportLabel } from '@/redux/slices/toolbar-slice';
import { useEffect, useMemo, useState } from 'react';
import { SpeakerFormDialog } from '../../speakers/components/SpeakerFormDialog';
import { ScheduleTableCardList, } from '../components/ScheduleTableCardList';

const MOCK_SCHEDULE_DATA: ScheduleItem[] = [
  {
    _id: '1',
    title: 'Seminar on infrastructure technology for future life',
    date: '12-10-2025',
    time: '08:00 AM - 09:00 AM',
    speakers: [
      { profileUrl: '/images/s1.webp', name: 'Agnes', designation: 'CEO' },
      { profileUrl: '/images/s2.webp', name: 'John', designation: 'Planner' },
      { profileUrl: '/images/s3.webp', name: 'Maria', designation: 'CTO' },
      { profileUrl: '/images/s4.webp', name: 'Kyle', designation: 'CFO' },
    ],
    status: 'Upcoming',
  },
  {
    _id: '2',
    title: 'Seminar on infrastructure technology for future life',
    date: '12-10-2025',
    time: '08:00 AM - 09:00 AM',
    speakers: [
      { profileUrl: '/images/s1.webp', name: 'Agnes', designation: 'CEO' },
      { profileUrl: '/images/s2.webp', name: 'John', designation: 'Planner' },
      { profileUrl: '/images/s3.webp', name: 'Maria', designation: 'CTO' },
      { profileUrl: '/images/s4.webp', name: 'Kyle', designation: 'CFO' },
    ],
    status: 'Past',
  },
  {
    _id: '3',
    title: 'Seminar on infrastructure technology for future life',
    date: '12-10-2025',
    time: '08:00 AM - 09:00 AM',
    speakers: [
      { profileUrl: '/images/s1.webp', name: 'Agnes', designation: 'CEO' },
      { profileUrl: '/images/s2.webp', name: 'John', designation: 'Planner' },
      { profileUrl: '/images/s3.webp', name: 'Maria', designation: 'CTO' },
      { profileUrl: '/images/s4.webp', name: 'Kyle', designation: 'CFO' },
    ],
    status: 'Pending',
  },
  {
    _id: '4',
    title: 'Seminar on infrastructure technology for future life',
    date: '12-10-2025',
    time: '08:00 AM - 09:00 AM',
    speakers: [
      { profileUrl: '/images/s1.webp', name: 'Agnes', designation: 'CEO' },
      { profileUrl: '/images/s2.webp', name: 'John', designation: 'Planner' },
      { profileUrl: '/images/s3.webp', name: 'Maria', designation: 'CTO' },
      { profileUrl: '/images/s4.webp', name: 'Kyle', designation: 'CFO' },
    ],
    status: 'Upcoming',
  }
];

export default function ScheduleTable() {
  const dispatch = useAppDispatch();

  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<TabLabel>('All');

  useEffect(() => {
    let mounted = true;

    dispatch(setExportLabel('Add Event'));

    const loadSchedules = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (mounted) setSchedules(MOCK_SCHEDULE_DATA);
      } catch (err: any) {
        if (mounted) setError(err.message || 'Something went wrong');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSchedules();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const summaryData = useMemo(
    () => ({
      month: new Date().toLocaleString('default', { month: 'long' }),
      scheduleCount: schedules.length,
      label: 'Schedules',
    }),
    [schedules.length]
  );

  // Count totals
  const statusCounts = useMemo(() => {
    const counts = { Upcoming: 0, Past: 0, Pending: 0 };
    schedules.forEach((s) => {
      if (s.status in counts) counts[s.status]++;
    });
    return counts;
  }, [schedules]);

  const filteredSchedules = useMemo(() => {
    if (activeTab === 'All') return schedules;
    return schedules.filter((s) => s.status === activeTab);
  }, [activeTab, schedules]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <Header />
      <DashboardToolbar />

      <MonthlyScheduleSummary
        month={summaryData.month}
        scheduleCount={summaryData.scheduleCount}
        label={summaryData.label}
      />

     <ScheduleTableCardList
  summaryCount={summaryData.scheduleCount}
  upcoming={statusCounts.Upcoming}
  past={statusCounts.Past}
  pending={statusCounts.Pending}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  schedules={filteredSchedules}
  loading={loading}
  error={error}
/>


      <SpeakerFormDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => {}}
        editData={null}
      />
    </div>
  );
}
