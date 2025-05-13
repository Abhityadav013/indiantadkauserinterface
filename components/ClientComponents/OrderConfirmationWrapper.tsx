"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
    Paper,
    Chip,
    Button,
} from "@mui/material"
import { LocalShipping, Store, Receipt } from "@mui/icons-material"
import HomeIcon from "@mui/icons-material/Home";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { OrderType } from "@/lib/types/order_type"
import { OrderSuccessSummary } from "@/lib/types/order_summary"
import { useAddressDetails } from "@/hooks/useAddressDetails"
import { useGetOrderByIdQuery } from "@/store/api/orderApi"
import NavBarNavigation from "@/components/NavBarNavigation"

// Mock data for demonstration
// const mockOrders: Record<string, Order> = {
//     "ORD-12345": {
//         id: "ORD-12345",
//         items: [
//             { id: "item1", name: "Margherita Pizza", quantity: 2, price: 12.99 },
//             { id: "item2", name: "Garlic Bread", quantity: 1, price: 4.5 },
//             { id: "item3", name: "Coca Cola (2L)", quantity: 1, price: 3.99 },
//         ],
//         cartTotal: 34.47, // Sum of all items
//         deliveryFee: 3.99, // Delivery fee
//         tip: 5.0, // Tip amount
//         totalAmount: 43.46, // Final total with fees and tip
//         orderType: "Delivery",
//         deliveryAddress: "123 Main Street, Apt 4B, New York, NY 10001",
//         createdAt: "2025-05-13T14:30:00Z",
//     },
//     "ORD-67890": {
//         id: "ORD-67890",
//         items: [
//             { id: "item4", name: "Chicken Wings", quantity: 2, price: 9.99 },
//             { id: "item5", name: "French Fries", quantity: 1, price: 3.5 },
//             { id: "item6", name: "Sprite (500ml)", quantity: 2, price: 1.99 },
//         ],
//         cartTotal: 27.46, // Sum of all items
//         totalAmount: 27.46, // Same as cartTotal for pickup orders
//         orderType: "Pickup",
//         createdAt: "2025-05-13T15:45:00Z",
//     },
// }

export default function OrderConfirmationWrapper() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId")// Default to first mock order if no ID provided
    const [order, setOrder] = useState<OrderSuccessSummary | null>(null)
    const { data: orderSummary, isLoading } = useGetOrderByIdQuery(orderId || '');
    const router = useRouter()
    const { customerDetails } = useAddressDetails()

    useEffect(() => {
        if (!isLoading) {
            setOrder(orderSummary ?? {} as OrderSuccessSummary)
        }
    }, [isLoading, orderSummary])

    useEffect(() => {
        const handlePopState = () => {
            router.replace("/");
        };

        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [router]);
    const handlePrintReceipt = () => {
        window.print()
    }

    if (isLoading && !order) {
        return (
            <Box display="flex" justifyContent="center" bgcolor={"#f4f6f8"} alignItems="center" minHeight="100vh" flexDirection="column" gap={2}>
                <CircularProgress />
                <Typography variant="h6">Loading order details...</Typography>
            </Box>
        )
    }

    // Format date
    const orderDate = new Date(order?.createdAt ?? new Date()).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })

    return (
        <Box
            component="section"
            sx={{
                overflow: 'auto',
                backgroundColor: '#e9ecee',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 2,
            }}
        >
            <NavBarNavigation label="Order Detail" isImage={false} />
            <Card sx={{ maxWidth: 600, width: "100%", m: 2 ,mt:10 }}>
                <CardContent>
                    <Typography variant="h4" component="div" gutterBottom align="center">
                        Order Confirmation
                    </Typography>

                    <Box display="flex" justifyContent="center" mb={2}>
                        <Chip
                            icon={order?.orderType === OrderType.DELIVERY ? <LocalShipping /> : <Store />}
                            label={order?.orderType}
                            color="primary"
                        />
                    </Box>

                    <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                        Order #{order?.displayId} • {orderDate}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>
                        Order Summary
                    </Typography>

                    <Paper variant="outlined" sx={{ mb: 2 }}>
                        <List>
                            {order?.orderItems?.map((item) => (
                                <ListItem key={item.id} divider>
                                    <ListItemText primary={item.name} secondary={`Quantity: ${item.quantity}`} />
                                    <Typography variant="body1">€{(item?.price)?.toFixed(2)}</Typography>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>

                    {/* Order totals section */}
                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body1">Cart Subtotal:</Typography>
                            <Typography variant="body1">€{order?.orderAmount?.orderTotal.toFixed(2)}</Typography>
                        </Box>

                        {order?.orderAmount?.deliveryFee !== undefined && (
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body1">Delivery Fee:</Typography>
                                <Typography variant="body1">€{order?.orderAmount?.deliveryFee.toFixed(2)}</Typography>
                            </Box>
                        )}

                        {order?.orderAmount?.tipAmount !== undefined && order?.orderAmount?.tipAmount > 0 && (
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body1">Tip:</Typography>
                                <Typography variant="body1">€{order?.orderAmount?.tipAmount.toFixed(2)}</Typography>
                            </Box>
                        )}

                        <Divider sx={{ my: 1 }} />

                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="h6">Total:</Typography>
                            <Typography variant="h6">
                                €{(
                                    (order?.orderAmount?.deliveryFee ?? 0) +
                                    (order?.orderAmount?.tipAmount ?? 0) +
                                    (order?.orderAmount?.orderTotal ?? 0)
                                ).toFixed(2)}
                            </Typography>
                        </Box>
                    </Paper>

                    {order?.orderType === OrderType.DELIVERY && customerDetails?.address?.displayAddress && (
                        <>

                            <Typography variant="h6" gutterBottom>
                                <HomeIcon className="text-gray-700" fontSize="medium" />
                                <CheckCircleIcon className="absolute -top-2 -left-2 text-green-500 bg-white rounded-full" fontSize="small" />
                                Delivery Address
                            </Typography>
                            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                                <Typography variant="body1">{customerDetails?.address?.displayAddress}</Typography>
                            </Paper>
                        </>
                    )}

                    <Box display="flex" justifyContent="center" gap={2} mt={3}>
                        <Button variant="contained" startIcon={<Receipt />} onClick={handlePrintReceipt}>
                            Print Receipt
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<HomeIcon />}
                            onClick={() => router.push("/")}
                        >
                            Back to Home
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}
