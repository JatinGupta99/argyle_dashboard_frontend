import { Speaker } from './speaker';

// --- Main Event Interface ---
export interface EventSchedule {
  startTime: Date; // ISO 8601 Date string, e.g., "2025-11-11T08:41:00.000Z"
  endTime: Date; // ISO 8601 Date string
  _id: string;
}

export interface Event {
  _id: string;
  title: string;
  eventDetails: string;
  eventLogoUrl: string;
  EventDate: string; // YYYY-MM-DD format
  schedule: EventSchedule;
  privacy: 'public' | 'private' | string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED' | string;
  host: string; // User ID
  agendas: any[]; // Consider defining a specific Agenda interface later
  sponsors: any[]; // Consider defining a specific Sponsor interface later
  attendees: any[]; // Consider defining a specific Attendee interface later
  analytics: EventAnalytics;
  invitedUsers: any[]; // Consider defining a specific InvitedUser interface later
  createdBy: string; // User ID
  updatedBy: string | null; // User ID or null
  dailyRoomDetails: DailyRoomDetails;
  createdAt: string; // ISO 8601 Date string
  updatedAt: string; // ISO 8601 Date string
  __v: number;

  speakers?: Speaker[];
}

export interface EventAnalytics {
  registrationsCount: number;
  attendeesCount: number;
  boothClicks: number;
  leadsGenerated: number;
  chatLogsUrl: string;
  pollResultsUrl: string;
  sessionRecordingsUrl: string;
  joinedUsers: string[];
}

export interface DailyRoomDetails {
  dailyRoomName: string;
  dailyRoomUrl: string;
  max_participants: number;
  dailyRoomStatus: string;
}

// --- API Response Wrapper ---

/**
 * Interface representing the full response object from the API.
 */
export interface EventApiResponse {
  statusCode: number;
  data: Event;
}
