/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { MenuItem } from '@/lib/types/menu_type';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import EmptyCart from '../EmptyCart';
import CartHistory from './CartHistory';
import BillDetails from '../BillDetails';
import { useCart } from '@/hooks/useCartDetails';
import { Cart } from '@/lib/types/cart_type';
import Image from 'next/image';
import { CustomerDetails } from '@/lib/types/customer_order_type';

interface BaseketSideBarContentProps {
    cartItems: Cart[]
    menu: MenuItem[];
    loading: boolean;
    customerDetails: CustomerDetails;
    handleAdddressDetailOpen: () => void;
}

const BaseketSideBarContent = ({ menu, cartItems, loading, customerDetails, handleAdddressDetailOpen }: BaseketSideBarContentProps) => {
    const { isLoading, items, basketId, addToCart, removeFromCart, menuItems, getItemQuantity, updateMenuItems, getItemPriceWithMenu, getCartTotal } = useCart()
    const [isCartUpdated, setCartUpdated] = useState(false);
    const [isCustomizeModal, setCustomizeModal] = useState(false);
    const [liveMessage, setLiveMessage] = useState('');

    useEffect(() => {
        if (!menuItems.length) {
            updateMenuItems(menu)
        }
    }, [menuItems, menu, updateMenuItems])

    const handleAddToCart = async (item: MenuItem) => {
        setCartUpdated(true);
        setLiveMessage(`${item.name} added to cart`);
        try {
            await addToCart(item);
            toast.success(`${item.name} added to cart`, {
                id: item.id,
                duration: 2000,
                style: {
                    padding: '16px 24px',
                    height: '60px',
                    fontSize: '16px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    borderRadius: '10px',
                    marginTop: '20px',
                },
                iconTheme: {
                    primary: '#fff',
                    secondary: '#28a745',
                },
            });
        } catch (err) {
            toast.error(`Failed to add ${item.name}`, {
                id: `add-error-${item.id}`,
                duration: 2500,
                style: {
                    padding: '16px 24px',
                    height: '60px',
                    fontSize: '16px',
                    backgroundColor: '#e53e3e',
                    color: '#fff',
                    borderRadius: '10px',
                    marginTop: '20px',
                },
            });
        } finally {
            const timer = setTimeout(() => setCartUpdated(false), 1000);
            return () => clearTimeout(timer);
        }
    };

    const handleRemoveFromCart = async (item: MenuItem) => {
        setCartUpdated(true);
        setLiveMessage(`${item.name} removed from cart`);
        try {
            await removeFromCart(item);
            toast(`${item.name} removed from cart`, {
                id: `remove-${item.id}`,
                duration: 2000,
                style: {
                    padding: '16px 24px',
                    height: '60px',
                    fontSize: '16px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    borderRadius: '10px',
                    marginTop: '50px',
                },
                iconTheme: {
                    primary: '#fff',
                    secondary: '#dc3545',
                },
            });
        } catch (err) {
            toast.error(`Failed to remove ${item.name}`, {
                id: `remove-error-${item.id}`,
                duration: 2500,
                style: {
                    padding: '16px 24px',
                    height: '60px',
                    fontSize: '16px',
                    backgroundColor: '#e53e3e',
                    color: '#fff',
                    borderRadius: '10px',
                    marginTop: '50px',
                },
            });
        } finally {
            const timer = setTimeout(() => setCartUpdated(false), 1000);
            return () => clearTimeout(timer);
        }
    };

    if (loading || isLoading) {
        return (
            <Image
                src='https://testing.indiantadka.eu/assets/foodCartLoader.gif'
                alt="Loading..."
                width={400}
                height={400}
            />
        );
    }
    if (items.length === 0) {
        return <EmptyCart />;
    }
    return (
        <>
            <div aria-live="polite" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>{liveMessage}</div>
            <CartHistory
                isCartUpdated={isCartUpdated}
                isCustomizeModal={isCustomizeModal}
                items={items}
                handleAddToCart={handleAddToCart}
                handleRemoveFromCart={handleRemoveFromCart}
                getItemQuantity={getItemQuantity}
                getItemPriceWithMenu={getItemPriceWithMenu}
                setCustomizeModal={setCustomizeModal}
            />
            <div aria-live="polite">
                <BillDetails
                    basketId={basketId}
                    getCartTotal={getCartTotal}
                    customerDetails={customerDetails ?? {} as CustomerDetails}
                    handleAdddressDetailOpen={handleAdddressDetailOpen}
                />
            </div>
        </>
    )
}

export default BaseketSideBarContent
