import ItineraryGeneratorClient from './page-client';
import { getDestinations } from '@/lib/data/destinations';

export default async function ItineraryGeneratorPage() {
  const destinations = await getDestinations();

  return <ItineraryGeneratorClient destinations={destinations} />;
}
