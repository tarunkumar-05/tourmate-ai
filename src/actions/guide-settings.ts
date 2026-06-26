'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';

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
    revalidatePath('/guides');
    revalidateTag('guides_all');
    revalidateTag(`guide_${session.user.id}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update guide profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function uploadProfilePicture(base64Image: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: base64Image,
      }
    });

    revalidatePath('/dashboard/guide/settings');
    revalidatePath('/'); // Revalidate root to refresh layout
    revalidatePath('/guides');
    revalidateTag('guides_all'); // Revalidate the guides list so new picture shows up
    revalidateTag(`guide_${session.user.id}`); // Revalidate individual guide page
    return { success: true };
  } catch (error) {
    console.error('Failed to upload profile picture:', error);
    return { success: false, error: 'Failed to upload profile picture' };
  }
}
