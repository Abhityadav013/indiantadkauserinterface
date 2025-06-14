// app/api/paypal/capture-order/[orderID]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@paypal/paypal-server-sdk';
import { ordersController } from '@/lib/paypal';
import Cart from '@/lib/mongodb/models/Cart';
import UserInfo from '@/lib/mongodb/models/UserInfo';
import { CreateOrderRequest, OrderSuccessSummary } from '@/lib/types/order_summary';
import { postToApi } from '@/lib/postAPICall';

export async function POST(request: NextRequest) {
  // Get amount and order from the request body
  const { orderID, basketId } = await request.json();
  try {
    const response = await ordersController.captureOrder({
      id: orderID,
      prefer: 'return=minimal',
    });

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
          paymentIntentId: response.result.id,
          deliveryFee: userDetails.deliveryFee,
        },
      }
    );
    return NextResponse.json(
      {
        message: 'Payment confirmed and order created.',
        success: true,
        orderId: orderRes.displayId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Capture Order Error:', error);
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
