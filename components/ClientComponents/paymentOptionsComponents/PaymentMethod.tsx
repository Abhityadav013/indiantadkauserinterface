'use client'
import { useEffect, useState } from "react";
// import GPayButton from "./GooglePayButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import type { PaymentMethod } from "@/lib/types/payment_method_type";
import { Button, CircularProgress } from "@mui/material";
import PaypalComponent from "../PaypalComponent";
import { convertToSubcurrency } from "@/utils/convertToSubCurrency";
import StripeComponent from "../StripeComponent";
import GooglePayButton from "./GooglePayButton";
import { useSearchParams } from "next/navigation";
interface PaymentMethodProps {
    cartTotal: number
}

export default function PaymentMethod({ cartTotal }: PaymentMethodProps) {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const { payment_type } = useSelector((state: RootState) => state.payment);
    const searchParams = useSearchParams(); // URLSearchParams
    const basketParam = searchParams.get('basket') || '';
    const orderPrice = convertToSubcurrency(cartTotal)

    useEffect(() => {
        if (payment_type) {
            setSelectedMethod(payment_type)
            setLoading(false);
        }

    }, [payment_type]);

    if (loading) return null;

    const handleCashPayment = async () => {
        setSubmitting(true);
        const payRes = await fetch("/api/v1/create-cash-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ basketId: basketParam }),
        });

        const payData = await payRes.json();
        if (payData.orderId) {
            localStorage.setItem(`paid_basket_${basketParam}`, 'true');
            setSubmitting(false)
            window.location.href = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}/checkout${basketParam ? '?basket=' + basketParam : ''}&orderId=${payData.orderId}`;
        }
    }

    return (
        <>
            {/* Your existing selector */}
            {/* Render payment method UI based on selected method */}
            {selectedMethod === "google" && <GooglePayButton amount={orderPrice} />}
            {selectedMethod === "paypal" && <PaypalComponent amount={orderPrice} />}
            {selectedMethod === "credit" && <StripeComponent amount={orderPrice} />}
            {/* {selectedMethod?.id === "credit" && <StripeCardForm />} */}
            {selectedMethod === "cash" && (
                <Button
                    variant="contained"
                    onClick={handleCashPayment}
                    sx={{
                        width: '100%',
                        backgroundColor: '#f36805',
                        color: 'white',
                        padding: '6px 12px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        borderRadius: '50px',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#f36805',
                        },
                    }}
                >
                    {submitting ? <CircularProgress size={24} /> : 'Place Order'}
                </Button>
            )}
        </>
    );
}
