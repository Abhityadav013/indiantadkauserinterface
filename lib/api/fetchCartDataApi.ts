import { fetchFromApi } from '../fetchAPICalls';
import { Cart } from '../types/cart_type';

interface GetCartResponse {
  cart: {
    id: string;
    cartItems: Cart[];
  };
}

export async function getCartData() {
  try {
    const cartRaw = await fetchFromApi<GetCartResponse>(`/cart`, false);
    return [...cartRaw.cart?.cartItems];
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return [];
  }
}
