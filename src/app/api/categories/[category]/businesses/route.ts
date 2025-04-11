import { NextRequest, NextResponse } from 'next/server';
import { getBusinessesByCategory } from '@/lib/db'; // Updated to point to Mongoose-based db

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const category = decodeURIComponent(params.category);
    const businesses = await getBusinessesByCategory(category);

    return NextResponse.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses by category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}
