import { useState } from 'react';
import {
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
    const [errorMessage, setErrorMessage] = useState<string>();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        const { error: submitError } = await elements.submit();
        if (submitError) {
            // setErrorMessage(submitError.message);
            setIsSubmitting(false);
            return;
        }

        const response = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `http://localhost:3000/de/`,
            },
        });
        if (response.error) {
            setErrorMessage(response.error.message);
        } else {
            // Payment successful logic here (e.g., redirect to success page)
        }

    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="border p-4 rounded-md bg-white">
                <PaymentElement />
            </div>
            {errorMessage && (
                <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}
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