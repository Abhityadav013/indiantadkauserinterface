// pages/api/user/register-session.ts

import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import UserSession from '@/lib/mongodb/models/UserSession';
import ApiResponse from '@/utils/ApiResponse';
import { connectToDatabase } from '@/lib/mongodb/connect';
import { validateAndRegenrateAccessToken } from '@/utils/generateTokens';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const payload = await request.json();
    const { ssid, tid } = payload;
    const cookieStore = await cookies(); // ✅ Always use this in App Router
    const deviceId = ssid ?? cookieStore.get('_device_id')?.value;
    let access_Token = request.cookies.get('access_token')?.value || '';
    const refresh_token = request.cookies.get('refresh_token')?.value || '';
    let session = new UserSession();
    let isexistingUser = false;

    if (!deviceId || deviceId === 'undefined') {
      // If no deviceId in cookies, create a new guest session
      const guestId = uuidv4();
      const sessionId = uuidv4();
      session.guestId = guestId; // Set the guest ID
      session.deviceId = sessionId;
      await session.save(); // Save session to the database
    } else {
      // If deviceId exists, maybe fetch the session from the DB or use existing session
      const existingSession = await UserSession.findOne({ id: deviceId });
      if (existingSession) {
        session = existingSession;
        isexistingUser = true;
      } else {
        // Device ID is invalid or outdated, create a new guest session
        const guestId = tid;
        const deviceId = ssid;
        session = new UserSession({ deviceId, guestId }); // New session object
        await session.save(); // Save to DB
      }
    }

    if (refresh_token && !access_Token) {
      access_Token = await validateAndRegenrateAccessToken(refresh_token);
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

    // Set the cookies
    if (access_Token || refresh_token) {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
      };

      response.cookies.set('access_token', access_Token, {
        ...cookieOptions,
        maxAge: 60 * 15, // 15 minutes
      });

      response.cookies.set('refresh_token', refresh_token, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 10, // 10 days
      });
    }

    // ✅ Set cookies on the response object
    response.cookies.set('_guest_id', session.guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 2 * 24 * 60 * 60, // seconds
      path: '/',
    });
    response.cookies.set('_device_id', session.deviceId, {
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
