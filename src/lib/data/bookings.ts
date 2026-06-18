import { prisma } from '@/lib/prisma';
import { withTimeout } from '@/lib/utils';

export async function getBookingsByUserId(userId: string) {
  try {
    return await prisma.booking.findMany({
      where: { touristId: userId },
      include: {
        experience: {
          include: {
            destination: true,
            guide: {
              include: { profile: true, guideProfile: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.warn('Database Error:', error);
    return [];
  }
}

export async function getBookingsByGuideId(guideId: string) {
  try {
    return await prisma.booking.findMany({
      where: { guideId },
      include: {
        experience: {
          include: { destination: true }
        },
        tourist: {
          include: { profile: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.warn('Database Error:', error);
    return [];
  }
}
