// pages/api/user/register-session.ts

import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import UserSession from '@/lib/mongodb/models/UserSession';
import ApiResponse from '@/utils/ApiResponse';
import { connectToDatabase } from '@/lib/mongodb/connect';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const payload = await request.json();
    const { ssid } = payload;
    const cookieStore = await cookies(); // ✅ Always use this in App Router
    const deviceId = ssid ?? cookieStore.get('_device_id')?.value;
    let session = new UserSession();
    let isexistingUser = false;

    if (!deviceId || deviceId === 'undefined') {
      // If no deviceId in cookies, create a new guest session
      const guestId = uuidv4();
      session.guestId = guestId; // Set the guest ID
      await session.save(); // Save session to the database
    } else {
      // If deviceId exists, maybe fetch the session from the DB or use existing session
      session = (await UserSession.findOne({ id: deviceId })) || session;
      isexistingUser = true;
    }

    const response = NextResponse.json(
      new ApiResponse(
        200,
        {
          deviceId: session.id,
          tid: session.guestId,
          statusMessage: isexistingUser ? 'User Session Retrive' : 'Session created.',
        },
        isexistingUser ? 'User session recover successfully.' : 'User session created successfully.'
      )
    );

    // ✅ Set cookies on the response object
    response.cookies.set('_guest_id', session.guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 2 * 24 * 60 * 60, // seconds
      path: '/',
    });
    response.cookies.set('_device_id', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      new ApiResponse(500, { error: `Internal Server Error: ${error} ` }, 'An error occurred.')
    );
  }
}
