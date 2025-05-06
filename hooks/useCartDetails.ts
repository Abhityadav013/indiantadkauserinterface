import { useEffect, useState } from 'react';
import { MenuItem } from '@/lib/types/menu_type';
import { useGetCartQuery, useUpdateCartMutation } from '@/store/api/cartApi';
import { Cart } from '@/lib/types/cart_type';

export function useCart() {
  const [items, setItems] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: cart, isLoading } = useGetCartQuery();
  const [updateCart] = useUpdateCartMutation();


  useEffect(() => {
    if( cart?.length){
        setItems(cart || []);
    }
    if(isLoading){
        setLoading(false)
    }
    
   // setItems(cart || []);
  }, [loading, cart, setItems, isLoading]);

  const addToCart = (menuItems: MenuItem[], itemId: string) => {
    if (isLoading) {
      return;
    }
    const foodItem = menuItems.find((item) => item.id === itemId);
    if (!foodItem) return;

    const updatedCart = [...(cart || [])];
    const itemIndex = updatedCart.findIndex((cartItem) => cartItem.itemId === itemId);

    if (itemIndex > -1) {
      updatedCart[itemIndex] = {
        ...updatedCart[itemIndex],
        quantity: updatedCart[itemIndex].quantity + 1,
      };
    } else {
      updatedCart.push({
        itemId: itemId,
        itemName: foodItem.itemName,
        quantity: 1,
      });
    }

    updateCart({ cart: updatedCart });
  };

  const removeFromCart = (itemId: string) => {
    if (isLoading) {
        return;
      }
    const cartItems = [...(cart || [])];
    const updatedCart = cartItems
      .map((cartItem) =>
        cartItem.itemId === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
      )
      .filter((cartItem) => cartItem.quantity > 0);

    updateCart({ cart: updatedCart });
  };

  //   const removeFromCart = (itemId: string) => {
  //     setItems((currentItems) => {
  //       const existingItem = currentItems.find((i) => i.itemId === itemId);

  //       if (existingItem && existingItem.quantity > 1) {
  //         return currentItems.map((i) => (i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i));
  //       } else {
  //         return currentItems.filter((i) => i.itemId !== itemId);
  //       }
  //     });
  //   };

  const getItemQuantity = (itemId: string) => {
    return items.find((item) => item.itemId === itemId)?.quantity || 0;
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  //   const getTotalPrice = () => {
  //     return items.reduce((total, item) => total + item.price * item.quantity, 0);
  //   };

  const clearCart = () => {
    setItems([]);
  };

  return {
    items,
    loading,
    addToCart,
    removeFromCart,
    getItemQuantity,
    getTotalItems,
    // getTotalPrice,
    clearCart,
  };
}
