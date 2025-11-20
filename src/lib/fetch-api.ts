import { getAuthToken } from '@/utils/auth';

export async function fetchApi<T>(
  url: string,
   options?: RequestInit & { query?: Record<string, any> },
): Promise<{ statusCode: number; data: T }> {
  console.log('🌍 API Base URL:', process.env.NEXT_PUBLIC_NESTJS_API_BASE_URL); // <-- debug

  let fullUrl = `${process.env.NEXT_PUBLIC_NESTJS_API_BASE_URL}${url}`;
   if (options?.query) {
    const params = new URLSearchParams();

    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    fullUrl += `?${params.toString()}`;
  }
  console.log('➡️ Fetching:', fullUrl);
  const token = getAuthToken()?.access_token;
  console.log(token, 'access_tokenclknalscnalcsknaclsknalsck');
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fetch error ${res.status}: ${text}`);
  }

  return res.json();
}
