import { connectToDatabase } from "@/lib/mongodb/connect";
import Order, { IOrder } from "@/lib/mongodb/models/Order";
import { OrderSuccessSummary } from "@/lib/types/order_summary";
import { OrderType } from "@/lib/types/order_type";
import ApiResponse from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any
) {
    const { params } = await context;
    const { id: orderId } = params; // No need to await here either
    await connectToDatabase();
    //const deviceId = request.headers.get('ssid') || '';
    const orderInfo = await Order.findOne({ displayId: orderId })
        .select('-_id -deviceId -tid')
        .lean<IOrder>();

    if (!orderInfo) {
        return NextResponse.json(new ApiResponse(404, {}, 'Order info not found.'));
    }

    const orderResponse: OrderSuccessSummary = {
        displayId: orderInfo.displayId,
        orderId: orderInfo.id,
        orderType: orderInfo.onlineOrder ? OrderType.DELIVERY : OrderType.PICKUP,
        orderItems: orderInfo.orderItems?.map((item) => {
            return {
                id: item?.itemId,
                name: item?.itemName,
                quantity: item?.quantity,
                price: item?.price
            };
        }),
        orderAmount: orderInfo.orderAmount,
        createdAt: new Date().toISOString(),
    };
    return NextResponse.json(
        new ApiResponse(200, { ...orderResponse }, 'Order detail fetched successfully'),
    );
}