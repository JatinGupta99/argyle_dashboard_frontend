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

export type CreateScheduleDto = Omit<Schedule, '_id' | 'createdAt' | 'updatedAt'>;
