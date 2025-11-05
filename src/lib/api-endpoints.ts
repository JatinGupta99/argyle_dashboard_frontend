export const API_BASE = '/api';

export const ENDPOINTS = {
  SPEAKERS: {
    ROOT: `${API_BASE}/speakers`,
    BY_ID: (id: string) => `${API_BASE}/speakers/${id}`,
  },
  AUTH:{
    LOGIN:`${API_BASE}/auth/login`,
    LOGOUT:`${API_BASE}/auth/logout`
  },
  USER:{
    GET_PROFILE:`${API_BASE}/company-user/profile`
  }
};
