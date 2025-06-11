import { useState } from 'react';
import {

    CardElement,
    useStripe,
    useElements,
    PaymentElement
} from '@stripe/react-stripe-js';
import { Button, } from '@mui/material';
import { formatPrice } from '@/utils/valueInEuros';

interface StripeCheckoutProps {
    amount: number,
    clientSecret: string
}

const StripeCheckout = ({ amount, clientSecret }: StripeCheckoutProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsSubmitting(true);

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)!,
            },
        });

        setIsSubmitting(false);

        if (result.error) {
            alert(result.error.message);
        } else if (result.paymentIntent?.status === 'succeeded') {
            alert("Payment successful! 🎉");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="border p-4 rounded-md bg-white">
                <PaymentElement />
            </div>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || !stripe || !elements}
                fullWidth
                sx={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    textTransform: 'none',
                    backgroundColor: '#f36805',
                    '&:hover': { backgroundColor: '#f36805' },
                }}
            >
                Pay {formatPrice(amount / 100)}
            </Button>
        </form>
    );
};
export default StripeCheckout