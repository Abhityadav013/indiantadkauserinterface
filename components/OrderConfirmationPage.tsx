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
    Home as HomeIcon,
} from "@mui/icons-material";
import { getOrderDetails } from "@/lib/api/fetchOrderDetailApi";
import { OrderSuccessSummary } from "@/lib/types/order_summary";
import { formatPrice } from "@/utils/valueInEuros";
import { format } from "date-fns";
import SaveOrderRecipet from "./ClientComponents/SaveOrderRecipet";

interface OrderConfirmationPageProps {
    orderId: string
}

export default async function OrderConfirmationPage({ orderId }: OrderConfirmationPageProps) {
    if (!orderId) return notFound();

    const order: OrderSuccessSummary = await getOrderDetails(orderId);
    if (!order) return notFound();

    const renderPriceOrLoader = (value: string | number) => {
        if (Number(value) === 0) {
            return <span>Free</span>
        } else {
            return <span>{formatPrice(Number(value))}</span>
        }
    }

    const renderServiceFee = (value: string | number) => {
        const serviceFee = (Number(value) * 2.5) / 100;
        return <span>{formatPrice(serviceFee < 0.99 ? Number(serviceFee.toFixed(2)) : 0.99)}</span>;
    };

    const calculateTotal = () => {
        if (order?.orderType === OrderType.DELIVERY) {
            const serviceFee = order?.orderAmount?.orderTotal ? (Number(order?.orderAmount?.orderTotal) * 2.5) / 100 : 0;
            const cappedServiceFee = serviceFee < 0.99 ? serviceFee : 0.99;
            return formatPrice((Number(order?.orderAmount?.orderTotal) ?? 0) + Number(order?.orderAmount?.deliveryFee) + cappedServiceFee);
        }
        return formatPrice(Number(order?.orderAmount?.orderTotal) ?? 0);
    };
    return (
        <Box
            component="section"
            sx={{
                overflow: "auto",
                backgroundColor: "#e9ecee",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 2,
                minHeight: '100vh',
                maxHeight: '500vh'
            }}
        >
            <NavBarNavigation label="Order Detail" redirect_url={'/'} isImage={false} />
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
                        Order #{order?.displayId} • {format(new Date(order.createdAt), 'MMMM d, yyyy')} at {format(new Date(order.createdAt), 'h:mm a')}
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
                                    <Typography variant="body1">{formatPrice(Number(item.price))}</Typography>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography>Cart Subtotal:</Typography>
                            <Box>
                                {order?.orderAmount?.discount?.amount ? (
                                    <>
                                        <Typography
                                            component="span"
                                            sx={{ textDecoration: 'line-through', color: 'gray', mr: 1 }}
                                        >
                                            {formatPrice(
                                                Number(order?.orderAmount?.orderTotal) +
                                                Number(order?.orderAmount?.discount?.amount)
                                            )}
                                        </Typography>
                                        <Typography component="span" fontWeight="bold">
                                            {formatPrice(Number(order?.orderAmount?.orderTotal))}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography fontWeight="bold">
                                        {formatPrice(Number(order?.orderAmount?.orderTotal))}
                                    </Typography>
                                )}
                            </Box>
                        </Box>


                        {order?.orderAmount?.discount && Object.keys(order?.orderAmount?.discount).length && (
                            <Box sx={{ my: 2, p: 2, border: '1px dashed #38a169', borderRadius: 2, backgroundColor: '#f0fff4' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2f855a' }}>
                                    🎉 You saved {formatPrice(Number(order?.orderAmount?.discount.amount))}!
                                </Typography>

                                <Box display="flex" alignItems="center" mt={1}>
                                    <Typography variant="body2" sx={{ color: '#2f855a', mr: 1 }}>
                                        Coupon Applied:
                                    </Typography>
                                    <Chip
                                        label={order?.orderAmount?.discount.code}
                                        size="small"
                                        color="success"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Box>
                            </Box>
                        )}

                        {order?.orderAmount?.deliveryFee !== undefined && (
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography>Delivery Fee:</Typography>
                                <Typography>{renderPriceOrLoader(order?.orderAmount?.deliveryFee)}</Typography>
                            </Box>
                        )}

                        {(order?.orderAmount?.tipAmount ?? 0) > 0 && (
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography>Tip:</Typography>
                                <Typography>{formatPrice(Number(order?.orderAmount?.tipAmount ?? 0))}</Typography>
                            </Box>
                        )}

                        <Box display="flex" justifyContent="space-between">
                            <Typography> Service fee 2.5% (max 0.99 €)</Typography>
                            <Typography>

                                {renderServiceFee(Number(order?.orderAmount?.orderTotal)?.toFixed(2) || '0.00')}
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />

                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="h6">Total:</Typography>
                            <Typography variant="h6">
                                {calculateTotal()}
                            </Typography>
                        </Box>

                    </Paper>

                    {order?.orderType === OrderType.DELIVERY && order.deliveryAddress && (
                        <>
                            <Box position="relative" display="flex" alignItems="center" mb={1}>
                                <HomeIcon className="text-gray-700 mr-1" fontSize="medium" />
                                <Typography variant="h6" component="h2">
                                    Delivery Address
                                </Typography>
                            </Box>

                            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                                <Typography component="address" sx={{ fontStyle: 'normal' }}>
                                    {order.deliveryAddress}
                                </Typography>
                            </Paper>
                        </>
                    )}


                    <Box display="flex" justifyContent="center" gap={2} mt={3}>
                        <SaveOrderRecipet  />
                        <Button variant="outlined" color="primary" startIcon={<HomeIcon />} href="/">
                            Back to Home
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
