import { useEffect, useState } from 'react';
import { MenuItem } from '@/lib/types/menu_type';
import { useGetCartQuery } from '@/store/api/cartApi';
import { Cart } from '@/lib/types/cart_type';

export function useCart() {
  const [items, setItems] = useState<Cart[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: cart, isLoading } = useGetCartQuery();
  useEffect(() => {
    if (!items.length && cart?.length) {
      setItems(cart?.length ? cart : []);
    }

    if (isLoading) {
      setLoading(false);
    }
  }, [cart, items, isLoading, setItems]);

  const addToCart = (item: MenuItem): Cart[] => {
    if (isLoading) {
      return [] as Cart[];
    }

    const updatedCart = [...(cart || [])];
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
    setItems(updatedCart);
    return updatedCart;
  };

  const removeFromCart = (item: MenuItem): Cart[] => {
    if (isLoading) {
      return [] as Cart[];
    }
    const cartItems = [...(cart || [])];
    const updatedCart = cartItems
      .map((cartItem) =>
        cartItem.itemId === item.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
      )
      .filter((cartItem) => cartItem.quantity > 0);
    setItems(updatedCart);
    return updatedCart;
  };

  const updateMenuItems = (menuItems: MenuItem[]) => {
    
    setMenuItems(menuItems);
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
    // Use reduce to accumulate the count of items with quantity > 0
    return items.reduce((total, item) => (item.quantity > 0 ? total + 1 : total), 0);
  };

  //   const getTotalPrice = () => {
  //     return items.reduce((total, item) => total + item.price * item.quantity, 0);
  //   };
  const getItemPriceWithMenu = (item: Cart) => {
    const menu = menuItems.find((mi) => mi.id === item.itemId);
    const itemPrice = menu?.price ?? 0;
    return { totalPrice: itemPrice * item.quantity, menu };
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, cartItem) => {
      console.log('menuItems::::::::::',menuItems)
      const foodItemMatch = menuItems.find((item) => item.id === cartItem.itemId);
      return foodItemMatch ? total + foodItemMatch.price * cartItem.quantity : total;
    }, 0);
  };

  return {
    items,
    menuItems,
    loading,
    addToCart,
    removeFromCart,
    getItemQuantity,
    getTotalItems,
    getItemPriceWithMenu,
    // getTotalPrice,
    clearCart,
    updateMenuItems,
    getCartTotal
  };
}
