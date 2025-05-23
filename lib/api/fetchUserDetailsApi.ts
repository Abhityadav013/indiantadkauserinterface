import { fetchFromApi } from '../fetchAPICalls';
import { CustomerOrder } from '../types/customer_order_type';

export async function getUserData() {
  try {
    const userDetailsRaw = await fetchFromApi<CustomerOrder>(`/user-details`);
    return {...userDetailsRaw};
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return {} as CustomerOrder;
  }
}
