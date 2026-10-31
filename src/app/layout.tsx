import type { Metadata, Viewport } from 'next';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/ibm-plex-mono/400.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Anwesha Kar — System 369',
  description:
    'An interactive engineering universe. Explore Anwesha Kar’s systems, security concepts, research interests, and experiments.',
  applicationName: 'System 369',
  keywords: ['Anwesha Kar', 'software engineer', 'cybersecurity', 'research', 'System 369'],
  openGraph: {
    title: 'ANWESHA // SYSTEM 369',
    description: 'Code. Intelligence. Security. The unknown.',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Anwesha Kar — System 369 engineering universe',
      },
    ],
  },
  twitter: { card: 'summary_large_image', title: 'Anwesha Kar — System 369', images: ['/og.png'] },
  icons: { icon: '/icon.svg' },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: '#080d12', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
