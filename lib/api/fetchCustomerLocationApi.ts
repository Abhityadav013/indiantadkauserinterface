import { reverse_geocode_url } from "../apiEndpoints";
import { UserLocation } from "../types/user_location_type";

export const fetchCustomerLocationApi = async (
  address: string,
): Promise<UserLocation> => {
  const params = new URLSearchParams({
    key: process.env.NEXT_PUBLIC_LOCATION_API_KEY || '',
    format: 'json',
    q: address,
  });

  const response = await fetch(`${reverse_geocode_url}?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    return { lat: 0, lng: 0 } as UserLocation;
    // throw new Error(data.message || 'Failed to fetch customer details');
  }

  return { lat: data[0].lat, lng: data[0].lon } as UserLocation;
};