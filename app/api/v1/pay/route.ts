/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: Request) {
  try {
    const { token, clientSecret, returnURL } = await req.json();

    // Confirm payment using payment method (Google Pay token)
    const paymentIntentId = clientSecret.split('_secret')[0]; // Extract actual PaymentIntent ID
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method_data: {
        type: 'card',
        card: {
          token: token.id,
        },
      },
      return_url: returnURL, // ✅ Set your post-payment redirect URL
    } as any);

    // If SCA or redirect is required, Stripe will handle it
    if (paymentIntent.status === 'requires_action' && paymentIntent.next_action?.redirect_to_url) {
      return NextResponse.json({ redirectUrl: paymentIntent.next_action.redirect_to_url.url,success: true });
    }
    if (paymentIntent.status === 'succeeded') {
      return NextResponse.json({ redirectUrl: returnURL,success: true });
    }

    // return NextResponse.json({ success: true, paymentIntent });
  } catch (error: any) {
    console.error('Stripe payment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
