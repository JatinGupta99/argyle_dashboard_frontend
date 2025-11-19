export const ENDPOINTS = {
  SPEAKERS: {
    ROOT: (eventId: string) => `/events/${eventId}/speakers`,
    BY_ID: (eventId: string, speakerId: string) => `/events/${eventId}/speakers/${speakerId}`,
    UPLOAD_URL: (eventId: string, speakerId: string) =>
      `/events/${eventId}/speakers/${speakerId}/upload-url`,
  },
 AGENDAS: {
    ROOT: (eventId: string) => `/events/${eventId}/agendas`,
    BY_ID: (eventId: string, agendaId: string) =>
      `/events/${eventId}/agendas/${agendaId}`,
  },
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  USER: {
    GET_PROFILE: '/company-user/profile',
  },
  Event:{
    FETCH_BY_ID: (eventId: string) => `events/${eventId}`,
  }
};
