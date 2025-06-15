import { configureStore } from '@reduxjs/toolkit';
import { cartApi } from './api/cartApi'; // created in next step
import { customerDetailsApi } from './api/customerDetailsApi';
import { orderApi } from './api/orderApi';
import orderReducer from './slices/orderSlice';
import mobileReducer from './slices/mobileSlice';
import addressReducer from './slices/addressSlice'; // Assuming you have an addressSlice
import basketReducer from './slices/basketSlice'; // Assuming you have a basketSlice
import paymentReducer from './slices/paymentSlice';
import navigationReducer from './slices/navigationSlice';
import { availableCouponApi } from './api/availableCouponsApi';
import couponReducer from './slices/discountCoupon';
export const store = configureStore({
  reducer: {
    [cartApi.reducerPath]: cartApi.reducer,
    [customerDetailsApi.reducerPath]: customerDetailsApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [availableCouponApi.reducerPath]: availableCouponApi.reducer,
    order: orderReducer,
    mobile: mobileReducer,
    address: addressReducer, // Assuming you have an addressReducer
    basket: basketReducer, // Assuming you have a basketReducer
    payment: paymentReducer,
    navigation: navigationReducer,
    coupon: couponReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      cartApi.middleware,
      customerDetailsApi.middleware,
      orderApi.middleware,
      availableCouponApi.middleware // ✅ Add this
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
