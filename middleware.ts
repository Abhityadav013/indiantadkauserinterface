// middleware.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware() {
  try {
    const cookieStore = await cookies();
    const cookiesHeader = cookieStore.get('_device_id');
    const _device_id = cookiesHeader ? cookiesHeader.value : '';
    // If deviceId exists, extend cookie age (if it’s close to expiry)
    const response = NextResponse.next();
    // Instead, pass custom header via response — this can be read by server components
    response.headers.set('ssid', _device_id); // ✅ This works for response
    response.cookies.set('_device_id', _device_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
        path: '/',
      });

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.error();
  }
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};