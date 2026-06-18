'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getUserReviews() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    return await prisma.review.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        destination: true,
        targetUser: { select: { name: true, image: true } },
        experience: { select: { title: true } },
      }
    });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return [];
  }
}

export async function getPendingReviews() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    return await prisma.booking.findMany({
      where: {
        touristId: session.user.id,
        status: 'COMPLETED',
        review: null,
      },
      include: {
        experience: { include: { destination: true } },
        guide: { select: { name: true, image: true, id: true } }
      }
    });
  } catch (error) {
    console.error('Failed to fetch pending reviews:', error);
    return [];
  }
}

export async function submitReview(data: {
  bookingId: string;
  rating: number;
  comment: string;
  targetUserId?: string;
  destinationId?: string;
  experienceId?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    // Verify booking
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId }
    });

    if (!booking || booking.touristId !== session.user.id) {
      return { success: false, error: 'Unauthorized or invalid booking' };
    }

    const review = await prisma.review.create({
      data: {
        authorId: session.user.id,
        bookingId: data.bookingId,
        rating: data.rating,
        comment: data.comment,
        targetUserId: data.targetUserId,
        destinationId: data.destinationId,
        experienceId: data.experienceId,
      }
    });

    revalidatePath('/dashboard/tourist/reviews');
    return { success: true, review };
  } catch (error) {
    console.error('Failed to submit review:', error);
    return { success: false, error: 'Failed to submit review' };
  }
}
