'use client';

import { AvailableCoupons } from '@/lib/types/availabelCoupons';
import { AppDispatch } from '@/store';
import { setAvailableCoupons, setCartAmount } from '@/store/slices/discountCoupon';
import { calculateCouponDiscount } from '@/utils/calculateCouponDiscount';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

interface UseAvailableCouponsProps {
  availableCoupons: AvailableCoupons[];
  cartAmount: number;
}

export function useAvailableCoupons({ availableCoupons, cartAmount }: UseAvailableCouponsProps) {
  const [finalCartAmount, setFinalCartAmount] = useState<number>(cartAmount);
  const [appliedCoupon, setAppliedCoupon] = useState<AvailableCoupons | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const todayDate = new Date();

  useEffect(() => {
    if (availableCoupons && cartAmount) {
      dispatch(setAvailableCoupons(availableCoupons));
      dispatch(setCartAmount(cartAmount));
    }
  }, [availableCoupons, cartAmount, dispatch]);

  const isCouponValid = (coupon: AvailableCoupons): boolean => {
    return todayDate >= new Date(coupon.startAt) && todayDate <= new Date(coupon.endBy);
  };

  const applyCoupon = (couponCode: string): string | void => {
    const foundCoupon = availableCoupons.find((c) => c.label === couponCode);

    if (!foundCoupon || !isCouponValid(foundCoupon)) {
      return 'Oops!! Coupon is not valid';
    }

    const discounted = calculateCouponDiscount(cartAmount, foundCoupon.discount);
    sessionStorage.setItem('finalCartAmount', finalCartAmount.toString());
    setFinalCartAmount(discounted);
    setAppliedCoupon(foundCoupon);
  };

  // New method to remove the applied coupon
  const removeCoupon = (): void => {
    setAppliedCoupon(null);
    setFinalCartAmount(cartAmount); // Reset the cart amount to the original
  };

  return {
    finalCartAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    availableCoupons,
  };
}
