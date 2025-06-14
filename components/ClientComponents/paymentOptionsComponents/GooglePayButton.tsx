/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface GPayButtonProps {
    amount: number;
}

export default function GooglePayButton({ amount }: GPayButtonProps) {
    const router = useRouter()
    const searchParams = useSearchParams(); // URLSearchParams
    const basketParam = searchParams.get('basket') || '';
    const [loading, setLoading] = useState(false); // 👈 New loading state
    const [error, setError] = useState<string | null>(null);
    const btnRef = useRef<HTMLDivElement>(null);
    const paymentsClientRef = useRef<google.payments.api.PaymentsClient | null>(null);

    const handleGooglePayClick = useCallback(async () => {
        try {
            setLoading(true)
            // STEP 1: Create PaymentIntent
            const intentRes = await fetch("/api/v1/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, currency: "eur" }),
            });
            const intentData = await intentRes.json();

            if (!intentRes.ok || !intentData.clientSecret) {
                throw new Error(intentData?.error || "Failed to create payment intent.");
            }

            const clientSecret = intentData.clientSecret;

            // STEP 2: Create Google Pay payment request
            const paymentRequest: google.payments.api.PaymentDataRequest = {
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: [
                    {
                        type: "CARD",
                        parameters: {
                            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                            allowedCardNetworks: ["VISA", "MASTERCARD"],
                        },
                        tokenizationSpecification: {
                            type: "PAYMENT_GATEWAY",
                            parameters: {
                                gateway: "stripe",
                                "stripe:version": "2020-08-27",
                                "stripe:publishableKey": process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!, // Replace with your real key
                            },
                        },
                    },
                ],
                transactionInfo: {
                    totalPriceStatus: "FINAL",
                    totalPrice: (amount / 100).toFixed(2),
                    currencyCode: "EUR",
                },
                merchantInfo: {
                    merchantId: "BCR2DN7TZDVJFLDA",
                    merchantName: "Indian Tadka",
                },
            };

            const paymentData = await paymentsClientRef.current?.loadPaymentData(paymentRequest);

            // STEP 3: Extract token and confirm payment with your backend
            const tokenData = paymentData?.paymentMethodData.tokenizationData.token;
            const token = typeof tokenData === "string" ? JSON.parse(tokenData) : tokenData;

            const payRes = await fetch("/api/v1/pay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, clientSecret, basketId: basketParam }),
            });

            const payData = await payRes.json();
            if (payData.orderId) {
                router.push(`/checkout${basketParam ? '?basket=' + basketParam : ''}&orderId=${payData.orderId}`)
                return;
            } else {
                console.error("❌ Stripe payment failed", payData.error);
                alert("Payment failed.");
            }
        } catch (err: any) {
            console.error("❌ Google Pay error", err.message || err);
            alert("Something went wrong.");
            setError("Payment failed to initialize.");
        }
        finally {
            setLoading(false); // 👈 Stop loader
        }
    }, [amount, basketParam,router]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://pay.google.com/gp/p/js/pay.js";
        script.async = true;

        script.onload = () => {
            if (!window.google) return;

            paymentsClientRef.current = new window.google.payments.api.PaymentsClient({
                environment: "TEST",
            });

            const button = paymentsClientRef.current.createButton({
                buttonColor: "default",
                buttonType: "pay",
                onClick: handleGooglePayClick,
            });

            if (btnRef.current) {
                btnRef.current.innerHTML = "";
                btnRef.current.appendChild(button);
            }
        };

        document.head.appendChild(script);



        return () => {
            document.head.removeChild(script);
        };
    }, [handleGooglePayClick]);

   return (
  <div className="relative inline-block" style={{ width: 'fit-content' }}>
    {/* Google Pay Button is rendered here */}
    <div ref={btnRef} />

    {/* Loader inside the Google Pay Button */}
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-md pointer-events-none">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white" />
      </div>
    )}

    {error && <div className="text-sm text-red-600 mt-2" ref={btnRef}>{error}</div>}
  </div>
);

}
