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
    const [hydrated, setHydrated] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [isCustomizeModal, setCustomizeModal] = useState(false);
    const { isLoading, items, basketId, addToCart, removeFromCart, menuItems, getItemQuantity, updateMenuItems, getItemPriceWithMenu, getCartTotal } = useCart()
    const [isCartUpdated, setCartUpdated] = useState(false);
    const [cartItem, setCartItems] = useState<Cart[]>(cartItems);

    useEffect(() => {
        setHydrated(true);
    }, []);


    useEffect(() => {
        // We define the timer variable here, so it's in scope for cleanup
        let timer: NodeJS.Timeout;
        if (!isLoading && !loading) {
            if (items && Array.isArray(items)) {
                setCartItems((prev) => {
                    // Only update if cartItems length is different
                    if (prev.length !== items.length) {
                        return items; // Update cartItems if lengths are different
                    }
                    return prev; // Otherwise, keep previous state
                });
            }
            timer = setTimeout(() => setShowLoader(false), 1000); // Delay 1 second
        } else {
            timer = setTimeout(() => setShowLoader(false), 200); // Delay 1 second
            // setShowLoader(true); // Show loader if isLoading is true
        }

        // Cleanup: clear timer if the component unmounts or the effect reruns
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isLoading, loading, items]); // Only depend on isLoading and items, not cartItems
    useEffect(() => {
        if (!menuItems.length) {
            updateMenuItems(menu)
        }
    }, [menuItems, menu, updateMenuItems])

    const handleAddToCart = async (item: MenuItem) => {
        setCartUpdated(true);
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


    if (!hydrated) {
        // Before hydration (first render), rely on props
        if (cartItems.length === 0) {
            return <EmptyCart />;
        }
    } else {
        // After hydration, rely on client-side state
        if (cartItem.length === 0) {
            return <EmptyCart />;
        }
    }
    if (showLoader) {
        return (
            <Image
                src='https://testing.indiantadka.eu/assets/foodCartLoader.gif'
                alt="Loading..."
                width={400}
                height={400} // Assuming the image is square
            />
        );
    }

    return (
        <>
            <CartHistory
                isCartUpdated={isCartUpdated}
                isCustomizeModal={isCustomizeModal}
                items={cartItem}
                handleAddToCart={handleAddToCart}
                handleRemoveFromCart={handleRemoveFromCart}
                getItemQuantity={getItemQuantity}
                getItemPriceWithMenu={getItemPriceWithMenu}
                setCustomizeModal={setCustomizeModal}
            />
            <BillDetails
                basketId={basketId}
                getCartTotal={getCartTotal}
                customerDetails={customerDetails ?? {} as CustomerDetails}
                handleAdddressDetailOpen={handleAdddressDetailOpen}
            />
        </>
    )
}

export default BaseketSideBarContent
