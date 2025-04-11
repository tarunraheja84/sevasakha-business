import BusinessForm from '@/components/BusinessForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Business | SevaSkaha Business',
  description: 'Add a new business to our directory',
};

export default function CreateBusinessPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Add Business
        </h1>
        <p className="mt-2 text-gray-600">
          Fill out the form below to add your business to our directory
        </p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <BusinessForm />
      </div>
    </div>
  );
}