import { useGetCartQuery, useUpdateCartMutation } from '@/store/api/cartApi';
import { useEffect, useState } from 'react';
import { MenuItem } from '@/lib/types/menu_type';
import { Cart } from '@/lib/types/cart_type';
import { useHasMounted } from './useHasMounted';

// Default cart structure to prevent hydration mismatches
const DEFAULT_CART = {
  cartItems: [] as Cart[],
  basketId: '',
};

export function useCart() {
  const hasMounted = useHasMounted();
  const [cartData, setCartData] = useState<Cart[]>([]);
  
  // Query cart from backend with safe defaults
  const { data: cart = DEFAULT_CART, isLoading } = useGetCartQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!isLoading && hasMounted) {
      setCartData(cart.cartItems || []);
    }
  }, [cart, isLoading, hasMounted]);

  // Mutation to update cart
  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation();

  // Local state for menu items (if needed)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Add item to cart
  const addToCart = async (item: MenuItem) => {
    if (isLoading || isUpdating) return Promise.reject('Cart is busy');

    // Copy current cart or empty array
    const updatedCart = cart?.cartItems ? [...cart.cartItems] : [];
    const itemIndex = updatedCart.findIndex((cartItem) => cartItem.itemId === item.id);

    if (itemIndex > -1) {
      updatedCart[itemIndex] = {
        ...updatedCart[itemIndex],
        quantity: updatedCart[itemIndex].quantity + 1,
      };
    } else {
      updatedCart.push({
        itemId: item.id,
        itemName: item.name,
        quantity: 1,
      });
    }

    // Send update to backend
    return updateCart({ cart: updatedCart });
  };

  // Remove item from cart
  const removeFromCart = async (item: MenuItem) => {
    if (isLoading || isUpdating) return Promise.reject('Cart is busy');

    const updatedCart = (cart.cartItems || [])
      .map((cartItem) =>
        cartItem.itemId === item.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
      )
      .filter((cartItem) => cartItem.quantity > 0);

    return updateCart({ cart: updatedCart });
  };

  const updateMenuItems = (menuItems: MenuItem[]) => {
    setMenuItems(menuItems);
  };

  const getItemQuantity = (itemId: string) => {
    return cart?.cartItems?.find((item) => item.itemId === itemId)?.quantity || 0;
  };

  const getTotalItems = () => {
    return cart?.cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const getItemPriceWithMenu = (item: Cart) => {
    const menu = menuItems.find((mi) => mi.id === item.itemId);
    const itemPrice = menu?.price ?? 0;
    return { totalPrice: itemPrice * item.quantity, menu };
  };

  const clearCart = async () => {
    await updateCart({ cart: [], isCartEmpty: true });
  };

  const emptyCart = () => {
    setCartData([]);
  };

  const getCartTotal = () => {
    const cartTotal = (cart?.cartItems || []).reduce((total, cartItem) => {
      const foodItemMatch = menuItems.find((item) => item.id === cartItem.itemId);
      return foodItemMatch ? total + foodItemMatch.price * cartItem.quantity : total;
    }, 0);
    
    // Only access sessionStorage on client side
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('cartTotal', JSON.stringify(cartTotal));
      } catch (error) {
        console.warn('Failed to save cart total to sessionStorage:', error);
      }
    }
    
    return cartTotal;
  };

  return {
    isLoading,
    isUpdating,
    items: cartData,
    basketId: cart.basketId || '',
    menuItems,
    addToCart,
    removeFromCart,
    getItemQuantity,
    getTotalItems,
    getItemPriceWithMenu,
    clearCart,
    updateMenuItems,
    getCartTotal,
    emptyCart,
  };
}
