import { Cart } from '../types/cart_type';

// Define a proper cart type
interface CartData {
  cartItems?: Cart[];
  basketId?: string;
}

// Default cart structure to prevent hydration mismatches
export const DEFAULT_CART = {
  cartItems: [] as Cart[],
  basketId: '',
};

// Safe cart access utilities
export const getSafeCartItems = (cart: CartData | null | undefined): Cart[] => {
  return cart?.cartItems || [];
};

export const getSafeBasketId = (cart: CartData | null | undefined): string => {
  return cart?.basketId || '';
};

export const getSafeCartTotal = (cartItems: Cart[] = []): number => {
  return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
};

// Create a safe cart object
export const createSafeCart = (cart?: CartData | null) => {
  return {
    cartItems: getSafeCartItems(cart),
    basketId: getSafeBasketId(cart),
  };
}; 