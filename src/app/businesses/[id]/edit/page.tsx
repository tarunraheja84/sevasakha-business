import BusinessForm from '@/components/BusinessForm';
import { getBusinessById } from '@/lib/db';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface EditBusinessPageProps {
  params: {
    id: string;
  }
}

export async function generateMetadata({ params }: EditBusinessPageProps): Promise<Metadata> {
  const business = await getBusinessById(params.id);
  
  if (!business) {
    return {
      title: 'Business Not Found | Business Directory'
    };
  }
  
  return {
    title: `Edit ${business.businessName} | Business Directory`,
  };
}

export default async function EditBusinessPage({ params }: EditBusinessPageProps) {
  const business = await getBusinessById(params.id);
  
  if (!business) {
    notFound();
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Edit Business
        </h1>
        <p className="mt-2 text-gray-600">
          Update information for {business.businessName}
        </p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <BusinessForm initialData={business} isEditing={true} />
      </div>
    </div>
  );
}