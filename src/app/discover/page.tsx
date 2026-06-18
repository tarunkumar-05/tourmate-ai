import DiscoverClient from './page-client';
import { getDestinations } from '@/lib/data/destinations';

export default async function DiscoverPage() {
  const destinations = await getDestinations();

  return <DiscoverClient initialDestinations={destinations} />;
}
