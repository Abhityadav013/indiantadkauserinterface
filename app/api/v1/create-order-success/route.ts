import { connectToDatabase } from '@/lib/mongodb/connect';
import Menu, { IMenu } from '@/lib/mongodb/models/Menu';
import Order, { IOrder, OrderStatus } from '@/lib/mongodb/models/Order';
import { OrderSuccessSummary } from '@/lib/types/order_summary';
import { OrderType } from '@/lib/types/order_type';
import ApiResponse from '@/utils/ApiResponse';
import { generateOrderConfirmationEmail } from '@/utils/generateOrderConfirmationEmail';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  await connectToDatabase(); // Ensure DB connection
  try {
    const { orderDetails, orderType, deliveryFee, tipAmount } = await request.json();
    const deviceId = request.headers.get('ssid') || '';
    const onlineOrder = orderType === OrderType.DELIVERY;
    const pickupOrder = orderType === OrderType.PICKUP;
    const status: OrderStatus = OrderStatus.INPROGRESS;
    const orderDate = new Date().toISOString().split('T')[0];
    // Ensure onlineOrder is true and validate provided data
    if (!orderDetails || orderDetails.length === 0 || !orderDate) {
      return NextResponse.json({ message: 'Items and orderDate are required.' }, { status: 400 });
    }

    // Fetch the menu items from the Menu schema (multiple items can be fetched in one query)
    const itemIds = orderDetails.map((item: { itemId: string }) => item.itemId);
    const menuItems: IMenu[] = await Menu.find({ id: { $in: itemIds } });

    if (menuItems.length !== orderDetails.length) {
      return NextResponse.json({ message: 'One or more menu items not found.' }, { status: 404 });
    }

    // Calculate total order amount and map items with the required details
    let totalAmount = 0;
    const orderItems = orderDetails
      .map((item: { itemId: string; quantity: number }) => {
        const menuItem = menuItems.find((menu) => menu.id === item.itemId);

        if (menuItem) {
          const itemTotal = menuItem.price * item.quantity; // Calculate item total
          totalAmount += itemTotal;

          return {
            itemId: menuItem.id, // Using the menu item's _id for the order
            itemName: menuItem.name,
            quantity: item.quantity,
            price: itemTotal,
          };
        }
        return null; // Should not happen as we validate items exist earlier
      })
      .filter(Boolean); // Remove any null items
    const orderAmount = {
      orderTotal: totalAmount,
      ...(deliveryFee && {
        deliveryFee: deliveryFee,
      }),
      ...(tipAmount && {
        tipAmount: tipAmount,
      }),
    };

    //const transaction :ITransaction | null = await Transaction.findOne({ paymentIntentId: paymentIntentId });

    // Create the order with the calculated order items and total amount
    try {
      const newOrder: IOrder = new Order({
        orderDate,
        orderItems,
        onlineOrder,
        pickupOrder,
        status,
        orderAmount,
        deviceId,
      });
      await newOrder.save();
      const orderResponse: OrderSuccessSummary = {
        displayId: newOrder.displayId,
        orderId: newOrder.id,
        orderType: newOrder.onlineOrder ? OrderType.DELIVERY : OrderType.PICKUP,
        orderItems: newOrder.orderItems?.map((item) => {
          return {
            id: item?.itemId,
            name: item?.itemName,
            quantity: item?.quantity,
            price: item?.price,
          };
        }),
        orderAmount: newOrder.orderAmount,
        createdAt: new Date().toISOString(),
      };

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

      const mailOptions = {
        from: `"Your Restaurant" <${process.env.SENDER_EMAIL}>`,
        to: process.env.RECIEVER_EMAIL,
        subject: '🔥 New Order Received - Urgent Attention Required',
        html: generateOrderConfirmationEmail(orderResponse), // your dynamic email content
        headers: {
          'X-Priority': '1', // For Outlook
          'X-MSMail-Priority': 'High',
          Importance: 'high', // For Gmail and others
        },
      };

      // Send mail asynchronously
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending reservation email:', error);
        } else {
          console.log('Reservation email sent:', info.response);
        }
      });

      const response = NextResponse.json(
        new ApiResponse(201, { ...orderResponse }, 'Order created successfully.')
      );
      response.cookies.set('access_token', '', { maxAge: 0, path: '/' });
      response.cookies.set('refresh_token', '', { maxAge: 0, path: '/' });
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log('error while createing order', err);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      {
        message: 'Error creating order',
        error: error.message,
      },
      { status: 400 }
    );
  }
}
