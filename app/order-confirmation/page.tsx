
import OrderConfirmationWrapper from "@/components/ClientComponents/OrderConfirmationWrapper";
import { Suspense } from "react";


export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<></>}>
            <OrderConfirmationWrapper />
        </Suspense>
    );
}