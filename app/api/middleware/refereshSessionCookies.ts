// app/api/middleware/refreshCookies.ts

import { cookies } from 'next/headers';

const DEVICE_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;
const GUEST_COOKIE_MAX_AGE = 2 * 24 * 60 * 60 * 1000;

export async function refreshSessionCookies() {
  const cookieStore = await cookies();

  const guestId = cookieStore.get('_guest_id');
  const deviceId = cookieStore.get('_device_id');

  if (guestId) {
    cookieStore.set('_guest_id', guestId.value, {
      maxAge: GUEST_COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
  }

  if (deviceId) {
    cookieStore.set('_device_id', deviceId.value, {
      maxAge: DEVICE_COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
  }
}
