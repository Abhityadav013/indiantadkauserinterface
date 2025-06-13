import { fetchFromApi } from '../fetchAPICalls';
import { OrderSuccessSummary } from '../types/order_summary';

export async function getOrderDetails(orderId:string) {
  try {
    const orderDetailRaw = await fetchFromApi<OrderSuccessSummary>(`/orders/${orderId}`,false);
    return orderDetailRaw;
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return {} as OrderSuccessSummary;
  }
}
