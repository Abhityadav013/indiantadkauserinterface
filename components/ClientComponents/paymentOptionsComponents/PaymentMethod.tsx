'use client'
import { useEffect, useState } from "react";
import GPayButton from "./GooglePayButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import type { PaymentMethod } from "@/lib/types/payment_method_type";
import { Button } from "@mui/material";
import PaypalComponent from "../PaypalComponent";
import { convertToSubcurrency } from "@/utils/convertToSubCurrency";
import StripeComponent from "../StripeComponent";
interface PaymentMethodProps {
    cartTotal: number
}

export default function PaymentMethod({ cartTotal }: PaymentMethodProps) {

    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [loading, setLoading] = useState(true);
    const { payment_type } = useSelector((state: RootState) => state.payment);

      const orderPrice = convertToSubcurrency(cartTotal)

    useEffect(() => {
        if (payment_type) {
            setSelectedMethod(payment_type)
            setLoading(false);
        }

    }, [payment_type]);

    if (loading) return null;

    return (
        <>
            {/* Your existing selector */}
            {/* Render payment method UI based on selected method */}
            {selectedMethod === "google" && <GPayButton amount={orderPrice} />}
            {selectedMethod === "paypal" && <PaypalComponent amount={orderPrice} />}
            {selectedMethod === "credit" && <StripeComponent amount={orderPrice}/>}
            {/* {selectedMethod?.id === "credit" && <StripeCardForm />} */}
            {selectedMethod === "cash" && (
                <Button
                    variant="contained"
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
                    Continue and Place Order
                </Button>
            )}
        </>
    );
}
