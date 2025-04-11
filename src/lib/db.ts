import mongoose, { Schema, model, models } from 'mongoose';
import { Business } from '@/types';

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_ATLAS_URI!;
const S3_BASE_URL = 'https://sevasakha.s3.eu-north-1.amazonaws.com/'; // Replace with actual S3 URL

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI, {
    dbName: 'sevasakha', // Replace with your actual DB name
  }).then(() => console.log('MongoDB connected')).catch(console.error);
}

// Mongoose Schema
const businessSchema = new Schema<Business>({
  profilePhoto: String,
  businessName: String,
  category: String,
  address: String,
  contactNo: String,
  googleLocation: String,
  description: String,
  images: [String], // Store filenames only
  videos: [String], // Store filenames only
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update `updatedAt`
businessSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const BusinessModel = models.Business || model<Business>('Business', businessSchema);

// Create a business
export async function createBusiness(business: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>) {
  const images = business.images?.map((urlOrName) => urlOrName.split('/').pop() || urlOrName) || [];
  const videos = business.videos?.map((urlOrName) => urlOrName.split('/').pop() || urlOrName) || [];

  const created = await BusinessModel.create({
    ...business,
    images,
    videos,
  });

  return {
    id: created._id.toString(),
    ...created.toObject(),
    images: images.map(name => `${S3_BASE_URL}${name}`),
    videos: videos.map(name => `${S3_BASE_URL}${name}`)
  };
}

// Get all businesses
export async function getAllBusinesses() {
  const businesses = await BusinessModel.find().sort({ updatedAt: -1 }).limit(100).lean();
  return businesses.map(({ _id, images = [], videos = [], ...rest }) => ({
    id: (_id as String).toString(),
    ...rest,
    images: images.map((name:any) => `${S3_BASE_URL}${name}`),
    videos: videos.map((name:any) => `${S3_BASE_URL}${name}`)
  }));
}

// Get businesses by category
export async function getBusinessesByCategory(category: string) {
  const businesses = await BusinessModel.find({ category }).sort({ updatedAt: -1 }).limit(100).lean();
  return businesses.map(({ _id, images = [], videos = [], ...rest }) => ({
    id: (_id as String).toString(),
    ...rest,
    images: images.map((name:any) => `${S3_BASE_URL}${name}`),
    videos: videos.map((name:any) => `${S3_BASE_URL}${name}`)
  }));
}

// Get all categories
export async function getAllCategories() {
  const categories = await BusinessModel.distinct('category');
  return categories;
}

// Get a business by ID
export async function getBusinessById(id: string) {
  const business = await BusinessModel.findById(id).lean();
  if (!business) return null;

  const { _id, images = [], videos = [], ...rest }: any = business;

  return {
    id: _id.toString(),
    ...rest,
    images: images.map((name: string) => `${S3_BASE_URL}${name}`),
    videos: videos.map((name: string) => `${S3_BASE_URL}${name}`)
  };
}

// Update a business
export async function updateBusiness(
  id: string,
  updates: Partial<Omit<Business, 'id' | 'createdAt' | 'updatedAt'>>
) {
  const images = updates.images?.map((urlOrName) => urlOrName.split('/').pop() || urlOrName);
  const videos = updates.videos?.map((urlOrName) => urlOrName.split('/').pop() || urlOrName);

  await BusinessModel.findByIdAndUpdate(id, {
    ...updates,
    ...(images && { images }),
    ...(videos && { videos }),
    updatedAt: new Date(),
  });

  return getBusinessById(id);
}

// Delete a business
export async function deleteBusiness(id: string) {
  return BusinessModel.findByIdAndDelete(id);
}

export { BusinessModel };
