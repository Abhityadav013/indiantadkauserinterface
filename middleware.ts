import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'de'],
  defaultLocale: 'de',
  localeDetection: false,
});

const PROTECTED_PATHS = ['/checkout', '/payment'];

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const cookieStore = await cookies();
    const url = request.nextUrl.clone();
    const pathSegments = pathname.split('/');
    const actualPath = '/' + pathSegments.slice(2).join('/'); // skip ["", "de", "checkout"]
    if (actualPath.includes('/checkout') && url.searchParams.has('orderId')) {
      const response = NextResponse.next();
      // Delete the cookie by setting max-age=0
      response.cookies.set('access_token', '', {
        maxAge: 0,
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
      response.cookies.set('refresh_token', '', {
        maxAge: 0,
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
      return response;
    }
    if (actualPath.includes('/menu-list') && url.searchParams.has('basket')) {
      url.searchParams.delete('basket');
      url.searchParams.delete('orderId');
      // Redirect to cleaned URL without basket param
      return NextResponse.redirect(url);
    }
    const deviceId = cookieStore.get('_device_id')?.value || '';
    const accessToken = cookieStore.get('access_token')?.value || '';
    const refreshToken = cookieStore.get('refresh_token')?.value || '';

    if (PROTECTED_PATHS.includes(actualPath) && !accessToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/de/menu-list';
      return NextResponse.redirect(url);
    }
    const intlResponse = await intlMiddleware(request);
    if (intlResponse) return intlResponse;

    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/de';
      return NextResponse.redirect(url);
    }

    const response = NextResponse.next();

    response.headers.set('ssid', deviceId);
    response.headers.set('access_token', accessToken);
    response.headers.set('refresh_token', refreshToken);

    if (deviceId) {
      response.cookies.set('_device_id', deviceId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
    }

    if (accessToken) {
      response.cookies.set('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 15 * 60, // 15 minutes
        path: '/',
      });
    }

    if (refreshToken) {
      response.cookies.set('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 10 * 24 * 60 * 60, // 10 days
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
  matcher: ['/((?!_next|favicon.ico|images|api).*)', '/checkout', '/payment'],
};
