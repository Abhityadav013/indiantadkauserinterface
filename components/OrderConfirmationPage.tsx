import { notFound } from "next/navigation";
import { OrderType } from "@/lib/types/order_type";
import NavBarNavigation from "@/components/NavBarNavigation";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
    Button,
} from "@mui/material";
import {
    LocalShipping,
    Store,
    Receipt,
    Home as HomeIcon,
} from "@mui/icons-material";
import { getOrderDetails } from "@/lib/api/fetchOrderDetailApi";
import { OrderSuccessSummary } from "@/lib/types/order_summary";


interface OrderConfirmationPageProps {
    orderId: string
}

export default async function OrderConfirmationPage({ orderId }: OrderConfirmationPageProps) {
    if (!orderId) return notFound();

    const order: OrderSuccessSummary = await getOrderDetails(orderId);

    if (!order) return notFound();

    const orderDate = new Date(order.createdAt ?? new Date()).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <Box
            component="section"
            sx={{
                overflow: "auto",
                backgroundColor: "#e9ecee",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 2,
            }}
        >
            <NavBarNavigation label="Order Detail" redirect_url={'/menu-list'} isImage={false} />
            <Card sx={{ maxWidth: 600, width: "100%", m: 2, mt: 10 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Order Confirmation
                    </Typography>

                    <Box display="flex" justifyContent="center" mb={2}>
                        <Chip
                            icon={order?.orderType === OrderType.DELIVERY ? <LocalShipping /> : <Store />}
                            label={order?.orderType}
                            color="primary"
                        />
                    </Box>

                    <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
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
                                    <Typography variant="body1">€{item.price.toFixed(2)}</Typography>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography>Cart Subtotal:</Typography>
                            <Typography>€{order?.orderAmount?.orderTotal.toFixed(2)}</Typography>
                        </Box>

                        {order?.orderAmount?.deliveryFee !== undefined && (
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography>Delivery Fee:</Typography>
                                <Typography>€{order?.orderAmount?.deliveryFee.toFixed(2)}</Typography>
                            </Box>
                        )}

                        {(order?.orderAmount?.tipAmount ?? 0) > 0 && (
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography>Tip:</Typography>
                                <Typography>€{(order?.orderAmount?.tipAmount ?? 0).toFixed(2)}</Typography>
                            </Box>
                        )}

                        <Divider sx={{ my: 1 }} />

                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="h6">Total:</Typography>
                            <Typography variant="h6">
                                €
                                {(
                                    (order?.orderAmount?.orderTotal ?? 0) +
                                    (order?.orderAmount?.deliveryFee ?? 0) +
                                    (order?.orderAmount?.tipAmount ?? 0)
                                ).toFixed(2)}
                            </Typography>
                        </Box>
                    </Paper>

                    {/* {order?.orderType === OrderType.DELIVERY && order?.deliveryAddress?.displayAddress && (
            <>
              <Typography variant="h6" gutterBottom>
                <HomeIcon className="text-gray-700" fontSize="medium" />
                <CheckCircleIcon className="absolute -top-2 -left-2 text-green-500 bg-white rounded-full" fontSize="small" />
                Delivery Address
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography>{order.deliveryAddress.displayAddress}</Typography>
              </Paper>
            </>
          )} */}

                    <Box display="flex" justifyContent="center" gap={2} mt={3}>
                        <Button variant="contained" startIcon={<Receipt />} >
                            Print Receipt
                        </Button>
                        <Button variant="outlined" color="primary" startIcon={<HomeIcon />} href="/">
                            Back to Home
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
