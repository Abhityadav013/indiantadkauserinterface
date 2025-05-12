import { connectToDatabase } from '@/lib/mongodb/connect';
import Menu from '@/lib/mongodb/models/Menu';
import Order, { OrderStatus } from '@/lib/mongodb/models/Order';
import { OrderType } from '@/lib/types/order_type';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  await connectToDatabase(); // Ensure DB connection
  try {
    const { orderDetails, orderType } = await request.json();
    const onlineOrder = orderType === OrderType.DELIVERY;
    const pickupOrder = orderType === OrderType.PICKUP;
    const status: OrderStatus = OrderStatus.INPROGRESS;
    const orderDate = new Date().toISOString().split("T")[0];
    // Ensure onlineOrder is true and validate provided data

    if (!orderDetails || orderDetails.length === 0 || !orderDate) {
      return NextResponse.json(
        { message: 'Items and orderDate are required.' },
        { status: 400 },
      );
    }

    // Fetch the menu items from the Menu schema (multiple items can be fetched in one query)
    const itemIds = orderDetails.map((item: { itemId: string }) => item.itemId);
    const menuItems = await Menu.find({ id: { $in: itemIds } });

    if (menuItems.length !== orderDetails.length) {
      return NextResponse.json(
        { message: 'One or more menu items not found.' },
        { status: 404 },
      );
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
            itemName: menuItem.itemName,
            // category: menuItem.category,
            quantity: item.quantity,
            // price: menuItem.price,
          };
        }
        return null; // Should not happen as we validate items exist earlier
      })
      .filter(Boolean); // Remove any null items
    const orderAmount = {
      orderTotal: totalAmount,
    };

    // Create the order with the calculated order items and total amount
    try {
      const newOrder = new Order({
        orderDate,
        orderItems,
        onlineOrder,
        pickupOrder,
        status,
        orderAmount,
      });
      await newOrder.save();
      return NextResponse.json(
        {
          message: 'Order created successfully',
          order: newOrder.orderId,
        },
        { status: 201 },
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.log('error while createing order',err)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      {
        message: 'Error creating order',
        error: error.message,
      },
      { status: 400 },
    );
  }
}
