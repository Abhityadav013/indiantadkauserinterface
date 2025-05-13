
import PaymentSuccessWrapper from "@/components/ClientComponents/PaymentSuccessWrapper";
import { Suspense } from "react";


export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<></>}>
            <PaymentSuccessWrapper />
        </Suspense>
    );
}