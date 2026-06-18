import LandingClient from './page-client';
import { getFeaturedDestinations } from '@/lib/data/destinations';
import { mockExperiences, mockUsers, mockDestinations } from '@/lib/mock-data';

export default async function LandingPage() {
  const trendingDestinations = await getFeaturedDestinations();

  const featuredExperiences = mockExperiences.slice(0, 3);
  const topGuides = mockUsers.filter(u => u.role === 'guide').slice(0, 4);
  const hiddenGems = mockDestinations.filter(d => d.categories.includes('hidden_gem')).slice(0, 3);

  return (
    <LandingClient 
      trendingDestinations={trendingDestinations}
      featuredExperiences={featuredExperiences}
      topGuides={topGuides}
      hiddenGems={hiddenGems}
    />
  );
}
