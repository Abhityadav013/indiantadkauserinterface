import { useGetCartQuery, useUpdateCartMutation } from '@/store/api/cartApi';
import { useState } from 'react';
import { MenuItem } from '@/lib/types/menu_type';
import { Cart } from '@/lib/types/cart_type';

export function useCart() {
  // Query cart from backend
  const { data: cart = {cartItems:[],basketId:''}, isLoading } = useGetCartQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // Mutation to update cart
  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation();

  // Local state for menu items (if needed)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Add item to cart
  const addToCart = async (item: MenuItem) => {
    if (isLoading || isUpdating) return;

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
    await updateCart({ cart: updatedCart });
  };

  // Remove item from cart
  const removeFromCart = async (item: MenuItem) => {
    if (isLoading || isUpdating) return;

    const updatedCart = cart.cartItems
      .map((cartItem) =>
        cartItem.itemId === item.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
      )
      .filter((cartItem) => cartItem.quantity > 0);

    await updateCart({ cart: updatedCart });
  };

  const updateMenuItems = (menuItems: MenuItem[]) => {
    setMenuItems(menuItems);
  };

  const getItemQuantity = (itemId: string) => {
    return cart.cartItems.find((item) => item.itemId === itemId)?.quantity || 0;
  };

  const getTotalItems = () => {
    return cart.cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getItemPriceWithMenu = (item: Cart) => {
    const menu = menuItems.find((mi) => mi.id === item.itemId);
    const itemPrice = menu?.price ?? 0;
    return { totalPrice: itemPrice * item.quantity, menu };
  };

  const clearCart = async () => {
    await updateCart({ cart: [], isCartEmpty: true });
  };

  const getCartTotal = () => {
    const cartTotal =  cart.cartItems.reduce((total, cartItem) => {
      const foodItemMatch = menuItems.find((item) => item.id === cartItem.itemId);
      return foodItemMatch ? total + foodItemMatch.price * cartItem.quantity : total;
    }, 0);
    sessionStorage.setItem('cartTotal', JSON.stringify(cartTotal));
    return cartTotal

  };

  return {
    isLoading,
    isUpdating,
    items: cart.cartItems,
    basketId:cart.basketId,
    menuItems,
    addToCart,
    removeFromCart,
    getItemQuantity,
    getTotalItems,
    getItemPriceWithMenu,
    clearCart,
    updateMenuItems,
    getCartTotal,
  };
}
