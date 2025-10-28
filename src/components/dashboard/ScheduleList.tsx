'use client';

import { ScheduleCard } from './ScheduleCard';

const schedules = Array(6).fill({
  title: 'Seminar on infrastructure technology for future life',
  time: '08:00 AM - 09:00 AM',
  day: 'Monday',
  speaker: 'Agnes Diva',
  position: 'CEO of Rush Technology',
});

export function ScheduleList({ status }: { status: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {schedules.map((item, i) => (
        <ScheduleCard key={i} {...item} />
      ))}
    </div>
  );
}
