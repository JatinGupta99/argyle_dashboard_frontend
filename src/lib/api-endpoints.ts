export const API_BASE = '/api';

export const ENDPOINTS = {
  SPEAKERS: {
    ROOT: `${API_BASE}/speakers`,
    BY_ID: (id: string) => `${API_BASE}/speakers/${id}`,
  },
};
