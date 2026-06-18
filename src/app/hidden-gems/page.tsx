import HiddenGemsClient from './page-client';
import { mockDestinations } from '@/lib/mock-data';

export default async function HiddenGemsPage() {
  const hiddenGems = mockDestinations.filter(d => d.categories.includes('hidden_gem'));
  return <HiddenGemsClient hiddenGems={hiddenGems} />;
}
