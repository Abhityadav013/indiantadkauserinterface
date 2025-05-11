import { UserLocation } from '../types/user_location_type';
import { getDistanceFromLatLon } from './fetchDistanceFromLatLon';

interface GetDistanceFromLatLonProp {
  userLocation: UserLocation;
}

interface Location {
    lat: number;
    lon: number;
  }
export async function getUserLocationFromLatLon({
  userLocation,
}: GetDistanceFromLatLonProp): Promise<number | boolean | string | undefined> {
  const INDIAN_TADKA_LAT = process.env.NEXT_PUBLIC_INDIAN_TADKA_LAT;
  const INDIAN_TADKA_LNG = process.env.NEXT_PUBLIC_INDIAN_TADKA_LNG;
  try {
    const restroLocation: Location = {
      lat: Number(INDIAN_TADKA_LAT),
      lon: Number(INDIAN_TADKA_LNG),
    };
    //console.log('restroLocation', userLocation)
    const parsedUserLocation: Location = {
      lat: userLocation?.lat ?? 0,
      lon: userLocation?.lng ?? 0,
    };

    // Get distance and handle it (store, log, or use it)
    const distance: number | null = await getDistanceFromLatLon(
      restroLocation,
      parsedUserLocation,
    );

    console.log('Distance:', distance, 'km');
    // If distance is greater than 10 km, return false
    if (typeof distance === 'number' && distance >= 10) return false;

    // If distance is within 3 km, delivery is free
    if (typeof distance === 'number' && distance < 3) return 'Free';
    // For every additional km beyond 3 km, add 0.5 to the base fee of 1
    let deliveryFee: number = 0; // Initialize with a default value
    if (typeof distance === 'number') {
      const extraKm = distance - 3;
      deliveryFee = 1 + extraKm * 0.5;
      return parseFloat(deliveryFee.toFixed(2)); // Return fee as a string with 2 decimal places
    }

    return parseFloat(deliveryFee.toFixed(2)); // Return fee as a string with 2 decimal places
    // console.log('distance', typeof distance);
    // return distance
  } catch (error) {
    console.error('Error parsing user location:', error);
  }
}
