import type { MetadataRoute } from 'next';
import { siteOrigin, siteUrl } from '@/lib/seo';
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    ...(siteOrigin ? { sitemap: siteUrl('/sitemap.xml') } : {}),
  };
}
