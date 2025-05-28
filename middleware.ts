// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import createMiddleware from 'next-intl/middleware';

// Initialize next-intl middleware
const intlMiddleware = createMiddleware({
  locales: ['en', 'de'], // your locales
  defaultLocale: 'de',
  localeDetection: false,
});

export async function middleware(request: NextRequest) {
  try {
    // 1. Run next-intl middleware first
    const intlResponse = await intlMiddleware(request);

    // If next-intl middleware returns a Response (redirect or rewrite), return it immediately
    if (intlResponse) {
      return intlResponse;
    }

    // 2. Custom logic after intl middleware (when no redirect/rewrite happens)

    // Redirect root `/` to `/de` (optional, but next-intl also can do locale redirects)
    if (request.nextUrl.pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/de';
      return NextResponse.redirect(url);
    }

    // Get your cookie from the request headers (via Next.js cookies API)
    const cookieStore = await cookies();
    const cookiesHeader = cookieStore.get('_device_id');
    const _device_id = cookiesHeader ? cookiesHeader.value : '';

    // Create response for the request (continue the chain)
    const response = NextResponse.next();

    // Set custom header
    response.headers.set('ssid', _device_id);

    // Set/refresh cookie with security options
    response.cookies.set('_device_id', _device_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.error();
  }
}

// Apply middleware only to specific paths (exclude static files and API routes)
export const config = {
  matcher: ['/((?!_next|favicon.ico|images|api).*)'],
};
