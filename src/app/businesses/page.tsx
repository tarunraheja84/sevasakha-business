import Link from 'next/link';
import { Metadata } from 'next';
import BusinessList from '@/components/BusinessList';
import { getAllBusinesses } from '@/lib/db';

export const metadata: Metadata = {
  title: 'All Businesses | Business Directory',
  description: 'Browse all businesses in our directory',
};

export default async function BusinessesPage() {
  const businesses = await getAllBusinesses();
  
  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-gray-900">
          All Businesses
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
        <BusinessList initialBusinesses={businesses} />
      </div>
    </div>
  );
}