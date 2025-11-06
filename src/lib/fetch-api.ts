export async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const fullUrl = `${process.env.NESTJS_API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  console.log('🌐 Fetching:', fullUrl);

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Fetch error: ${res.status} ${res.statusText} - ${errorText}`);
  }

  return res.json();
}
