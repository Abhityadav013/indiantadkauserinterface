import { fetchFromApi } from '../fetchAPICalls';
import { Cart } from '../types/cart_type';

interface GetCartResponse {
  id: string;
  cartItems: Cart[];
  basketId: string;
}

export interface GetCartData {
  cartItems: Cart[];
  basketId: string;
}

export async function getCartData(): Promise<GetCartData> {
  try {
    const cartRaw = await fetchFromApi<GetCartResponse>(`/cart`, false);
    if (Object.keys(cartRaw).length) {
      return { cartItems: [...cartRaw?.cartItems], basketId: cartRaw.basketId };
    } else {
      return { cartItems: [], basketId: '' };
    }
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return { cartItems: [], basketId: '' };
  }
}
