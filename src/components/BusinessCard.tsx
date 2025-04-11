import Image from 'next/image';
import Link from 'next/link';
import { Business } from '@/types';
import React from 'react';

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Link href={`/businesses/${business.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
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
            <div className="absolute inset-0 bg-primary-light flex items-center justify-center">
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
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary-dark">
              {business.category}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {business.description || 'No description available'}
          </p>
          <div className="mt-3 text-sm text-gray-500 truncate">
            {business.address}
          </div>
        </div>
      </div>
    </Link>
  );
}