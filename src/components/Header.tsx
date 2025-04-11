'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  return (
    <header className="shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-custom-theme text-xl font-bold">
                SevaSakha Business
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/' 
                    ? 'border-custom-theme text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/businesses"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/businesses' 
                    ? 'border-custom-theme text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                All Businesses
              </Link>

              {/* All categories */}
              <>
                <button
                  type="button"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname.includes('/categories') 
                      ? 'border-custom-theme text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                >
                  Categories
                  <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {isCategoriesOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <Link
                            key={category}
                            href={`/categories/${encodeURIComponent(category)}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsCategoriesOpen(false)}
                          >
                            {category}
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">No categories found</div>
                      )}
                    </div>
                  </div>
                )}
              </>
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link
              href="/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-custom-theme hover:bg-hover-theme focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-theme"
            >
              Add Business
            </Link>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">

            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/'
                  ? 'bg-custom-theme border-custom-theme text-custom-theme'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>


            <Link
              href="/businesses"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/businesses'
                  ? 'bg-custom-theme border-custom-theme text-custom-theme'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              All Businesses
            </Link>

            
            <span className="relative">
                <button
                  type="button"
                  className={`w-full text-left block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    pathname.includes('/categories')
                      ? 'bg-custom-theme border-custom-theme text-custom-theme'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                >
                  Categories
                </button>

                
                {isCategoriesOpen && (
                  <div className="pl-6 space-y-1 absolute">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category}
                          href={`/categories/${encodeURIComponent(category)}`}
                          className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                          onClick={() => {
                            setIsCategoriesOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          {category}
                        </Link>
                      ))
                    ) : (
                      <div className="pl-3 pr-4 py-2 text-base text-gray-500">No categories found</div>
                    )}
                  </div>
                )}
            </span>

            <Link
              href="/create"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-custom-theme hover:bg-gray-50 hover:border-hover-theme"
              onClick={() => setIsMenuOpen(false)}
            >
              Add Business
            </Link>


          </div>
        </div>
      )}
    </header>
  );
}