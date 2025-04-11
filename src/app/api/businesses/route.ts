import { NextRequest, NextResponse } from 'next/server';
import { BusinessFormData } from '@/types';
import { createBusiness, getAllBusinesses } from '@/lib/db';

export async function GET() {
  try {
    const businesses = await getAllBusinesses();
    return NextResponse.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the incoming data
    if (!body.businessName || !body.category) {
      return NextResponse.json(
        { error: 'Business name and category are required' },
        { status: 400 }
      );
    }
    
    const business = await createBusiness(body as BusinessFormData);
    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json(
      { error: 'Failed to create business' },
      { status: 500 }
    );
  }
}