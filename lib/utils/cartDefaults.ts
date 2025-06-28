import { Cart } from '../types/cart_type';

// Default cart structure to prevent hydration mismatches
export const DEFAULT_CART = {
  cartItems: [] as Cart[],
  basketId: '',
};

// Safe cart access utilities
export const getSafeCartItems = (cart: any): Cart[] => {
  return cart?.cartItems || [];
};

export const getSafeBasketId = (cart: any): string => {
  return cart?.basketId || '';
};

export const getSafeCartTotal = (cartItems: Cart[] = []): number => {
  return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
};

// Create a safe cart object
export const createSafeCart = (cart?: any) => {
  return {
    cartItems: getSafeCartItems(cart),
    basketId: getSafeBasketId(cart),
  };
}; 