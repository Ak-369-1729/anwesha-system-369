import type { Metadata } from 'next';
import { profile } from '@/data/portfolio';

function deploymentOrigin() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (
      !['https:', 'http:'].includes(url.protocol) ||
      /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(url.hostname)
    )
      return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}
export const siteOrigin = deploymentOrigin();
export const siteUrl = (path: string) => (siteOrigin ? new URL(path, siteOrigin).href : path);
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    ...(siteOrigin
      ? { metadataBase: new URL(siteOrigin), alternates: { canonical: siteUrl(path) } }
      : {}),
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(siteOrigin
        ? {
            url: siteUrl(path),
            images: [
              {
                url: siteUrl('/og.png'),
                width: 1200,
                height: 630,
                alt: 'SYSTEM 369 — Anwesha Kar',
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(siteOrigin ? { images: [siteUrl('/og.png')] } : {}),
    },
  };
}
export const person = {
  '@type': 'Person',
  '@id': siteUrl('/#anwesha'),
  name: profile.name,
  jobTitle: profile.title,
  description: profile.positioning,
  affiliation: { '@type': 'Organization', name: profile.institution },
  sameAs: [profile.github, profile.linkedin],
};
