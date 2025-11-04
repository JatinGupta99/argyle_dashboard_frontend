'use client';

import { useState } from 'react';
import { ScheduleCard } from './ScheduleCard';

interface Schedule {
  title: string;
  time: string;
  day: string;
  speaker: string;
  position: string;
  image?: string;
}

const schedules: Schedule[] = [
  {
    title: 'Seminar on Infrastructure Technology for Future Life',
    time: '08:00 AM - 09:00 AM',
    day: 'Monday',
    speaker: 'Agnes Diva',
    position: 'CEO of Rush Technology',
    image: '/images/schedule.webp',
  },
  {
    title: 'Seminar on Infrastructure Technology for Future Life',
    time: '08:00 AM - 09:00 AM',
    day: 'Monday',
    speaker: 'Agnes Diva',
    position: 'CEO of Rush Technology',
    image: '/images/schedule.webp',
  },
  {
    title: 'Seminar on Infrastructure Technology for Future Life',
    time: '08:00 AM - 09:00 AM',
    day: 'Monday',
    speaker: 'Agnes Diva',
    position: 'CEO of Rush Technology',
    image: '/images/schedule.webp',
  },
  {
    title: 'Seminar on Infrastructure Technology for Future Life',
    time: '08:00 AM - 09:00 AM',
    day: 'Monday',
    speaker: 'Agnes Diva',
    position: 'CEO of Rush Technology',
    image: '/images/schedule.webp',
  },
  {
    title: 'Seminar on Infrastructure Technology for Future Life',
    time: '08:00 AM - 09:00 AM',
    day: 'Monday',
    speaker: 'Agnes Diva',
    position: 'CEO of Rush Technology',
    image: '/images/schedule.webp',
  },
  {
    title: 'Seminar on Infrastructure Technology for Future Life',
    time: '08:00 AM - 09:00 AM',
    day: 'Monday',
    speaker: 'Agnes Diva',
    position: 'CEO of Rush Technology',
    image: '/images/schedule.webp',
  },
];

export function ScheduleList() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const handleSelect = (index: number) => {
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {schedules.map((item, i) => (
        <div key={i} className="h-full">
          <ScheduleCard {...item} selected={selectedIndex === i} onSelect={() => handleSelect(i)} />
        </div>
      ))}
    </div>
  );
}
