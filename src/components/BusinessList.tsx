'use client';

import { useState, useEffect } from 'react';
import BusinessCard from './BusinessCard';
import { Business } from '@/types';

interface BusinessListProps {
  initialBusinesses?: any[];
  category?: string;
}

export default function BusinessList({ initialBusinesses = [], category }: BusinessListProps) {
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);
  const [isLoading, setIsLoading] = useState(!initialBusinesses.length);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
      const fetchBusinesses = async () => {
        try {
          const url = category 
            ? `/api/categories/${encodeURIComponent(category)}/businesses` 
            : '/api/businesses';
            
          const res = await fetch(url);
          
          if (!res.ok) {
            throw new Error('Failed to fetch businesses');
          }
          
          const data = await res.json();
          setBusinesses(data);
        } catch (err) {
          console.error('Error fetching businesses:', err);
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchBusinesses();
  }, [initialBusinesses, category]);
  
  if (isLoading) {
    return (
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
            <p className="mt-2 text-gray-500">Loading businesses...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 inline-block">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (businesses.length === 0) {
    return (
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">
              {category 
                ? `No businesses found in the "${category}" category.` 
                : 'No businesses found.'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
}