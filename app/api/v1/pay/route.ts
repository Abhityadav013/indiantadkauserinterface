/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: Request) {
  try {
    const { token, clientSecret } = await req.json();

    // Confirm payment using payment method (Google Pay token)
    const paymentIntentId = clientSecret.split('_secret')[0]; // Extract actual PaymentIntent ID
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method_data: {
        type: 'card',
        card: {
          token: token.id,
        },
      },
    } as any);

    if (paymentIntent.status === 'succeeded') {
      return NextResponse.json({ success: true });
    }

    // return NextResponse.json({ success: true, paymentIntent });
  } catch (error: any) {
    console.error('Stripe payment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
