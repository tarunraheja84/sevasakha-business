import { NextRequest, NextResponse } from 'next/server';
import { BusinessWithFilesFormData } from '@/types';
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
    // Parse form data from the request
    const formData = await request.formData();
    
    // Extract individual fields from the formData
    const profilePhoto = formData.get('profilePhoto') as File;
    const businessName = formData.get('businessName')!.toString();
    const category = formData.get('category')!.toString();
    const address = formData.get('address')!.toString();
    const contactNo = formData.get('contactNo')!.toString();
    const googleLocation = formData.get('googleLocation')!.toString();
    const description = formData.get('description')!.toString();
    const images = formData.getAll('images') as File[];
    const videos = formData.getAll('videos') as File[];

    // Validate the incoming data
    if (!businessName || !category) {
      return NextResponse.json(
        { error: 'Business name and category are required' },
        { status: 400 }
      );
    }

    // Process the form data and create the business (including handling files)
    const business = await createBusiness({
      profilePhoto,
      businessName,
      category,
      address,
      contactNo,
      googleLocation,
      description,
      images,
      videos,
    });

    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json(
      { error: 'Failed to create business' },
      { status: 500 }
    );
  }
}