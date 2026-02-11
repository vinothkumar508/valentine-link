import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Will you be my Valentine?',
  description: 'Create a personalized Valentine link and share the moment.',
  openGraph: {
    title: 'Will you be my Valentine?',
    description: 'Open a personalized Valentine proposal — created with love.',
    images: [
      {
        url: '/images/placeholder1.svg',
        width: 1200,
        height: 630,
        alt: 'Valentine preview',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[length:100%_100%] font-sans">
        {children}
      </body>
    </html>
  );
}
