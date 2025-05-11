import { reverse_geocode_url } from "../apiEndpoints";
import { Location } from "../types/location_type";

export const fetchLocationApi = async (
  address: string,
): Promise<Location[]> => {
  const params = new URLSearchParams({
    key: process.env.NEXT_PUBLIC_LOCATION_API_KEY || '',
    format: 'json',
    q: address,
  });

  const response = await fetch(`${reverse_geocode_url}?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    return [] as Location[];
    // throw new Error(data.message || 'Failed to fetch customer details');
  }

  return data as Location[];
};