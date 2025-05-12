'use client'
import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
} from '@stripe/react-stripe-js';
import StripeCheckout from './StripeCheckout';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined')
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

interface StripeComponentProps {
  amount: number,
  onLoad: () => void
}
const StripeComponent: React.FC<StripeComponentProps> = ({ amount, onLoad }) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: 'payment',
        amount: amount,
        currency: 'eur',
        locale: 'en',
      }}
    >
      <StripeCheckout amount={amount} onClientSecretLoad={onLoad} />
    </Elements>
  )
}

export default StripeComponent
