import type { Viewport } from 'next';
import '@fontsource-variable/archivo/standard.css';
import '@fontsource/ibm-plex-mono/400.css';
import './globals.css';
import '@/components/story/story.css';
import '@/components/story/refinement.css';
import { pageMetadata, siteOrigin } from '@/lib/seo';
import { profile } from '@/data/portfolio';
import SkyBridge from '@/components/hud/SkyBridge';

export const metadata = {
  ...pageMetadata('Anwesha Kar — SYSTEM 369', profile.positioning, '/'),
  applicationName: 'System 369',
  icons: { icon: '/icon.svg' },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  themeColor: '#131613',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};
const initializeSky = `(function(){try{var p=localStorage.getItem('system369.sky.v2');var s=p==='light'||p==='dark'?p:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.sky=s;document.documentElement.style.colorScheme=s}catch(e){document.documentElement.dataset.sky=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {!siteOrigin && (
          <>
            <meta property="og:image" content="/og.png" />
            <meta name="twitter:image" content="/og.png" />
          </>
        )}
        <script dangerouslySetInnerHTML={{ __html: initializeSky }} />
      </head>
      <body>
        <SkyBridge />
        {children}
      </body>
    </html>
  );
}
