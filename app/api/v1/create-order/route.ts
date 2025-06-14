/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const PAYPAL_SECRET = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET!;

export async function POST(request: NextRequest) {
  try {  
    // Get amount and order from the request body
    const { amount } = await request.json();

    // Construct the base request body for PayPal
    const requestBody: any = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            value: (amount / 100).toFixed(2), // PayPal uses dollars, so divide by 100 if you pass in cents
            currency_code: 'USD',
          },
        },
      ],
      application_context: {
        return_url: `http://localhost:3000/payment-success`,
        cancel_url: `http://localhost:3000/payment-cancel`,
      },
    };

    // Make the PayPal API request
    const response = await fetch(
      process.env.NEXT_PUBLIC_PAYPAL_BASE_URL + '/v2/checkout/orders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(
            `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
          ).toString('base64')}`,
        },
        body: JSON.stringify(requestBody),
      }
    );
    console.log('response::::::',response)

    // Parse the response from PayPal
    const data = await response.json();
    if (response.ok) {
      return NextResponse.json({ id: data.id });
    } else {
      throw new Error(data.message || 'Failed to create PayPal order');
    }
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
