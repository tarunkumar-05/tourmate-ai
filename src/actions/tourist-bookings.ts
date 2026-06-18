'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createChatRoom } from './chat';

export async function createBooking(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const experienceId = formData.get('experienceId') as string;
  const guideId = formData.get('guideId') as string;
  const price = parseFloat(formData.get('price') as string);
  const touristsCount = parseInt(formData.get('guests') as string, 10) || 1;
  const bookingDateStr = formData.get('bookingDate') as string;
  
  const startDate = bookingDateStr ? new Date(bookingDateStr) : new Date(Date.now() + 86400000 * 2);
  const totalPrice = price * touristsCount;

  // Calculate guide earnings (80% of price)
  const guideEarnings = totalPrice * 0.8;

  try {
    const booking = await prisma.booking.create({
      data: {
        touristId: session.user.id,
        guideId: guideId,
        experienceId: experienceId,
        groupSize: touristsCount,
        totalAmount: totalPrice,
        platformFee: totalPrice * 0.2,
        guideEarnings: guideEarnings,
        status: 'PENDING',
        startDate: startDate,
        endDate: startDate,
      }
    });

    // Create a chat room for them instantly
    await createChatRoom(booking.id);

    revalidatePath('/dashboard/tourist/trips');
    revalidatePath('/dashboard/guide/bookings');
  } catch (error) {
    console.error('Failed to create booking:', error);
    return { error: 'Failed to create booking' };
  }

  // Redirect to tourist dashboard after booking
  redirect('/dashboard/tourist/trips');
}
