'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function toggleExperienceStatus(experienceId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    const experience = await prisma.experience.findUnique({
      where: { id: experienceId }
    });

    if (!experience || experience.guideId !== session.user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const newStatus = experience.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';

    await prisma.experience.update({
      where: { id: experienceId },
      data: { status: newStatus }
    });

    revalidatePath('/dashboard/guide/experiences');
    return { success: true, status: newStatus };
  } catch (error) {
    console.error('Failed to toggle status:', error);
    return { success: false, error: 'Database error' };
  }
}

export async function deleteExperience(experienceId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    const experience = await prisma.experience.findUnique({
      where: { id: experienceId }
    });

    if (!experience || experience.guideId !== session.user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.experience.delete({
      where: { id: experienceId }
    });

    revalidatePath('/dashboard/guide/experiences');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete experience:', error);
    return { success: false, error: 'Database error' };
  }
}

import { DestinationCategory } from '@prisma/client';

export async function createExperience(data: {
  title: string;
  description: string;
  pricePerPerson: number;
  duration: number;
  maxGroupSize: number;
  category: DestinationCategory;
  destinationId?: string;
  meetingPoint?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    await prisma.experience.create({
      data: {
        guideId: session.user.id,
        title: data.title,
        slug,
        description: data.description,
        pricePerPerson: data.pricePerPerson,
        duration: data.duration,
        maxGroupSize: data.maxGroupSize,
        category: data.category,
        destinationId: data.destinationId || null,
        meetingPoint: data.meetingPoint,
        status: 'PUBLISHED',
      }
    });

    revalidatePath('/dashboard/guide/experiences');
    revalidateTag('experiences_all', 'default');
    return { success: true };
  } catch (error) {
    console.error('Failed to create experience:', error);
    return { success: false, error: 'Database error' };
  }
}
