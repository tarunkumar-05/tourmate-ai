import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { mockUsers } from '@/lib/mock-data';
import { withTimeout } from '@/lib/utils';

const mockGuides = mockUsers.filter(u => u.role === 'guide');

export const getGuides = unstable_cache(
  async () => {
    return withTimeout(
      prisma.user.findMany({
        where: { role: 'GUIDE' },
        include: { profile: true, guideProfile: true }
      }).catch(() => mockGuides),
      3000,
      mockGuides
    );
  },
  ['guides_all'],
  { revalidate: 3600, tags: ['guides_all'] }
);

export const getGuideById = async (id: string) => {
  return unstable_cache(
    async () => {
      return withTimeout(
        prisma.user.findUnique({
          where: { id },
          include: { profile: true, guideProfile: true }
        }).catch(() => mockGuides.find(g => g.id === id) || null),
        3000,
        mockGuides.find(g => g.id === id) || null
      );
    },
    [`guide_${id}`],
    { revalidate: 3600 }
  )();
};
