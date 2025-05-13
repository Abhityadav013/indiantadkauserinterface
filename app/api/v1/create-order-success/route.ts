import { connectToDatabase } from '@/lib/mongodb/connect';
import Menu, { IMenu } from '@/lib/mongodb/models/Menu';
import Order, { IOrder, OrderStatus } from '@/lib/mongodb/models/Order';
import { OrderSuccessSummary } from '@/lib/types/order_summary';
import { OrderType } from '@/lib/types/order_type';
import ApiResponse from '@/utils/ApiResponse';
import { NextRequest, NextResponse } from 'next/server';

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
            price:item?.price
          };
        }),
        orderAmount: newOrder.orderAmount,
        createdAt: new Date().toISOString(),
      };
      return NextResponse.json(
        new ApiResponse(201, { ...orderResponse }, 'Order created successfully.')
      );

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
