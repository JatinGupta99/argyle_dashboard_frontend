export const ENDPOINTS = {
  SPEAKERS: {
    ROOT: '/speakers',
    BY_ID: (id: string) => `/speakers/${id}`,
  },
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  USER: {
    GET_PROFILE: '/company-user/profile',
  },
};
