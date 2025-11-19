// api-client-public.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function buildUrl(endpoint: string) {
  return `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
}

export const publicApiClient = {
  async get(endpoint: string) {
    const res = await fetch(buildUrl(endpoint));
    if (!res.ok) throw new Error(`GET failed: ${res.status}`);
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  },

  async post(endpoint: string, data: any) {
    const res = await fetch(buildUrl(endpoint), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`POST failed: ${res.status}`);
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  },
};
