import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { mockDestinations } from '@/lib/mock-data';
import { withTimeout } from '@/lib/utils';

export const getDestinations = unstable_cache(
  async () => {
    return withTimeout(
      prisma.destination.findMany({
        include: {
          experiences: { include: { guide: { include: { profile: true } } } },
          reviews: true
        }
      }).catch(() => mockDestinations),
      8000,
      mockDestinations
    );
  },
  ['destinations_all'],
  { revalidate: 3600 }
);

export const getDestinationById = async (id: string) => {
  return unstable_cache(
    async () => {
      return withTimeout(
        prisma.destination.findUnique({
          where: { id },
          include: {
            experiences: { include: { guide: { include: { profile: true } } } },
            reviews: { include: { author: { include: { profile: true } } } }
          }
        }).then(res => res || mockDestinations.find(d => d.id === id) || null)
          .catch(() => mockDestinations.find(d => d.id === id) || null),
        3000,
        mockDestinations.find(d => d.id === id) || null
      );
    },
    [`destination_${id}`],
    { revalidate: 3600 }
  )();
};

export const getFeaturedDestinations = unstable_cache(
  async () => {
    return withTimeout(
      prisma.destination.findMany({
        where: { featured: true },
        take: 5
      }).catch(() => mockDestinations.filter(d => d.featured).slice(0, 5)),
      3000,
      mockDestinations.filter(d => d.featured).slice(0, 5)
    );
  },
  ['destinations_featured'],
  { revalidate: 3600 }
);
