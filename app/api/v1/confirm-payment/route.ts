// app/api/confirm-payment/route.ts

import Cart from '@/lib/mongodb/models/Cart';
import UserInfo from '@/lib/mongodb/models/UserInfo';
import { postToApi } from '@/lib/postAPICall';
import { CreateOrderRequest, OrderSuccessSummary } from '@/lib/types/order_summary';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId, basketId } = await req.json();

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Missing paymentIntentId' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const basketDetail = await Cart.findOne({ basketId: basketId });
    if (!basketDetail) {
      return NextResponse.json({ error: 'Basket not found' }, { status: 404 });
    }
    const userDetails = await UserInfo.findOne({ deviceId: basketDetail.deviceId });
    if (!userDetails) {
      return NextResponse.json({ error: 'User Deails not found' }, { status: 404 });
    }
    if (paymentIntent.status === 'succeeded') {
      // ✅ Payment was successful – now call internal API to save order
      const orderRes = await postToApi<OrderSuccessSummary, CreateOrderRequest>(
        'create-order-success',
        {
          body: {
            orderDetails: basketDetail.cartItems,
            orderType: userDetails.orderMethod,
            paymentIntentId: paymentIntentId,
            deliveryFee: userDetails.deliveryFee,
          },
        }
      );

      return NextResponse.json(
        {
          message: 'Payment confirmed and order created.',
          paymentIntent,
          orderId: orderRes.displayId,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: 'Payment not successful yet.' }, { status: 400 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
