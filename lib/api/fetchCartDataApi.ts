import { fetchFromApi } from '../fetchAPICalls';
import { Cart } from '../types/cart_type';

interface GetCartResponse {
  id: string;
  cartItems: Cart[];
}

export async function getCartData() {
  try {
    const cartRaw = await fetchFromApi<GetCartResponse>(`/cart`, false);
    if (Object.keys(cartRaw).length) {
       return [...cartRaw?.cartItems];
    } else {
     return []
    }
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return [];
  }
}
