import { configureStore } from '@reduxjs/toolkit';
import { cartApi } from './api/cartApi'; // created in next step
import { customerDetailsApi } from './api/customerDetailsApi';
import { orderApi } from './api/orderApi';

export const store = configureStore({
  reducer: {
    [cartApi.reducerPath]: cartApi.reducer,
    [customerDetailsApi.reducerPath]: customerDetailsApi.reducer, 
    [orderApi.reducerPath]:orderApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartApi.middleware,customerDetailsApi.middleware,orderApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


