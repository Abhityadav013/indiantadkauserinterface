/* eslint-disable @typescript-eslint/no-explicit-any */
import Cart from '@/lib/mongodb/models/Cart';
import UserInfo from '@/lib/mongodb/models/UserInfo';
import { postToApi } from '@/lib/postAPICall';
import { CreateOrderRequest, OrderSuccessSummary } from '@/lib/types/order_summary';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { basketId } = await req.json();

    const basketDetail = await Cart.findOne({ basketId: basketId });
    if (!basketDetail) {
      return NextResponse.json({ error: 'Basket not found' }, { status: 404 });
    }
    const userDetails = await UserInfo.findOne({ deviceId: basketDetail.deviceId });
    if (!userDetails) {
      return NextResponse.json({ error: 'User Deails not found' }, { status: 404 });
    }

    const orderRes = await postToApi<OrderSuccessSummary, CreateOrderRequest>(
      'create-order-success',
      {
        body: {
          orderDetails: basketDetail.cartItems,
          orderType: userDetails.orderMethod,
          paymentIntentId: null,
          deliveryFee: userDetails.deliveryFee,
        },
      }
    );

    return NextResponse.json(
      {
        message: 'Order Confirm order created.',
        success: true,
        orderId: orderRes.displayId,
      },
      { status: 200 }
    );
    // return NextResponse.json({ success: true, paymentIntent });
  } catch (error: any) {
    console.error('Stripe payment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
