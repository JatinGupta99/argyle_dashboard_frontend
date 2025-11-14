export interface Schedule {
  _id: string;
  title: string;
  description?: string;
  date: string; // ISO string, e.g. "2025-10-30T00:00:00.000Z"
  time?: string; // e.g. "10:00 AM - 11:00 AM"
  location?: string;
  speakerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TabLabel = 'All' | 'Pending' | 'Upcoming' | 'Past';

export type CreateScheduleDto = Omit<Schedule, '_id' | 'createdAt' | 'updatedAt'>;

export type ScheduleStatus = 'Upcoming' | 'Pending' | 'Past';

export interface Speaker {
  profileUrl: string;
  name: string;
  designation: string;
}

export interface ScheduleItem {
  _id: string;
  title: string;
  date: string;
  time: string;
  speakers: Speaker[];
  status: ScheduleStatus;
}
