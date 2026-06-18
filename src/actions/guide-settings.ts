'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateGuideProfile(data: {
  university: string;
  studentId: string;
  pricePerHour?: number;
  pricePerDay?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.guideProfile.update({
      where: { userId: session.user.id },
      data: {
        university: data.university,
        studentId: data.studentId,
        pricePerHour: data.pricePerHour,
        pricePerDay: data.pricePerDay,
      }
    });

    revalidatePath('/dashboard/guide/settings');
    revalidatePath('/dashboard/guide');
    return { success: true };
  } catch (error) {
    console.error('Failed to update guide profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}
