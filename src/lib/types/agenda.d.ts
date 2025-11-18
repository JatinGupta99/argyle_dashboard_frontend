// Assuming you have a basic Speaker type defined elsewhere, if needed for population
// import type { Speaker } from '@/lib/types/speaker';

/**
 * Defines the core structure of an Agenda item as stored in the database and
 * returned by the API (when speaker IDs are used).
 */
export interface Agenda {
  _id: string;
  title: string;
  description: string;
  startDateTime: string; // ISO Date String (e.g., "2025-12-10T09:00:00.000Z")
  endDateTime: string; // ISO Date String
  /** Array of Speaker IDs */
  speakers: string[];
  hasPoll: boolean;
  event: string; // Event ID
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * Defines the payload required to create a new Agenda item.
 * Excludes fields managed by the backend (like IDs, timestamps).
 */
export type CreateAgendaDto = Omit<Agenda, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'event'>;
// Example of CreateAgendaDto structure:
// {
//   title: 'New Session',
//   description: 'Description',
//   startDateTime: '...',
//   endDateTime: '...',
//   speakers: ['speakerId1'],
//   hasPoll: false,
// }

/**
 * Defines the payload required to update an existing Agenda item.
 * All fields are optional (Partial) as you only send what you intend to change.
 */
export type UpdateAgendaDto = Partial<CreateAgendaDto>;
