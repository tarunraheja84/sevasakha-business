import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="py-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-custom-theme focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-theme"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}