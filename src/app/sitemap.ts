import type { MetadataRoute } from 'next';
import { projects } from '@/data/portfolio';
import { siteOrigin, siteUrl } from '@/lib/seo';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteOrigin) return [];
  return ['/', '/engineering-profile/', ...projects.map((p) => `/missions/${p.id}/`)].map(
    (path) => ({
      url: siteUrl(path),
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : 0.7,
    }),
  );
}
