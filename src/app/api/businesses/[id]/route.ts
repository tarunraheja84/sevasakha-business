import { deleteBusiness, getBusinessById, updateBusiness } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const business = await getBusinessById(id);
    
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(business);
  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

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

    // Fetch the existing business
    const business = await getBusinessById(id);
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Prepare updated business data
    const updatedBusinessData = {
      profilePhoto: profilePhoto || business.profilePhoto,
      businessName: businessName || business.businessName,
      category: category || business.category,
      address: address || business.address,
      contactNo: contactNo || business.contactNo,
      googleLocation: googleLocation || business.googleLocation,
      description: description || business.description,
      images: images.length > 0 ? images : business.images,
      videos: videos.length > 0 ? videos : business.videos,
    };

    // Update the business with the new data
    const updatedBusiness = await updateBusiness(id, updatedBusinessData);

    return NextResponse.json(updatedBusiness);
  } catch (error) {
    console.error('Error updating business:', error);
    return NextResponse.json(
      { error: 'Failed to update business' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const business = await getBusinessById(id);
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }
    
    await deleteBusiness(id);
    return NextResponse.json(
      { message: 'Business deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting business:', error);
    return NextResponse.json(
      { error: 'Failed to delete business' },
      { status: 500 }
    );
  }
}