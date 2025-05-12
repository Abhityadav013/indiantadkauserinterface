// middleware.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import UserSession from '@/lib/mongodb/models/UserSession';
import { connectToDatabase } from '@/lib/mongodb/connect';

export async function middleware() {
  try {
    const cookieStore = await cookies();
    const cookiesHeader = cookieStore.get('_device_id');
    const _device_id = cookiesHeader ? cookiesHeader.value : '';

    // If no deviceId, create a new guest session
    if (!_device_id) {
      const guestId = uuidv4();

      // Connect to the database
      await connectToDatabase();

      // Create a new session and save it to the database
      const session = new UserSession({
        guestId: guestId,
      });
      await session.save();

      // Set cookies
      const response = NextResponse.next();
      response.cookies.set('_guest_id', guestId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 2 * 24 * 60 * 60, // 2 days in seconds
        path: '/',
      });
      response.cookies.set('_device_id', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
        path: '/',
      });

      return response;
    }

    // If deviceId exists, extend cookie age (if it’s close to expiry)
    const response = NextResponse.next();
    // Instead, pass custom header via response — this can be read by server components
    response.headers.set('ssid', _device_id); // ✅ This works for response

    const existingSession = await UserSession.findOne({ id: _device_id });

    if (existingSession) {
      response.cookies.set('_device_id', existingSession.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.error();
  }
}

export const config = {
  matcher: ['/', 'user-details', '/checkout', '/cart'], // Define where to apply the middleware
};
