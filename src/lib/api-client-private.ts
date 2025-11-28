import { getAuthToken } from '@/utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function buildUrl(endpoint: string) {
  return `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
}

function authHeaders(): HeadersInit {
  const tokenData = getAuthToken();
  if (tokenData?.access_token) {
    return {
      Authorization: `Bearer ${tokenData.access_token}`,
    };
  }

  return {};
}

export const privateApiClient = {
  async get(endpoint: string) {
    const res = await fetch(buildUrl(endpoint), {
      headers: {
        ...authHeaders(),
      },
    });
    console.log(res,'acsnacslkancs')
    if (!res.ok) throw new Error(`GET failed: ${res.status}`);
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  },

  async post(endpoint: string, data: any) {
    const res = await fetch(buildUrl(endpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`POST failed: ${res.status}`);
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  },

  async put(endpoint: string, data: any) {
    const res = await fetch(buildUrl(endpoint), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`PUT failed: ${res.status}`);
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  },

  async delete(endpoint: string) {
    const res = await fetch(buildUrl(endpoint), {
      method: 'DELETE',
      headers: {
        ...authHeaders(),
      },
    });
    if (!res.ok) throw new Error(`DELETE failed: ${res.status}`);
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  },
};
