import { Metadata } from 'next';
import Link from 'next/link';
import BusinessList from '@/components/BusinessList';
import { getBusinessesByCategory } from '@/lib/db';

interface CategoryPageProps {
  params: {
    category: string;
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = decodeURIComponent(params.category);
  
  return {
    title: `${category} Businesses | SevaSkaha Business`,
    description: `Browse businesses in the ${category} category`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = decodeURIComponent(params.category);
  const businesses = await getBusinessesByCategory(category);
  
  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {category} Businesses
        </h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Link
            href="/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-custom-theme focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-theme"
          >
            Add Business
          </Link>
        </div>
      </div>
      
      <div className="mt-8">
        <BusinessList initialBusinesses={businesses} category={category} />
      </div>
    </div>
  );
}