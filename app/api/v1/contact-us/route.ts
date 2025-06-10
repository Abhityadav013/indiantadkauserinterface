import Contact from '@/lib/mongodb/models/Contact';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const deviceId = request.headers.get('ssid') || '';

    const { name, message } = payload;

    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message are required.' }, { status: 400 });
    }

    const contact = new Contact({
      name: name,
      message: message,
      deviceId: deviceId,
    });

    // Save the order
    await contact.save();

    return NextResponse.json(
      {
        message: 'Request sent successfully',
        contact: contact,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
