import { connectToDatabase } from '@/lib/mongodb/connect';
import Transaction from '@/lib/mongodb/models/Transaction';
import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET;
const PAYPAL_BASE_URL =
  process.env.NEXT_PUBLIC_PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';

interface Payee {
  email_address: string;
  merchant_id: string;
}

interface Amount {
  value: string;
  currency_code: string;
}

interface SellerProtection {
  dispute_categories: string[]; // Array of dispute categories like 'ITEM_NOT_RECEIVED', 'UNAUTHORIZED_TRANSACTION'
  status: string; // Status of the seller protection, e.g., 'ELIGIBLE'
}

interface SupplementaryData {
  related_ids: { [key: string]: string }; // An object with related IDs (e.g., order ID, etc.)
}

interface SellerReceivableBreakdown {
  paypal_fee: Amount; // Fee amount breakdown for PayPal
  gross_amount: Amount; // Gross amount before fees
  net_amount: Amount; // Net amount after fees
}

interface Link {
  method: string;
  rel: string;
  href: string;
}

interface PayPalTransactionResource {
  payee: Payee;
  amount: Amount;
  seller_protection: SellerProtection;
  supplementary_data: SupplementaryData;
  update_time: string; // Timestamp of when the transaction was last updated
  create_time: string; // Timestamp of when the transaction was created
  final_capture: boolean; // Whether this is the final capture of the payment
  seller_receivable_breakdown: SellerReceivableBreakdown;
  links: Link[];
  id: string; // PayPal transaction ID
  status: string; // Transaction status (e.g., 'COMPLETED')
}



async function getPaypalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    throw new Error('PayPal credentials are not properly configured.');
  }

  const basicAuth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
  ).toString('base64');

  const tokenResponse = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!tokenResponse.ok) {
    throw new Error(
      'Failed to fetch access token. Status: ${tokenResponse.status}',
    );
  }

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    throw new Error('No access token received from PayPal.');
  }

  return { accessToken: tokenData.access_token, PAYPAL_BASE_URL };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function verifyWebhookSignature(payload: any, headers: Headers) {
  const transmission_id = headers.get('paypal-transmission-id');
  const transmission_time = headers.get('paypal-transmission-time');
  const cert_url = headers.get('paypal-cert-url');
  const auth_algo = headers.get('paypal-auth-algo');
  const transmission_sig = headers.get('paypal-transmission-sig');

  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    throw new Error('PAYPAL_WEBHOOK_ID is not configured.');
  }

  const verifyPayload = {
    transmission_id,
    transmission_time,
    cert_url,
    auth_algo,
    transmission_sig,
    webhook_id: webhookId,
    webhook_event: payload,
  };

  const { accessToken, PAYPAL_BASE_URL } = await getPaypalAccessToken();

  const verifyResponse = await fetch(
    `${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(verifyPayload),
    },
  );

  if (!verifyResponse.ok) {
    throw new Error(
      `Webhook signature verification failed. Status: ${verifyResponse.status}`,
    );
  }

  const verifyData = await verifyResponse.json();
  // Check if verification_status is 'SUCCESS'
  return verifyData.verification_status === 'SUCCESS';
}

export async function POST(request: NextRequest) {
  try {
    // Use request.json() to get the parsed body directly
    const payload = await request.json();

    const isVerified = await verifyWebhookSignature(payload, request.headers);
    if (!isVerified) {
      console.error('Webhook signature verification failed.');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 },
      );
    }

    // Parse the webhook event
    const event = payload;

    console.log('event::::::::',event)
    // Handle the event based on its type
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        // When payment capture is completed, store the transaction
        await storeTransaction(event.resource);
        break;

      case 'PAYMENT.CAPTURE.FAILED':
        // Store failed transaction details
        await storeTransaction(event.resource);
        break;

      case 'PAYMENT.CAPTURE.DENIED':
        // Store denied transaction details
        await storeTransaction(event.resource);
        break;

      case 'CHECKOUT.ORDER.APPROVED':
        // When the order is approved, you need to capture the payment
        await handleOrderApproved(event.resource);
        break;

      default:
        console.log(`Unhandled event type: ${event.event_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling PayPal webhook:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleOrderApproved = async (orderData: any) => {
  try {
    // When an order is approved, you need to capture the payment
    const orderId = orderData.id; // Order ID from the event
    const captureResponse = await capturePayment(orderId);
    if(captureResponse && Object.keys(captureResponse).length > 0){
      await storeTransaction(captureResponse);
    }
    // You can now store the captured payment transaction in the database
  } catch (error) {
    console.error('Error capturing payment:', error);
  }
};

const getOrderDetails =async(orderId: string, accessToken: string) =>{
  const response = await fetch(`https://api.sandbox.paypal.com/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return data;
}


const capturePayment = async (orderId: string) => {
  // Call the PayPal API to capture the payment using the order ID
  const { accessToken } = await getPaypalAccessToken();

  const orderDetails = await getOrderDetails(orderId, accessToken);

  // Check if the order is already captured
  if (orderDetails.status === 'COMPLETED') {
    console.log('Order already captured. Skipping capture.');
    return;
  }

  const captureResponse = await fetch(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!captureResponse.ok) {
    throw new Error(`Payment capture failed: ${captureResponse.status}`);
  }

  const captureData = await captureResponse.json();
  return captureData; // This will contain the payment capture details
};

const storeTransaction = async (paymentIntent: PayPalTransactionResource) => {
  try {
    await connectToDatabase(); // Ensure DB connection
    const transaction = new Transaction({
      // Generate a unique transaction ID
      paymentIntentId: paymentIntent.supplementary_data.related_ids.order_id,
      paymentProvider: 'paypal',
      amount: parseFloat(paymentIntent.amount.value),
      currency: paymentIntent.amount.currency_code,
      status: paymentIntent.status,
      created: paymentIntent.create_time,
      paypal: {
        capture_id: paymentIntent.id,
        capture_status: paymentIntent.status,
        fee: paymentIntent.seller_receivable_breakdown.paypal_fee.value,
      },
    });

    // Save the transaction to the database
    await transaction.save();
    if(transaction.transactionId){
      
    }
  } catch (error) {
    console.error('Error inserting transaction:', error);
  }
};
