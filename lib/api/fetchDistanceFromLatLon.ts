import { location_distance_url } from "../apiEndpoints";

interface LocationDistance {
  lat: number;
  lon: number;
}

export const getDistanceFromLatLon = async (
  restroLocation: LocationDistance,
  userLocation: LocationDistance
): Promise<number | null> => {
  try {
    const { lat: restroLat, lon: restroLon } = restroLocation;
    const { lat: userLat, lon: userLon } = userLocation;

    const coords = `${restroLon},${restroLat};${userLon},${userLat}`;
    const url = `${location_distance_url}/${coords}?key=${process.env.NEXT_PUBLIC_LOCATION_API_KEY}&sources=0&destinations=1&annotations=distance`;

    if (process.env.NODE_ENV === 'development') {
      console.log('Distance API URL:', url);
    }

    const response = await fetch(url);

    if (!response.ok) {
      console.error('Distance API response not ok:', response.statusText);
      return null;
    }

    const data = await response.json();

    const distanceInMeters = data?.distances?.[0]?.[0];

    if (typeof distanceInMeters !== 'number') {
      console.error('Invalid distance data format:', data);
      return null;
    }

    return distanceInMeters / 1000; // Convert to kilometers
  } catch (error) {
    console.error('Error fetching distance:', error);
    return null;
  }
};