import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { mockUsers } from '@/lib/mock-data';
import { withTimeout } from '@/lib/utils';

const mockGuides = mockUsers.filter(u => u.role === 'guide');

export const getGuides = unstable_cache(
  async () => {
    try {
      const guides = await prisma.user.findMany({
        where: { role: 'GUIDE' },
        include: { profile: true, guideProfile: true }
      });
      return guides.length > 0 ? guides : mockGuides;
    } catch (e) {
      return mockGuides;
    }
  },
  ['guides_all'],
  { revalidate: 3600, tags: ['guides_all'] }
);

export const getGuideById = async (id: string) => {
  return unstable_cache(
    async () => {
      try {
        const guide = await prisma.user.findUnique({
          where: { id },
          include: { profile: true, guideProfile: true }
        });
        return guide || mockGuides.find(g => g.id === id) || null;
      } catch (e) {
        return mockGuides.find(g => g.id === id) || null;
      }
    },
    [`guide_${id}`],
    { revalidate: 3600, tags: [`guide_${id}`] }
  )();
};
