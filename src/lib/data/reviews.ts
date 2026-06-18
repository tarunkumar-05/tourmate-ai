import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { mockReviews } from '@/lib/mock-data';
import { withTimeout } from '@/lib/utils';

export const getReviews = unstable_cache(
  async () => {
    return withTimeout(
      prisma.review.findMany({
        include: { author: { include: { profile: true } } }
      }).catch(() => mockReviews),
      3000,
      mockReviews
    );
  },
  ['reviews_all'],
  { revalidate: 3600 }
);

export const getReviewsByDestination = async (destinationId: string) => {
  return unstable_cache(
    async () => {
      return withTimeout(
        prisma.review.findMany({
          where: { destinationId },
          include: { author: { include: { profile: true } } }
        }).catch(() => mockReviews.filter(r => r.destinationId === destinationId)),
        3000,
        mockReviews.filter(r => r.destinationId === destinationId)
      );
    },
    [`reviews_destination_${destinationId}`],
    { revalidate: 3600 }
  )();
};
