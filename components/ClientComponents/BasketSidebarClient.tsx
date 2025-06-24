'use client';
import { MenuItem } from '@/lib/types/menu_type';
import BasketSidebar from './BasketSidebar';
import { Cart } from '@/lib/types/cart_type';
import { OrderType } from '@/lib/types/order_type';

interface BasketSidebarClientProps {
    menu: MenuItem[];
    cartItems: Cart[];
    orderType: OrderType;
}
export default function BasketSidebarClient(props: BasketSidebarClientProps) {
  return <BasketSidebar {...props} />;
} 