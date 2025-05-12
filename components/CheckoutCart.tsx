import React from "react";
import { Divider, CardContent, Typography, Box } from "@mui/material";
import Image from "next/image";
import { Cart } from "@/lib/types/cart_type";
import { MenuItem } from "@/lib/types/menu_type";

interface CheckoutCartProps {
    cart: Cart[],
    menu: MenuItem[]
}

const CheckoutCart: React.FC<CheckoutCartProps> = ({ cart, menu }) => {

    const getItemPriceWithMenu = (item: Cart) => {
        const fetchMenuItem = menu.find((mi) => mi.id === item.itemId);
        const itemPrice = fetchMenuItem?.price ?? 0;
        return { totalPrice: itemPrice * item.quantity, menu };
    };

    return (
        <CardContent sx={{
            padding: 6,
            background: 'white',
            width: { xs: '100%', sm: '100%', lg: '80%' },
            mt: { xs: 8, sm: 8, md: 6 },
        }}>
            {/* Header */}
            <div className="flex items-center gap-4 mb-2">
                <Image
                    src="https://testing.indiantadka.eu/assets/food.webp"
                    alt="Food"
                    width={50}
                    height={50}
                    className="rounded"
                />
                <Typography variant="h6" className="font-bold text-gray-800">
                    Your Order
                </Typography>
            </div>

            <Divider className="my-2" />

            {/* Table Header */}
            <div className="flex justify-between mb-2 text-sm font-semibold text-gray-600">
                <div className="w-[70%] sm:w-[80%]">Item Name</div> {/* Mobile: 70%, Big Screen: 80% */}
                <div className="w-[10%]">Qty</div>
                <div className="w-[10%] text-right">Price</div>
            </div>

            {/* Scrollable Items List */}
            <Box className="max-h-[20vh] overflow-y-auto scrollbar-hide">
                {
                    cart.map((item) => {
                        const quantity = item.quantity ?? 0
                        const { totalPrice: itemTotal } = getItemPriceWithMenu(item)
                        // const cartDescription = cartDescriptions.find(di => di.itemId === item.id);
                        return (
                            <div
                                key={item.itemId}
                                className="flex justify-between gap-4 my-4 items-center"
                            >
                                <div className="w-[80%]">
                                    <Typography variant="body2" className="text-gray-700 text-sm">
                                        {item.itemName}
                                    </Typography>
                                </div>
                                <div className="w-[8%] flex items-center gap-2 justify-between">
                                    <Typography
                                        variant="body2"
                                        className="font-semibold text-green-600 text-sm"
                                    >
                                        {quantity}
                                    </Typography>
                                </div>
                                <div className="w-[10%] flex justify-end items-center">
                                    <Typography
                                        variant="body2"
                                        className="font-semibold text-gray-800 text-sm"
                                    >
                                        €{itemTotal.toFixed(2)}
                                    </Typography>
                                </div>
                            </div>
                        );
                    })
                }
            </Box>
        </CardContent>

    );
};

export default CheckoutCart;
