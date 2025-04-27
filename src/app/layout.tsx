import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SevaSakha',
  description: 'A directory of local businesses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://www.sevasakha.com/sevasakha.png" />
         {/* Google Analytics Script Tag Loader */}
         <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7DBNFHTX59"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7DBNFHTX59');
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Header />
        <main className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} SevaSakha. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
