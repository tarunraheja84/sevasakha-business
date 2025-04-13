import Link from 'next/link';
import Image from 'next/image';
import { getAllBusinesses, getAllCategories } from '@/lib/db';

export default async function Home() {
  const [businesses, categories] = await Promise.all([
    getAllBusinesses(),
    getAllCategories()
  ]);
  
  const featuredBusinesses = businesses.slice(0, 3);
  
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="bg-custom-theme rounded-xl overflow-hidden shadow-lg">
        <div className="px-8 py-16 sm:px-16 sm:py-24 lg:py-32 lg:px-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-800 sm:text-5xl md:text-6xl">
              <span className="block">Discover Local</span>
              <span className="block">Businesses</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-white sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Find and connect with the best local businesses in your area. Explore our directory to discover new services and products.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href="/businesses"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-hover-theme hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-theme"
              >
                Browse All Businesses
              </Link>
              <Link
                href="/create"
                className="ml-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-custom-theme bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Add Your Business
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Businesses */}
      {featuredBusinesses.length > 0 && (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Featured Businesses
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Check out some of our highlighted businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBusinesses.map((business:any) => (
              <Link 
                key={business.id} 
                href={`/businesses/${business.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform group-hover:shadow-lg">
                  <div className="relative h-48 w-full">
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
                        <span className="text-white text-xl font-bold">
                          {business.businessName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {business.businessName}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-custom-theme text-white">
                        {business.category}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {business.description || 'No description available'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link
              href="/businesses"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-custom-theme hover:bg-custom-theme/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              View All Businesses
              <svg className="ml-2 -mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      )}
      
      {/* Categories Section */}
      {categories.length > 0 && (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Browse by Category
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Find businesses by their category
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((category:any) => (
              <Link
                key={category}
                href={`/categories/${encodeURIComponent(category)}`}
                className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow"
              >
                <span className="text-custom-theme font-medium">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}