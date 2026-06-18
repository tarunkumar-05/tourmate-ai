import GuidesClient from './page-client';
import { getGuides } from '@/lib/data/guides';

export default async function GuidesPage() {
  const guides = await getGuides();

  return <GuidesClient initialGuides={guides} />;
}
