import { getBusinessById } from '@/lib/db';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface BusinessPageProps {
  params: {
    id: string;
  }
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const business = await getBusinessById(params.id);
  
  if (!business) {
    return {
      title: 'Business Not Found | Business Directory'
    };
  }
  
  return {
    title: `${business.businessName} | Business Directory`,
    description: business.description || `Learn more about ${business.businessName}`,
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const business = await getBusinessById(params.id);
  
  if (!business) {
    notFound();
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">
          {business.businessName}
        </h1>
        <div className="flex space-x-3">
          <Link
            href={`/businesses/${business.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-custom-theme focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-theme"
          >
            Edit Business
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-1 relative h-72 md:h-full min-h-[300px]">
            {business.profilePhoto ? (
              <Image
                src={business.profilePhoto}
                alt={business.businessName}
                className="object-cover"
                fill
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-custom-theme flex items-center justify-center">
                <span className="text-white text-6xl font-bold">
                  {business.businessName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          <div className="md:col-span-2 p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-custom-theme text-custom-theme">
                {business.category}
              </span>
            </div>
            
            <div className="space-y-6">
              {business.description && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Description</h2>
                  <p className="mt-2 text-gray-600">
                    {business.description}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {business.address && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Address</h2>
                    <p className="mt-1 text-gray-900">{business.address}</p>
                  </div>
                )}
                
                {business.contactNo && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Contact</h2>
                    <p className="mt-1 text-gray-900">{business.contactNo}</p>
                  </div>
                )}
                
                {business.googleLocation && (
                  <div className="sm:col-span-2">
                    <h2 className="text-sm font-medium text-gray-500">Location</h2>
                    <p className="mt-1 text-gray-900">
                      <a 
                        href={business.googleLocation.startsWith('http') ? business.googleLocation : `https://maps.google.com/?q=${business.googleLocation}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-custom-theme hover:underline"
                      >
                        View on Google Maps
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {business.images.length > 0 && (
          <div className="px-6 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {business.images.map((image:any, index:any) => (
                <div key={index} className="relative rounded-lg overflow-hidden h-40">
                  <Image
                    src={image}
                    alt={`${business.businessName} image ${index + 1}`}
                    className="object-cover"
                    fill
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {business.videos.length > 0 && (
          <div className="px-6 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {business.videos.map((video:any, index:any) => (
                <div key={index} className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <video
                    src={video}
                    controls
                    className="object-cover w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}