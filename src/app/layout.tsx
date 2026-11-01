import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/archivo/standard.css';
import '@fontsource/ibm-plex-mono/400.css';
import './globals.css';
import '@/components/story/story.css';
import SkyBridge from '@/components/hud/SkyBridge';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Anwesha Kar — How a question became an engineer',
  description:
    'Follow a little girl’s curiosity from a quiet sky through code, systems, cybersecurity, and space. An interactive story and technical portfolio by Anwesha Kar.',
  applicationName: 'System 369',
  keywords: ['Anwesha Kar', 'software engineer', 'cybersecurity', 'research', 'System 369'],
  openGraph: {
    title: 'How a question became an engineer — Anwesha Kar',
    description: 'A story of curiosity. A world built from code.',
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
const initializeSky = `(function(){try{var p=localStorage.getItem('system369.sky.v2');var s=p==='light'||p==='dark'?p:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.sky=s;document.documentElement.style.colorScheme=s}catch(e){document.documentElement.dataset.sky=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initializeSky }} />
      </head>
      <body>
        <SkyBridge />
        {children}
      </body>
    </html>
  );
}
