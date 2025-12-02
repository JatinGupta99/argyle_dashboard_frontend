export const ENDPOINTS = {
  SPEAKERS: {
    ROOT: (eventId: string) => `/events/${eventId}/speakers`,
    BY_ID: (eventId: string, speakerId: string) => `/events/${eventId}/speakers/${speakerId}`,
    UPLOAD_URL: (eventId: string, speakerId: string) =>
      `/events/${eventId}/speakers/${speakerId}/upload-url`,
  },
  SPONSORS: {
    ROOT: (eventId: string) => `/events/${eventId}/sponsors`,
    BY_ID: (eventId: string, sponsorId: string) => `/events/${eventId}/sponsors/${sponsorId}`,
    UPLOAD_URL: (eventId: string, sponsorId: string) =>
      `/events/${eventId}/sponsors/${sponsorId}/upload-url`,
  },
  AGENDAS: {
    ROOT: (eventId: string) => `/events/${eventId}/agendas`,
    BY_ID: (eventId: string, agendaId: string) => `/events/${eventId}/agendas/${agendaId}`,
  },
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    RESET_PASSWORD: '/auth/reset-password',
    SETUP_PASSWORD: '/auth/setup-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  USER: {
    GET_PROFILE: '/company-user/profile',
  },
  USERS: {
    ROOT: '/company-user',
    BY_ID: (userId: string) => `/company-user/${userId}`,
  },
  EVENTS: {
    FETCH_BY_ID: (eventId: string) => `events/${eventId}`,
    DELETE_BY_ID: (eventId: string) => `/events/${eventId}`,
    UPDATE_BY_ID: (eventId: string) => `/events/${eventId}`,
    FETCH_ALL: `events`,
    ROOT: `/events`,
    FETCH_ALL_EVENT_DETAILS: `events/details`,
    UPLOAD_URL: (eventId: string) => `/events/${eventId}/upload-url`,
  },
};
