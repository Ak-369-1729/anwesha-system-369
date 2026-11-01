import { siteOrigin } from '@/lib/seo';
export function PageSeo({ path, data }: { path: string; data: Record<string, unknown> }) {
  return (
    <>
      {!siteOrigin && (
        <>
          <link rel="canonical" href={path} />
          <meta property="og:url" content={path} />
        </>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ '@context': 'https://schema.org', ...data }).replaceAll(
            '<',
            '\\u003c',
          ),
        }}
      />
    </>
  );
}
