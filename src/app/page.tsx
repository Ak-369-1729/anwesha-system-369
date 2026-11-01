import Experience from '@/components/Experience';
import { PageSeo } from '@/components/content/PageSeo';
import { person } from '@/lib/seo';
export default function Home() {
  return (
    <>
      <PageSeo path="/" data={person} />
      <Experience />
    </>
  );
}
