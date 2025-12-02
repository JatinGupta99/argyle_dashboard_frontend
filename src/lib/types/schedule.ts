import { SpeakerType } from './types';

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

export type TabLabel = 'ALL' | 'UPCOMING' | 'PAST';

export type CreateScheduleDto = Omit<Schedule, '_id' | 'createdAt' | 'updatedAt'>;

export type ScheduleStatus = 'ALL' | 'UPCOMING' | 'PAST';

export interface Speaker {
  _id: string;
  name: {
    firstName: string;
    lastName: string;
  };
  title: string;
  email: string;
  participantType: string;
  participationStatus: string;
  contactId: string;
  speakerType: SpeakerType;
  companyName?: string;
  bio?: string;
  pictureUrl: string;
  linkedInUrl: string;
  youtubeUrl: string;
}

export interface ScheduleItem {
  _id: string;
  title: string;
  date: string;
  time: string;
  speakers: Speaker[];
  status: ScheduleStatus;
}
