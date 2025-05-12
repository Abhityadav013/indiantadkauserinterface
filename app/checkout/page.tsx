import React from 'react';
import NavBarNavigation from '@/components/NavBarNavigation';
import CheckoutCart from '@/components/CheckoutCart';
import { Box } from '@mui/material';
import { getMenuData } from '../menu/page';
import PaymentCheckoutBill from '@/components/PaymentCheckoutBill';
import { OrderType } from '@/lib/types/order_type';
import PaymentWrapper from '@/components/ClientComponents/PaymentWrapper';
import { fetchFromApi } from '@/lib/fetchAPICalls';
import { Cart } from '@/lib/types/cart_type';
import { MenuItem } from '@/lib/types/menu_type';

type UserAddress = {
    displayAddress: string;
    buildingNumber: string;
    street: string;
    town: string;
    pincode: string;
    addressType: string;
};

type CustomerDetails = {
    name: string;
    phoneNumber: string;
    address?: UserAddress;
    isFreeDelivery?: boolean;
    deliveryFee?: string;
    notDeliverable?: boolean;
};

type CustomerOrder = {
    customerDetails: CustomerDetails;
    orderType: OrderType;
};

type OrderCart = {
    cart: {
        id: string;
        deviceId: string;
        userId?: string;
        cartItems: Cart[];
    }
};


// Now, we define an `async` function inside the component to fetch data.
export default async function CheckoutPage() {
    try {
        // Fetch all the necessary data
        const [cartDataRow, customerDataRow, menuData] = await Promise.all([
            fetchFromApi<OrderCart>('/cart'),
            fetchFromApi<CustomerOrder>('/user-details'),
            getMenuData(),
        ]);

        
        const cartdata: Cart[] = cartDataRow.cart.cartItems ?? [];
        const customerOrderInfo: CustomerOrder = customerDataRow;
        const menuItems: MenuItem[] = menuData.menuItems;

        // The logic to calculate the cart total
        const getCartTotal = (cartdata: Cart[], menuItems: MenuItem[]) => {
            return cartdata.length && cartdata.reduce((total: number, cartItem: Cart): number => {
                const foodItemMatch = menuItems.find((item: { id: string; price: number }) => item.id === cartItem.itemId);
                return foodItemMatch ? total + foodItemMatch.price * cartItem.quantity : total;
            }, 0);
        };

        const cartTotal = getCartTotal(cartdata, menuItems);
        return (
            <Box
                component="section"
                sx={{
                    overflow: 'auto',
                    backgroundColor: '#e9ecee',
                    padding: 2,
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 2,
                }}
            >
                <NavBarNavigation label="Checkout" isImage={false} />
                <CheckoutCart cart={cartdata} menu={menuItems} />
                <PaymentCheckoutBill
                    cartTotal={cartTotal}
                    isDeliveryOrder={customerOrderInfo.orderType === OrderType.DELIVERY}
                    deliveryFee={customerOrderInfo.customerDetails?.deliveryFee ?? ''}
                    deliveryTip="10"
                    isFreeDelivery={customerOrderInfo.customerDetails?.isFreeDelivery ?? false}
                />
                <PaymentWrapper cartData={cartdata} />
            </Box>
        );
    } catch (error) {
        console.error("Error fetching data:", error);
        return <div>Error loading data...{error instanceof Error ? error.message : String(error)}</div>; // Handle the error gracefully
    }
}
