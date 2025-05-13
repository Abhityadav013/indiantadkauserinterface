import { Cart } from './cart_type';
import { OrderType } from './order_type';

export type OrderItemSummary = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export type OrderSuccessSummary = {
  displayId: string;
  orderId: string;
  orderType: OrderType;
  orderItems: OrderItemSummary[];
  orderAmount: {
    orderTotal: number;
    deliveryFee?: number;
    tipAmount?: number;
  };
  createdAt: Date | string;
};

export interface CreateOrderRequest {
  orderDetails: Cart[];
  orderType: OrderType;
  paymentIntentId?: string | null;
  deliveryFee?: number;
  tipAmount?: number;
}
