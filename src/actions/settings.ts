'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProfile(data: { name: string; phone?: string; bio?: string }) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        phone: data.phone,
      }
    });

    revalidatePath('/dashboard/tourist/settings');
    return { success: true };
  } catch (error) {
    console.error('Failed to update profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function updateAiPreferences(data: { travelStyle: string[] }) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.aiPreference.upsert({
      where: { userId: session.user.id },
      update: {
        travelStyle: data.travelStyle,
      },
      create: {
        userId: session.user.id,
        travelStyle: data.travelStyle,
      }
    });

    revalidatePath('/dashboard/tourist/settings');
    return { success: true };
  } catch (error) {
    console.error('Failed to update AI preferences:', error);
    return { success: false, error: 'Failed to update preferences' };
  }
}
