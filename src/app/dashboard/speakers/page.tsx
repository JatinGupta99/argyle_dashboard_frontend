'use client';

import { useDialog } from '@/hooks/useDialog';

import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { SpeakersTable } from './components/SpeakersTable';
import { SpeakerFormDialog } from './components/SpeakerFormDialog';

export default function SpeakersPage() {
  const { open, setOpen } = useDialog();

  const scheduleData = {
    month: new Date().toLocaleString('default', { month: 'long' }),
    scheduleCount: 25,
  };

  const speakers = [
    {
      _id: '6901ba06de3f36994585a25b',
      name: { firstName: 'John', lastName: 'Doe' },
      title: 'Senior Developer',
      email: 'john.doe@example.com',
      companyName: 'TechCorp',
      bio: 'John is an experienced backend engineer with 10+ years in software development.',
      pictureUrl: 'https://example.com/john.jpg',
      linkedInUrl: 'https://linkedin.com/in/johndoe',
      createdAt: '2025-10-29T06:53:58.710Z',
    },
    {
      _id: '6901ba16de3f36994585a25e',
      name: { firstName: 'Agnes', lastName: 'Diva' },
      title: 'Designer',
      email: 'agnes.d.va@gmail.com',
      companyName: 'Rush Technology',
      bio: 'Agnes is a talented designer with expertise in UI/UX.',
      pictureUrl: 'https://example.com/agnes.jpg',
      linkedInUrl: 'https://linkedin.com/in/agnesdiva',
      createdAt: '2025-10-29T06:54:14.392Z',
    },
  ];

  return (
    <>
      {/* Dashboard Toolbar */}
      <DashboardToolbar exportLabel="Speakers">
        <div className="flex justify-end mb-3">
          <button
            onClick={() => setOpen(true)}
            className="bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90"
          >
            Add Speaker
          </button>
        </div>
      </DashboardToolbar>

      {/* Monthly Summary */}
      <MonthlyScheduleSummary
        month={scheduleData.month}
        scheduleCount={scheduleData.scheduleCount}
      />

      {/* Speakers Table */}
      <SpeakersTable speakers={speakers} />

      {/* Speaker Dialog */}
      <SpeakerFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
