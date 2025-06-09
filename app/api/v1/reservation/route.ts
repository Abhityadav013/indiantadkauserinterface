import Reservation from '@/lib/mongodb/models/Reservation';
import ApiResponse from '@/utils/ApiResponse';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const deviceId = request.headers.get('ssid') || '';

    const requiredFields = ['fullName', 'phoneNumber', 'numberOfPeople', 'reservationDateTime'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const reservation = new Reservation({
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      numberOfPeople: data.numberOfPeople,
      reservationDateTime: data.reservationDateTime,
      deviceId,
    });

    await reservation.save();

    // --- SEND EMAIL AFTER SUCCESSFUL RESERVATION ---

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com', // or your SMTP host from Hostinger docs
      port: 465, // or 587, depends on your config
      secure: true, // true for port 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const date = new Date(data.reservationDateTime);

    const formattedDateTime = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true, // this makes AM/PM format
    }).format(date);

    // Email content
    const mailOptions = {
      from: `"Your Restaurant" <${process.env.SENDER_EMAIL}>`,
      to: process.env.RECIEVER_EMAIL, // send to your restaurant email
      subject: 'New Reservation Received',
      text: `You have a new reservation:\n
        Name: ${data.fullName}\n
        Phone: ${data.phoneNumber}\n
        Number of People: ${data.numberOfPeople}\n
        Date & Time: ${formattedDateTime}\n
      `,
      html: `
        <h3>New Reservation Received</h3>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Phone:</strong> ${data.phoneNumber}</p>
        <p><strong>Number of People:</strong> ${data.numberOfPeople}</p>
        <p><strong>Date & Time:</strong> ${formattedDateTime}</p>
      `,
    };

    // Send mail asynchronously
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending reservation email:', error);
      } else {
        console.log('Reservation email sent:', info.response);
      }
    });

    // Response to client
    return NextResponse.json(
      new ApiResponse(201, { ...reservation }, 'Reservation created successfully')
    );
  } catch (error) {
    console.error('Error processing reservation:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process reservation' },
      { status: 500 }
    );
  }
}
