import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { mockExperiences } from '@/lib/mock-data';
import { withTimeout } from '@/lib/utils';

export const getExperiences = unstable_cache(
  async () => {
    try {
      const experiences = await prisma.experience.findMany({
        where: { status: 'PUBLISHED' },
        include: { 
          guide: { 
            include: { profile: true, guideProfile: true } 
          } 
        },
        orderBy: { createdAt: 'desc' }
      });
      return experiences;
    } catch (error) {
      console.error("Failed to fetch experiences:", error);
      return [];
    }
  },
  ['experiences_all'],
  { revalidate: 3600 }
);

export const getExperienceById = async (id: string) => {
  return unstable_cache(
    async () => {
      try {
        const experience = await prisma.experience.findUnique({
          where: { id },
          include: { 
            guide: { 
              include: { profile: true, guideProfile: true } 
            } 
          }
        });
        return experience || mockExperiences.find(e => e.id === id) || null;
      } catch (error) {
        console.error(`Failed to fetch experience ${id}:`, error);
        return mockExperiences.find(e => e.id === id) || null;
      }
    },
    [`experience_${id}`],
    { revalidate: 3600 }
  )();
};
