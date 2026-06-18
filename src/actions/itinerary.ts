'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveItinerary(data: {
  destination: string;
  days: number;
  budget: string;
  interests: string[];
  itineraryData: any;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('You must be logged in to save an itinerary.');
    }

    const savedItinerary = await prisma.savedItinerary.create({
      data: {
        userId: session.user.id,
        destination: data.destination,
        days: data.days,
        budget: data.budget,
        interests: data.interests,
        itineraryData: data.itineraryData,
      },
    });

    revalidatePath('/dashboard/tourist/trips');
    return { success: true, id: savedItinerary.id };
  } catch (error: any) {
    console.error('Failed to save itinerary:', error);
    return { success: false, error: error.message || 'Failed to save itinerary' };
  }
}

export async function getSavedItineraries() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }

    return await prisma.savedItinerary.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch saved itineraries:', error);
    return [];
  }
}
