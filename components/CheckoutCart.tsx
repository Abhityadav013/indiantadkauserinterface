import React from "react";
import { Divider, CardContent, Typography, Box } from "@mui/material";
import Image from "next/image";
import { Cart } from "@/lib/types/cart_type";
import { MenuItem } from "@/lib/types/menu_type";
import BillInfo from "./ClientComponents/checkoutComponents/BillInfo";
import { CustomerOrder } from "@/lib/types/customer_order_type";
interface CheckoutCartProps {
    cart: Cart[],
    menu: MenuItem[];
    userData: CustomerOrder
}

const CheckoutCart: React.FC<CheckoutCartProps> = ({ cart, menu, userData }) => {
    console.log('cart:::::::',cart)
    const getItemPriceWithMenu = (item: Cart) => {
        const fetchMenuItem = menu.find((mi) => mi.id === item.itemId);
        const itemPrice = fetchMenuItem?.price ?? 0;
        return { totalPrice: itemPrice * item.quantity, menu };
    };

    return (
        <CardContent sx={{
            background: 'white',
            width: '100%',
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
                <div className="w-[50%] text-start">Item Name</div> {/* Mobile: 70%, Big Screen: 80% */}
                <div className="w-[20%] text-start">Qty</div>
                <div className="w-[20%] text-center">Price</div>
            </div>

            {/* Scrollable Items List */}
            <Box className="max-h-[20vh] px-4 mb-2 overflow-y-auto">
                {
                    cart.map((item) => {
                        const quantity = item.quantity ?? 0
                        const { totalPrice: itemTotal } = getItemPriceWithMenu(item)
                        // const cartDescription = cartDescriptions.find(di => di.itemId === item.id);
                        return (
                            <div
                                key={item.itemId}
                                className="flex justify-between gap-4 my-2 items-center"
                            >
                                <div className="w-[60%]">
                                    <Typography variant="body2" className="text-gray-700 text-sm">
                                        {item.itemName}
                                    </Typography>
                                </div>
                                <div className="w-[20%] flex items-center gap-2 justify-between">
                                    <Typography
                                        variant="body2"
                                        className="font-semibold text-green-600 text-sm"
                                    >
                                        {quantity}
                                    </Typography>
                                </div>
                                <div className="w-[20%] flex justify-end items-center">
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

            <Divider className="mb-4" />
            <BillInfo userData={userData} cart={cart} menu={menu} />
        </CardContent>

    );
};

export default CheckoutCart;
