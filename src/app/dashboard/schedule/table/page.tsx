'use client';

import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { Header } from '@/components/layout/Header';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect, useMemo, useState } from 'react';
import { SpeakerFormDialog } from '../../speakers/components/SpeakerFormDialog';
import { ScheduleItem, ScheduleTableContent } from '../components/ScheduleTableContent';
import { setExportLabel } from '@/redux/slices/toolbar-slice';

export default function ScheduleTable() {
  const dispatch = useAppDispatch();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSchedules = async () => {
      setLoading(true);
      try {
        // Mock data (you can replace this with real API)
        const data: ScheduleItem[] = [
          {
            title: 'Seminar on infrastructure technology for future life',
            date: '12-10-2025',
            time: '08:00 AM - 09:00 AM',
            speaker: {
              profileUrl: '/images/schedule.webp',
              name: 'Agnes Diva',
              designation: 'CEO of Rush Technology',
            },
            status: 'Upcoming',
          },
          {
            title: 'Seminar on smart cities and sustainability',
            date: '15-10-2025',
            time: '02:00 PM - 03:30 PM',
            speaker: {
              profileUrl: '/images/schedule.webp',
              name: 'John Smith',
              designation: 'Urban Planner, FutureCity Labs',
            },
            status: 'Pending',
          },
          {
            title: 'Seminar on infrastructure technology for future life',
            date: '12-10-2025',
            time: '08:00 AM - 09:00 AM',
            speaker: {
              profileUrl: '/images/schedule.webp',
              name: 'Agnes Diva',
              designation: 'CEO of Rush Technology',
            },
            status: 'Upcoming',
          },
          {
            title: 'Seminar on smart cities and sustainability',
            date: '15-10-2025',
            time: '02:00 PM - 03:30 PM',
            speaker: {
              profileUrl: '/images/schedule.webp',
              name: 'John Smith',
              designation: 'Urban Planner, FutureCity Labs',
            },
            status: 'Pending',
          },
          {
            title: 'Seminar on infrastructure technology for future life',
            date: '12-10-2025',
            time: '08:00 AM - 09:00 AM',
            speaker: {
              profileUrl: '/images/schedule.webp',
              name: 'Agnes Diva',
              designation: 'CEO of Rush Technology',
            },
            status: 'Upcoming',
          },
          {
            title: 'Seminar on smart cities and sustainability',
            date: '15-10-2025',
            time: '02:00 PM - 03:30 PM',
            speaker: {
              profileUrl: '/images/schedule.webp',
              name: 'John Smith',
              designation: 'Urban Planner, FutureCity Labs',
            },
            status: 'Pending',
          },
          {
            title: 'Seminar on infrastructure technology for future life',
            date: '12-10-2025',
            time: '08:00 AM - 09:00 AM',
            speaker: {
              profileUrl: '/images/schedule.webp',
              name: 'Agnes Diva',
              designation: 'CEO of Rush Technology',
            },
            status: 'Upcoming',
          },
          {
            title: 'Seminar on smart cities and sustainability',
            date: '15-10-2025',
            time: '02:00 PM - 03:30 PM',
            speaker: {
              profileUrl: '/images/schedule.webp',
              name: 'John Smith',
              designation: 'Urban Planner, FutureCity Labs',
            },
            status: 'Pending',
          },
        ];

        if (mounted) setSchedules(data);
      } catch (err: any) {
        if (mounted) setError(err.message || 'Something went wrong');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSchedules();

    dispatch(setExportLabel('Export'));

    return () => {
      mounted = false;
    };
  }, [dispatch, schedules.length]);

  const summaryData = useMemo(
    () => ({
      month: new Date().toLocaleString('default', { month: 'long' }),
      scheduleCount: schedules.length,
      label: 'Schedules',
    }),
    [schedules.length]
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <Header />
      <DashboardToolbar />

      <MonthlyScheduleSummary
        month={summaryData.month}
        scheduleCount={summaryData.scheduleCount}
        label={summaryData.label}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <ScheduleTableContent schedules={schedules} loading={loading} error={error} />
      </div>

      <SpeakerFormDialog open={open} onOpenChange={setOpen} onSuccess={() => {}} editData={null} />
    </div>
  );
}
