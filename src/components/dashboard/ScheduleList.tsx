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
    image: '/images/speakers/agnes-diva.jpg',
  },
  {
    title: 'Cybersecurity in Smart Cities',
    time: '03:00 PM - 04:00 PM',
    day: 'Thursday',
    speaker: 'Marcus Lee',
    position: 'CTO, SecureNet',
    image: '/images/speakers/marcus-lee.jpg',
  },
  {
    title: 'AI & Robotics in Modern Society',
    time: '10:00 AM - 11:30 AM',
    day: 'Tuesday',
    speaker: 'Dr. Ethan Wells',
    position: 'Head of Research, Nova Robotics',
    image: '/images/speakers/ethan-wells.jpg',
  },
  {
    title: 'Seminar on Infrastructure Technology for Future Life',
    time: '08:00 AM - 09:00 AM',
    day: 'Monday',
    speaker: 'Agnes Diva',
    position: 'CEO of Rush Technology',
    image: '/images/speakers/agnes-diva.jpg',
  },
  {
    title: 'Cybersecurity in Smart Cities',
    time: '03:00 PM - 04:00 PM',
    day: 'Thursday',
    speaker: 'Marcus Lee',
    position: 'CTO, SecureNet',
    image: '/images/speakers/marcus-lee.jpg',
  },
  {
    title: 'AI & Robotics in Modern Society',
    time: '10:00 AM - 11:30 AM',
    day: 'Tuesday',
    speaker: 'Dr. Ethan Wells',
    position: 'Head of Research, Nova Robotics',
    image: '/images/speakers/ethan-wells.jpg',
  },
  {
    title: 'Seminar on Infrastructure Technology for Future Life',
    time: '08:00 AM - 09:00 AM',
    day: 'Monday',
    speaker: 'Agnes Diva',
    position: 'CEO of Rush Technology',
    image: '/images/speakers/agnes-diva.jpg',
  },
  {
    title: 'Cybersecurity in Smart Cities',
    time: '03:00 PM - 04:00 PM',
    day: 'Thursday',
    speaker: 'Marcus Lee',
    position: 'CTO, SecureNet',
    image: '/images/speakers/marcus-lee.jpg',
  },
  {
    title: 'AI & Robotics in Modern Society',
    time: '10:00 AM - 11:30 AM',
    day: 'Tuesday',
    speaker: 'Dr. Ethan Wells',
    position: 'Head of Research, Nova Robotics',
    image: '/images/speakers/ethan-wells.jpg',
  },
];

export function ScheduleList() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    // if same card clicked again, deselect it
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {schedules.map((item, i) => (
        <ScheduleCard
          key={i}
          {...item}
          selected={selectedIndex === i}
          onSelect={() => handleSelect(i)}
        />
      ))}
    </div>
  );
}
