import { fetchFromApi } from '../fetchAPICalls';
import { GetCouponData } from '../types/availabelCoupons';

export async function getAvailableCouponData(): Promise<GetCouponData[]> {
  try {
    const couponRaw = await fetchFromApi<GetCouponData[]>(`/available-coupons`, false);
    return couponRaw;
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return [{}] as GetCouponData[];
  }
}
