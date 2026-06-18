import CommunityClient from './page-client';
import { getPosts } from '@/lib/data/posts';
import { getFeaturedDestinations, getDestinations } from '@/lib/data/destinations';
import { mockUsers } from '@/lib/mock-data';

export default async function CommunityPage() {
  const [posts, trendingDestinations, allDestinations] = await Promise.all([
    getPosts(),
    getFeaturedDestinations(),
    getDestinations()
  ]);

  const topGuides = mockUsers.filter(u => u.role === 'guide').slice(0, 3);

  return (
    <CommunityClient 
      initialPosts={posts}
      topGuides={topGuides}
      trendingDestinations={trendingDestinations}
      allDestinations={allDestinations}
    />
  );
}
