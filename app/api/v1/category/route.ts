import { connectToDatabase } from '@/lib/mongodb/connect';
import Category, { ICategory } from '@/lib/mongodb/models/Category';
import ApiResponse from '@/utils/ApiResponse';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    revalidateTag('category'); // ✅ clears the cache for that tag
  const category: ICategory[] = await Category.find({isDelivery:true}).sort({ order: 1 }).select('-_id');
    return NextResponse.json(
      new ApiResponse(200, { category }, 'Category retrieved successfully.')
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
