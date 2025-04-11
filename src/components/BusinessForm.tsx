'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Business, BusinessFormData } from '@/types';
import Image from 'next/image';

interface BusinessFormProps {
  initialData?: Business;
  isEditing?: boolean;
}

export default function BusinessForm({ initialData, isEditing = false }: BusinessFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const defaultFormData: BusinessFormData = {
    profilePhoto: '',
    businessName: '',
    category: '',
    address: '',
    contactNo: '',
    googleLocation: '',
    description: '',
    images: [],
    videos: []
  };
  
  const [formData, setFormData] = useState<BusinessFormData>(defaultFormData);
  
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
        setImagePreview(initialData.profilePhoto);
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
      // In a real app, you would upload this to a storage service
      // For now, we'll use a data URL for the preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, profilePhoto: result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle images upload
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Process multiple images
      const newImages: string[] = [...formData.images];
      
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          newImages.push(result);
          setFormData(prev => ({ ...prev, images: newImages }));
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  // Handle videos upload
  const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Process multiple videos
      const newVideos: string[] = [...formData.videos];
      
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          newVideos.push(result);
          setFormData(prev => ({ ...prev, videos: newVideos }));
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  // Remove an image from the list
  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));
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
    
    try {
      if (isEditing && initialData) {
        // Update existing business
        const res = await fetch(`/api/businesses/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        console.log("res",res);
        
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
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark">
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
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="e.g., Restaurant, Retail, Service"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          />
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
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
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
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
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
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
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
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        
        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Images
          </label>
          <div className="mt-1">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark">
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
            <div className="grid grid-cols-3 gap-4 mt-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <div className="w-full h-24 rounded-md overflow-hidden">
                    <Image
                      src={image}
                      alt={`Business Image ${index + 1}`}
                      className="object-cover"
                      fill
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1 -translate-y-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
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
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark">
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
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : isEditing ? 'Update Business' : 'Create Business'}
        </button>
      </div>
    </form>
  );
}