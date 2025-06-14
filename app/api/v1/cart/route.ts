import { connectToDatabase } from '@/lib/mongodb/connect';
import Cart, { ICart } from '@/lib/mongodb/models/Cart';
import ApiResponse from '@/utils/ApiResponse';
import generateAccessAndRefreshTokens from '@/utils/generateTokens';
import { NextRequest, NextResponse } from 'next/server';

interface CartData {
  id: string;
  cartItems: {
    itemId: string;
    itemName: string;
    quantity: number;
  }[];
  basketId?: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const payload = await request.json();
    const deviceId = request.headers.get('ssid') || '';
    let accessToken = request.cookies.get('access_token')?.value || '';
    const { cart: cartItems, isCartEmpty } = payload;

    const cartFilter = { deviceId };

    let cart: ICart = await Cart.findOne(cartFilter).select('-cartItems.addons');

    // If the cart is empty, delete the cart document entirely
    if (isCartEmpty) {
      await cart.deleteOne({ deviceId });
      return NextResponse.json(new ApiResponse(200, null, 'Cart cleared successfully'));
    }

    if (!cart) {
      cart = new Cart({
        deviceId,
        cartItems: [],
      });
    }

    // Loop through the provided cart items and handle add/update logic
    cartItems.forEach((item: { itemId: string; itemName: string; quantity: number }) => {
      const existingItem = cart.cartItems.find((cartItem) => cartItem.itemId === item.itemId);

      if (existingItem) {
        // Update quantity if item already exists
        existingItem.quantity = item.quantity;
      } else {
        // Add the item if it doesn't exist in the cart
        cart.cartItems.push(item);
      }
    });

    // Check if items are removed (not included in the new payload)
    cart.cartItems = cart.cartItems.filter((cartItem: { itemId: string }) =>
      cartItems.some((item: { itemId: string }) => item.itemId === cartItem.itemId)
    );

    // Save the updated cart
    await cart.save();
    let refreshToken = '';
    if (!accessToken && cart.basketId) {
      const { access_token, refresh_token } = await generateAccessAndRefreshTokens(cart.basketId);
      accessToken = access_token;
      refreshToken = refresh_token;
    }

    const cartResponse: CartData = {
      id: cart.id,
      cartItems: cart.cartItems,
      basketId: cart?.basketId,
    };

    const response = NextResponse.json(
      new ApiResponse(201, cartResponse, 'Cart updated successfully')
    );

    // Set the cookies
    if (accessToken && refreshToken) {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
      };

      response.cookies.set('access_token', accessToken, {
        ...cookieOptions,
        maxAge: 60 * 15, // 15 minutes
      });

      response.cookies.set('refresh_token', refreshToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 10, // 10 days
      });
    }

    return response;
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const deviceIdFromHeaders = req.headers.get('ssid') || ''; // Try headers if deviceId in cookies is not available
    await connectToDatabase();
    const cartFilter = { deviceId: deviceIdFromHeaders };
    const cart: ICart = await Cart.findOne(cartFilter).select('-cartItems.addons');
    if (!cart) {
      return NextResponse.json(new ApiResponse(200, {}, 'Cart is empty.'));
    }

    const cartResponse: CartData = {
      id: cart?.id,
      cartItems: cart?.cartItems,
      basketId: cart.basketId,
    };

    // Return shortened base64-encoded UUID

    return NextResponse.json(
      new ApiResponse(
        200,
        { ...cartResponse },
        cartResponse ? 'Cart retrieved successfully.' : 'Cart is empty.'
      )
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
