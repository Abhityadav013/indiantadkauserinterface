import { connectToDatabase } from '@/lib/mongodb/connect';
import Transaction from '@/lib/mongodb/models/Transaction';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') as string;
  const body = await req.text();

  let event;

  try {
    // Verify the webhook signature to make sure it's from Stripe
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret); // Use constructEvent, not constructEventAsync
  } catch (err) {
    console.error('Error verifying webhook signature', err);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  // Handle the event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
      await storeTransaction(paymentIntentSucceeded, 'succeeded');
      break;
    case 'payment_intent.payment_failed':
      const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
      await storeTransaction(paymentIntentFailed, 'failed');
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

const storeTransaction = async (
  paymentIntent: Stripe.PaymentIntent,
  status: string
) => {
  try {

    await connectToDatabase();  // Ensure DB connection
    const transaction = new Transaction({ // Generate a unique transaction ID
      paymentProvider: 'stripe',
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount_received / 100,  // Convert from cents
      currency: paymentIntent.currency,
      status,
      created: new Date(paymentIntent.created * 1000), // Convert timestamp
      metadata: paymentIntent.metadata,
    });

    // Save the transaction to the database
    await transaction.save();

  } catch (error) {
    console.error('Error inserting transaction:', error);
  }
};

