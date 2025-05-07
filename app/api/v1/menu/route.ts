import { connectToDatabase } from '@/lib/mongodb/connect';
import Menu, { IMenu } from '@/lib/mongodb/models/Menu';
import ApiResponse from '@/utils/ApiResponse';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();

    const menu: IMenu[] = await Menu.find().sort({ 'category.order': 1 }).select('-_id');;
    return NextResponse.json(new ApiResponse(200, { menu }, 'Menu retrieved successfully.'));
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
