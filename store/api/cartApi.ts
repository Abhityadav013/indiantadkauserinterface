import { GetCartData } from '@/lib/api/fetchCartDataApi';
import { base_url } from '@/lib/apiEndpoints';
import { Cart, CartDescription } from '@/lib/types/cart_type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define response types
interface GetCartResponse {
  data: {
    id: string;
    cartItems: Cart[];
    basketId: string;
  };
}

interface UpdateCartResponse {
  data: {
    id: string;
    cartItems: Cart[];
    basketId: string;
  };
}

interface GetCartDescriptionResponse {
  data: {
    cartDescription: CartDescription[];
  };
}

// Safe default cart structure
const DEFAULT_CART_DATA: GetCartData = {
  cartItems: [],
  basketId: '',
};

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
    getCart: builder.query<GetCartData, void>({
      query: () => '/cart',
      transformResponse: (res: GetCartResponse) => {
        // Ensure we always return a consistent structure
        if (res?.data) {
          return {
            cartItems: res.data.cartItems || [],
            basketId: res.data.basketId || '',
          };
        }
        return DEFAULT_CART_DATA;
      },
      providesTags: ['Cart'],
    }),

    // POST /cart
    updateCart: builder.mutation<GetCartData, { cart: Cart[]; isCartEmpty?: boolean }>({
      query: ({ cart, isCartEmpty }) => ({
        url: '/cart',
        method: 'POST',
        body: { cart, isCartEmpty },
      }),
      transformResponse: (res: UpdateCartResponse) => {
        // Ensure we always return a consistent structure
        if (res?.data) {
          return {
            cartItems: res.data.cartItems || [],
            basketId: res.data.basketId || '',
          };
        }
        return DEFAULT_CART_DATA;
      },
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
