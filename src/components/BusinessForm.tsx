'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { BusinessFormData, BusinessWithFiles, BusinessWithFilesFormData } from '@/types';
import Image from 'next/image';

interface BusinessFormProps {
  initialData?: BusinessWithFiles;
  isEditing?: boolean;
}

export default function BusinessForm({ initialData, isEditing = false }: BusinessFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const defaultFormData: BusinessWithFilesFormData = {
    profilePhoto: typeof window !== 'undefined'
    ? new File([""], "profilePhoto.png", { type: "image/png" })
    : (null as unknown as File),
    businessName: '',
    category: '',
    address: '',
    contactNo: '',
    googleLocation: '',
    description: '',
    images: [],
    videos: []
  };

  
  const [formData, setFormData] = useState<BusinessWithFilesFormData>(defaultFormData);
  
  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        profilePhoto: initialData.profilePhoto,
        businessName: initialData.businessName,
        category: initialData.category,
        address: initialData.address,
        contactNo: initialData.contactNo,
        googleLocation: initialData.googleLocation,
        description: initialData.description,
        images: initialData.images,
        videos: initialData.videos
      });
      
      if (initialData.profilePhoto) {
        const url = typeof initialData.profilePhoto === 'string'
        ? initialData.profilePhoto
        : URL.createObjectURL(initialData.profilePhoto);
        setImagePreview(url);
      }
    }
  }, [initialData]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle profile photo upload
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePhoto: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  // Handle images upload
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
      if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...fileArray] }));
    }
  };

  // Handle videos upload
  const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
      if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setFormData(prev => ({ ...prev, videos: [...prev.videos, ...fileArray] }));
    }
  };

  
  // Remove an image from the list
  const removeImage = (index: number) => {
    const updatedImages = [...formData.images];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
  
    setFormData(prev => ({ ...prev, images: updatedImages }));
    setImagePreviews(updatedPreviews);
  };
  
  // Remove a video from the list
  const removeVideo = (index: number) => {
    const newVideos = [...formData.videos];
    newVideos.splice(index, 1);
    setFormData(prev => ({ ...prev, videos: newVideos }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const finalFormData = new FormData();
    
    finalFormData.append("profilePhoto",formData.profilePhoto);
    finalFormData.append("businessName",formData.businessName);
    finalFormData.append("category",formData.category);
    finalFormData.append("address",formData.address);
    finalFormData.append("contactNo",formData.contactNo);
    finalFormData.append("googleLocation",formData.googleLocation);
    finalFormData.append("description",formData.description);
    
    // Append images
    if (formData.images && Array.isArray(formData.images)) {
      formData.images.forEach((image, index) => {
        if (image instanceof File) {
          finalFormData.append("images", image, `image-${index}`);
        } else {
          finalFormData.append("imageUrls", image); // send URLs under a different key (e.g., "imageUrls")
        }
      });
    }

    // Append videos
    if (formData.videos && Array.isArray(formData.videos)) {
      formData.videos.forEach((video, index) => {
        if (video instanceof File) {
          finalFormData.append("videos", video, `video-${index}`);
        } else {
          finalFormData.append("videoUrls", video); // send URLs under a different key (e.g., "videoUrls")
        }
      });
    }

    try {
      if (isEditing && initialData) {
        // Update existing business
        const res = await fetch(`/api/businesses/${initialData.id}`, {
          method: 'PUT',
          body: finalFormData,
        });
        
        if (!res.ok) {
          throw new Error('Failed to update business');
        }
        
        router.push(`/businesses/${initialData.id}`);
        router.refresh();
      } else {
        // Create new business
        const res = await fetch('/api/businesses', {
          method: 'POST',
          body: finalFormData,
        });
        
        if (!res.ok) {
          throw new Error('Failed to create business');
        }
        
        router.push('/businesses');
        router.refresh();
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="space-y-4">
        {/* Profile Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Photo
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-300 flex items-center justify-center">
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <Image
                    src={imagePreview}
                    alt="Profile Preview"
                    className="object-cover"
                    fill
                  />
                </div>
              ) : (
                <span className="text-gray-400">No image</span>
              )}
            </div>
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-custom-theme hover:bg-hover-theme focus:outline-none focus:ring-2 focus:ring-offset-2">
              Upload Photo
              <input
                type="file"
                name="profilePhoto"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="sr-only"
              />
            </label>
          </div>
        </div>
        
        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
            Business Name *
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
            className="px-2 py-1 mt-1 block w-full rounded-md shadow-sm text-sm bg-gray-100"
          />
        </div>
        
        {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="px-2 py-1 mt-1 block w-full bg-gray-100 border border-gray-400 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
        >
          <option value="">Select a category</option>
          <option value="Home Services">Home Services</option>
          <option value="Personal Care & Wellness">Personal Care & Wellness</option>
          <option value="Events & Celebrations">Events & Celebrations</option>
          <option value="Religious & Cultural">Religious & Cultural</option>
          <option value="Transportation & Travel">Transportation & Travel</option>
          <option value="Education & Coaching">Education & Coaching</option>
          <option value="Repair & Maintenance">Repair & Maintenance</option>
          <option value="Business">Business</option>
          <option value="Others / Miscellaneous">Others / Miscellaneous</option>
        </select>
      </div>
        
        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="px-2 py-1 mt-1 block w-full bg-gray-100 border-gray-400 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        
        {/* Contact Number */}
        <div>
          <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700">
            Contact Number
          </label>
          <input
            type="text"
            id="contactNo"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            className="px-2 py-1 mt-1 block w-full bg-gray-100 border-gray-400 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        
        {/* Google Location */}
        <div>
          <label htmlFor="googleLocation" className="block text-sm font-medium text-gray-700">
            Google Location (URL or Coordinates)
          </label>
          <input
            type="text"
            id="googleLocation"
            name="googleLocation"
            value={formData.googleLocation}
            onChange={handleChange}
            placeholder="e.g., https://maps.google.com/?q=... or 40.7128,-74.0060"
            className="px-2 py-1 mt-1 block w-full bg-gray-100 border-gray-400 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="px-2 py-1 mt-1 block w-full bg-gray-100 border-gray-400 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        
        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <div className="mt-1">
            <label className="cursor-pointer inline-flex items-center px-2 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary bg-custom-theme hover:bg-hover-theme focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-theme">
              Upload Images
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="sr-only"
              />
            </label>
          </div>
          
          {formData.images.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {formData.images.map((img, index) => (
                <div key={index} className="relative w-32 h-32 border rounded-md overflow-hidden">
                  <Image
                    src={img instanceof File ? URL.createObjectURL(img): img}
                    alt={`Preview ${index}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-1 shadow"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Videos */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Videos
          </label>
          <div className="mt-1">
            <label className="cursor-pointer inline-flex items-center px-2 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary bg-custom-theme hover:bg-hover-theme focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-theme">
              Upload Videos
              <input
                type="file"
                name="videos"
                accept="video/*"
                multiple
                onChange={handleVideosChange}
                className="sr-only"
              />
            </label>
          </div>
          {formData.videos.length > 0 && (
            <div className="space-y-2 mt-2">
              {formData.videos.map((video, index) => (
                <div key={index} className="relative flex items-center p-2 bg-gray-50 rounded-md">
                  <span className="truncate flex-1">Video {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-custom-theme hover:bg-custom-theme focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-theme disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : isEditing ? 'Update Business' : 'Create Business'}
        </button>
      </div>
    </form>
  );
}