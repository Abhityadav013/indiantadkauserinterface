import { cookies } from 'next/headers';

interface FetchParams {
  [key: string]: string | number | boolean;
}

export async function fetchFromApi<T>(
  endpoint: string,
  params?: FetchParams // Optional query parameters
): Promise<T> {
  // Construct query string if params are passed

  const cookieStore = await cookies();
  const cookiesHeader = cookieStore.get('_device_id');
  const _device_id = cookiesHeader ? cookiesHeader.value : '';

  console.log('_device_id:::::::::',_device_id)

  const queryString = params
    ? '?' +
      new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, value.toString()])
      ).toString()
    : '';

  // Fetch request with query parameters (if provided)
  const res = await fetch(`${process.env.API_BASE_URL}${endpoint}${queryString}`, {
    credentials: 'include',
    headers: {
      ssid: _device_id || '',
    },
    // next: { revalidate: 3600 },
    // next: { tags: ['cart'] },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
  }

  const data = await res.json();
  return data.data; // assuming ApiResponse<T> shape
}
