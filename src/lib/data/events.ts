import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { mockEvents } from '@/lib/mock-data';
import { withTimeout } from '@/lib/utils';

export const getEvents = unstable_cache(
  async () => {
    return withTimeout(
      prisma.event.findMany().catch(() => mockEvents),
      3000,
      mockEvents
    );
  },
  ['events_all'],
  { revalidate: 3600 }
);

export const getEventById = async (id: string) => {
  return unstable_cache(
    async () => {
      return withTimeout(
        prisma.event.findUnique({ where: { id } })
          .then(res => res || mockEvents.find(e => e.id === id) || null)
          .catch(() => mockEvents.find(e => e.id === id) || null),
        3000,
        mockEvents.find(e => e.id === id) || null
      );
    },
    [`event_${id}`],
    { revalidate: 3600 }
  )();
};
