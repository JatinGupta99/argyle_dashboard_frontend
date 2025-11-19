export interface Agenda {
  _id: string;
  title: string;
  description: string;
  date: string; // ISO Date String (e.g., "2025-12-10T09:00:00.000Z")
  startDateTime?: string; // ISO Date String (e.g., "2025-12-10T09:00:00.000Z")
  startTime?: string; // ISO Date String (e.g., "2025-12-10T09:00:00.000Z")
  endTime?: string; // ISO Date String (e.g., "2025-12-10T09:00:00.000Z")
  endDateTime?: string; // ISO Date String
  /** Array of Speaker IDs */
  speakers: string[];
  hasPoll: boolean;
  event: string; // Event ID
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type CreateAgendaDto = Omit<Agenda, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'event'>;

export type UpdateAgendaDto = Partial<CreateAgendaDto>;
