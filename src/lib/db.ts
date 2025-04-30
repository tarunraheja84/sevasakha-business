import mongoose, { Schema, model, models } from 'mongoose';
import { Business, BusinessWithFilesFormData } from '@/types';
import s3 from './s3';

const MONGODB_URI = process.env.MONGODB_ATLAS_URI!;
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI, {
    dbName: 'sevasakha',
  }).then(() => console.log('MongoDB connected')).catch(console.error);
}

const businessSchema = new Schema<Business>({
  profilePhoto: String,
  businessName: String,
  category: String,
  address: String,
  contactNo: String,
  googleLocation: String,
  description: String,
  images: [String],
  videos: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

businessSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const BusinessModel = models.Business || model<Business>('Business', businessSchema);

// Upload helper
async function uploadToS3(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name}`;
  const uploadResult = await s3.upload({
    Bucket: AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
  }).promise();

  return uploadResult.Location;
}

// Delete helper
export async function deleteFromS3(fileUrl: string) {
  const { pathname, hostname } = new URL(fileUrl);

  const Bucket = hostname.split('.')[0]; // if your bucket is in the subdomain
  const Key = decodeURIComponent(pathname.slice(1)); // remove leading slash

  return s3.deleteObject({ Bucket, Key }).promise();
}

// Create a business
export async function createBusiness(business: {
  profilePhoto: File;
  businessName: string;
  category: string;
  address: string;
  contactNo: string;
  googleLocation: string;
  description: string;
  images: File[];
  videos: File[];
}) {
  const profilePhotoUrl = await uploadToS3(business.profilePhoto);

  const imageUrls = await Promise.all(
    business.images.map(file => uploadToS3(file))
  );

  const videoUrls = await Promise.all(
    business.videos.map(file => uploadToS3(file))
  );

  const businessData: Omit<Business, 'id' | 'createdAt' | 'updatedAt'> = {
    profilePhoto: profilePhotoUrl,
    businessName: business.businessName,
    category: business.category,
    address: business.address,
    contactNo: business.contactNo,
    googleLocation: business.googleLocation,
    description: business.description,
    images: imageUrls,
    videos: videoUrls,
  };

  const created = await BusinessModel.create(businessData);
  return {
    id: created._id.toString(),
    ...created.toObject(),
  };
}

// Get all businesses
export async function getAllBusinesses() {
  const businesses = await BusinessModel.find().sort({ updatedAt: -1 }).limit(100).lean();
  return businesses.map(({ _id, ...rest }) => ({
    id: (_id as string).toString(),
    ...rest
  }));
}

// Get businesses by category
export async function getBusinessesByCategory(category: string) {
  const businesses = await BusinessModel.find({ category }).sort({ updatedAt: -1 }).limit(100).lean();
  return businesses.map(({ _id, ...rest }) => ({
    id: (_id as string).toString(),
    ...rest
  }));
}

// Get all categories
export async function getAllCategories() {
  const categories = await BusinessModel.distinct('category');

  const withoutOthers = categories.filter(cat => cat !== 'Others / Miscellaneous');
  const hasOthers = categories.includes('Others / Miscellaneous');

  return hasOthers ? [...withoutOthers, 'Others / Miscellaneous'] : withoutOthers;
}

// Get a business by ID
export async function getBusinessById(id: string) {
  const business = await BusinessModel.findById(id).lean();
  if (!business) return null;

  const { _id, ...rest }: any = business;

  return {
    id: _id.toString(),
    ...rest
  };
}

// Update a business
export async function updateBusiness(
  id: string,
  updates: Partial<BusinessWithFilesFormData>
) {
  const updatePayload: any = {
    updatedAt: new Date(),
  };

  // Handle profilePhoto
  if (updates.profilePhoto) {
    updatePayload.profilePhoto =
      updates.profilePhoto instanceof File
        ? await uploadToS3(updates.profilePhoto)
        : updates.profilePhoto;
  }

  // Handle images
  if (Array.isArray(updates.images)) {
    updatePayload.images = await Promise.all(
      updates.images.map(item =>
        item instanceof File ? uploadToS3(item) : item
      )
    );
  }

  // Handle videos
  if (Array.isArray(updates.videos)) {
    updatePayload.videos = await Promise.all(
      updates.videos.map(item =>
        item instanceof File ? uploadToS3(item) : item
      )
    );
  }

  // Other text fields
  const otherFields = [
    'businessName',
    'category',
    'address',
    'contactNo',
    'googleLocation',
    'description',
  ] as const;

  for (const field of otherFields) {
    if (updates[field] !== undefined) {
      updatePayload[field] = updates[field];
    }
  }

  // Update in DB and return updated business
  await BusinessModel.findByIdAndUpdate(id, updatePayload);
  return getBusinessById(id);
}


// Delete a business
export async function deleteBusiness(id: string) {
  const business = await BusinessModel.findById(id).lean();
  if (!business) return null;

  const { profilePhoto, images, videos }:any = business;

  const deletePromises = [];

  if (profilePhoto) deletePromises.push(deleteFromS3(profilePhoto));
  if (Array.isArray(images)) {
    deletePromises.push(...images.map(deleteFromS3));
  }
  if (Array.isArray(videos)) {
    deletePromises.push(...videos.map(deleteFromS3));
  }

  await Promise.allSettled(deletePromises);
  return BusinessModel.findByIdAndDelete(id);
}

export { BusinessModel, uploadToS3 };
