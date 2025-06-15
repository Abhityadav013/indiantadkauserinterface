import { connectToDatabase } from '@/lib/mongodb/connect';
import DiscountCoupons, { ICoupon } from '@/lib/mongodb/models/Coupon';
import ApiResponse from '@/utils/ApiResponse';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const discountCoupons = await DiscountCoupons.find().select('-_id').lean<ICoupon[]>();

    if (discountCoupons.length) {
      return NextResponse.json(
        new ApiResponse(200, [...discountCoupons], 'Coupons fetched successfully.')
      );
    }

    return NextResponse.json(new ApiResponse(200, [], 'No Coupons Found.'));
  } catch (error) {
    console.error('Internal Error:', error);
    return NextResponse.json(
      new ApiResponse(
        500,
        { error: `Internal Server Error: ${error}` },
        'Failed to fetch user info.'
      )
    );
  }
}
