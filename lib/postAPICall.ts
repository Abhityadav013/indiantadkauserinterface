import { ApiError } from '@/utils/ApiResponse';
import { ErrorResponse } from './types/error_type';
import { cookies } from 'next/headers';

interface PostOptions<T> {
  body: T;
}

export async function postToApi<TResponse, TBody>(
  endpoint: string,
  options: PostOptions<TBody>
): Promise<TResponse> {
  const cookieStore = await cookies(); // ✅ Always use this in App Router
  const deviceId = cookieStore.get('_device_id')?.value;
  const _device_id = deviceId || '';
  const response = await fetch(`${process.env.API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ssid: _device_id,
    },
    body: JSON.stringify(options.body),
    next: { revalidate: 0 },
  });

  let responseBody: {
    statusCode: number;
    data: TResponse;
    message: string;
    success: boolean;
    validationErrors?: ErrorResponse[];
  };

  try {
    responseBody = await response.json();
  } catch {
    throw new ApiError(response.status, [], 'Invalid JSON response from API');
  }

  if (!response.ok || !responseBody.success) {
    throw new ApiError(
      responseBody.statusCode ?? response.status,
      responseBody.validationErrors ?? [],
      responseBody.message ?? 'API call failed'
    );
  }

  return responseBody.data;
}
