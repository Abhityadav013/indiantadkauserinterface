/* eslint-disable @typescript-eslint/no-explicit-any */
import Cart from '@/lib/mongodb/models/Cart';
import UserInfo from '@/lib/mongodb/models/UserInfo';
import { postToApi } from '@/lib/postAPICall';
import { CreateOrderRequest, OrderSuccessSummary } from '@/lib/types/order_summary';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: Request) {
  try {
    const { token, amount, return_url, currency, basketId, discount } = await req.json();

    //const paymentIntentId = clientSecret.split('_secret')[0]; // Extract actual PaymentIntent ID

    // Step 1: Create Payment Method from Google Pay token
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: { token: token.id },
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethod.id,
      confirmation_method: 'automatic',
      confirm: true,
      return_url: return_url,
    });

    const basketDetail = await Cart.findOne({ basketId: basketId });
    if (!basketDetail) {
      return NextResponse.json({ error: 'Basket not found' }, { status: 404 });
    }
    const userDetails = await UserInfo.findOne({ deviceId: basketDetail.deviceId });
    if (!userDetails) {
      return NextResponse.json({ error: 'User Deails not found' }, { status: 404 });
    }
    if (discount && Object.keys(discount).length) {
      userDetails.discount = discount.discountAmount;
    }

    // if (paymentIntent.status === 'requires_action' && paymentIntent.next_action?.redirect_to_url) {
    //   return NextResponse.json({
    //     redirectUrl: paymentIntent.next_action.redirect_to_url.url,
    //     success: true,
    //   });
    // }
    const isDiscountApplied = discount && Object.keys(discount).length;

    if (paymentIntent.status === 'succeeded') {
      // ✅ Payment was successful – now call internal API to save order
      const orderRes = await postToApi<OrderSuccessSummary, CreateOrderRequest>(
        'create-order-success',
        {
          body: {
            orderDetails: basketDetail.cartItems,
            orderType: userDetails.orderMethod,
            paymentIntentId: paymentIntent.id,
            deliveryFee: userDetails.deliveryFee,
            deliveryAddress: userDetails?.address?.displayAddress,
            ...(isDiscountApplied && { discount }),
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
    } else {
      return NextResponse.json({ error: 'Payment not successful yet.' }, { status: 400 });
    }
    // return NextResponse.json({ success: true, paymentIntent });
  } catch (error: any) {
    console.error('Stripe payment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
