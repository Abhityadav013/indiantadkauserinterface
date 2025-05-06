/* eslint-disable @typescript-eslint/no-explicit-any */
import { base_url } from '@/lib/apiEndpoints';
import { Cart, CartDescription } from '@/lib/types/cart_type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Retrieve token from localStorage
      const tid = localStorage.getItem('tid');
      const ssid = localStorage.getItem('ssid');

      // If a token exists, add it to the Authorization header
      if (tid) headers.set('tid', tid);
      if (ssid) headers.set('ssid', ssid);

      return headers;
    },
  }),
  tagTypes: ['Cart', 'CartDescription'],
  endpoints: (builder) => ({
    getCart: builder.query<Cart[], void>({
      query: () => '/cart',
      transformResponse: (res: any) => res.data?.cart?.cartItems || [],
      providesTags: ['Cart'],
    }),
    updateCart: builder.mutation<Cart[], { cart: Cart[]; isCartEmpty?: boolean }>({
      query: ({ cart, isCartEmpty }) => ({
        url: '/cart',
        method: 'POST',
        body: { cart, isCartEmpty },
      }),
      transformResponse: (res: any) => res.data?.cart?.cartItems || [],
      invalidatesTags: ['Cart'],
    }),
    getCartDescriptions: builder.query<CartDescription[], void>({
      query: () => '/cart-description',
      transformResponse: (res: any) => res.data?.cartDescription || [],
      providesTags: ['CartDescription'],
    }),
    // updateCartDescription: builder.mutation<CartDescription[], CartDescription>({
    //   async queryFn(cartDescription, _queryApi, _extraOptions, fetchWithBQ) {
    //     const existing = await fetchWithBQ('/cart-description');
    //     const updated = [...(existing.data?.data?.cartDescription || []), cartDescription];
    //     const response = await fetchWithBQ({
    //       url: '/cart',
    //       method: 'PUT',
    //       body: { cartDescription },
    //     });
    //     return { data: updated };
    //   },
    //   invalidatesTags: ['CartDescription'],
    // }),
  }),
});

export const {
  useGetCartQuery,
  useUpdateCartMutation,
  useGetCartDescriptionsQuery,
  // useUpdateCartDescriptionMutation,
  // useUpdateCartDescriptionMutation,
} = cartApi;
