import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const { amount,currency } = await request.json();

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Convert to cents
      currency: currency,
      payment_method_types: ['card'], // Support PayPal / card
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Internal Error:', error);
    return NextResponse.json({ error: `Internal Server Error: ${error}` }, { status: 500 });
  }
}
