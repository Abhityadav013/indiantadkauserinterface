import { configureStore } from '@reduxjs/toolkit';
import { cartApi } from './api/cartApi'; // created in next step
import { customerDetailsApi } from './api/customerDetailsApi';

export const store = configureStore({
  reducer: {
    [cartApi.reducerPath]: cartApi.reducer,
    [customerDetailsApi.reducerPath]: customerDetailsApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartApi.middleware,customerDetailsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


