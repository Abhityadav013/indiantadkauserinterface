import { ApiError } from '@/utils/ApiResponse';
import { ErrorResponse } from './types/error_type';

interface PostOptions<T> {
  body: T;
}

export async function postToApi<TResponse, TBody>(
  endpoint: string,
  options: PostOptions<TBody>
): Promise<TResponse> {
  const ssid = localStorage.getItem('ssid');
  const _device_id = ssid || '';
  const response = await fetch(`/api/v1${endpoint}`, {
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
