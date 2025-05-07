interface FetchParams {
  [key: string]: string | number | boolean;
}

export async function fetchFromApi<T>(
  endpoint: string,
  params?: FetchParams // Optional query parameters
): Promise<T> {
  // Construct query string if params are passed
  const queryString = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params).map(([key, value]) => [
          key,
          value.toString(),
        ])
      ).toString()
    : "";

  // Fetch request with query parameters (if provided)
  const res = await fetch(`${process.env.API_BASE_URL}${endpoint}${queryString}`, {
    next: { tags: ['category'], revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
  }

  const data = await res.json();
  return data.data; // assuming ApiResponse<T> shape
}
