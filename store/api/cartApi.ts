import { base_url } from '@/lib/apiEndpoints';
import { Cart, CartDescription } from '@/lib/types/cart_type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define response types
interface GetCartResponse {
  data: {
    id: string;
    cartItems: Cart[];
  };
}

interface UpdateCartResponse {
  data: {
    id: string;
    cartItems: Cart[];
  };
}

interface GetCartDescriptionResponse {
  data: {
    cartDescription: CartDescription[];
  };
}

// Create the API slice
export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Avoid accessing localStorage on the server
      if (typeof window !== 'undefined') {
        const tid = localStorage.getItem('tid');
        const ssid = localStorage.getItem('ssid');
        if (tid) headers.set('tid', tid);
        if (ssid) headers.set('ssid', ssid);
      }
      return headers;
    },
  }),
  tagTypes: ['Cart', 'CartDescription'],
  endpoints: (builder) => ({
    // GET /cart
    getCart: builder.query<Cart[], void>({
      query: () => '/cart',
      transformResponse: (res: GetCartResponse) => res.data?.cartItems || [],
      providesTags: ['Cart'],
    }),

    // POST /cart
    updateCart: builder.mutation<Cart[], { cart: Cart[]; isCartEmpty?: boolean }>({
      query: ({ cart, isCartEmpty }) => ({
        url: '/cart',
        method: 'POST',
        body: { cart, isCartEmpty },
      }),
      transformResponse: (res: UpdateCartResponse) => res.data?.cartItems || [],
      invalidatesTags: ['Cart'],
    }),

    // GET /cart-description
    getCartDescriptions: builder.query<CartDescription[], void>({
      query: () => '/cart-description',
      transformResponse: (res: GetCartDescriptionResponse) => res.data?.cartDescription || [],
      providesTags: ['CartDescription'],
    }),

    // PUT /cart-description
    updateCartDescription: builder.mutation<CartDescription[], CartDescription>({
      query: (cartDescription) => ({
        url: '/cart-description',
        method: 'PUT',
        body: { cartDescription },
      }),
      invalidatesTags: ['CartDescription'],
    }),
  }),
});

// Export hooks
export const {
  useGetCartQuery,
  useUpdateCartMutation,
  useGetCartDescriptionsQuery,
  useUpdateCartDescriptionMutation,
} = cartApi;
