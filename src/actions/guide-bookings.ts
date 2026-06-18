'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateBookingStatus(bookingId: string, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking || booking.guideId !== session.user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status }
    });

    // If confirmed, update total earnings for guide profile if we wanted to pre-calculate,
    // but typically we update earnings on COMPLETED. For now just update status.
    if (status === 'COMPLETED') {
      await prisma.guideProfile.update({
        where: { userId: session.user.id },
        data: {
          totalEarnings: { increment: booking.guideEarnings },
          totalBookings: { increment: 1 }
        }
      });
    }

    revalidatePath('/dashboard/guide/bookings');
    revalidatePath('/dashboard/guide');
    return { success: true };
  } catch (error) {
    console.error('Failed to update booking status:', error);
    return { success: false, error: 'Database error' };
  }
}
