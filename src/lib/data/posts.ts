import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { mockPosts } from '@/lib/mock-data';
import { withTimeout } from '@/lib/utils';

export const getPosts = unstable_cache(
  async () => {
    return withTimeout(
      prisma.post.findMany({
        include: { author: { include: { profile: true } } }
      }).catch(() => mockPosts),
      3000,
      mockPosts
    );
  },
  ['posts_all'],
  { revalidate: 3600 }
);

export const getPostById = async (id: string) => {
  return unstable_cache(
    async () => {
      return withTimeout(
        prisma.post.findUnique({
          where: { id },
          include: { author: { include: { profile: true } } }
        }).catch(() => mockPosts.find(p => p.id === id) || null),
        3000,
        mockPosts.find(p => p.id === id) || null
      );
    },
    [`post_${id}`],
    { revalidate: 3600 }
  )();
};
