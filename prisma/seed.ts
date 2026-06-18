import { PrismaClient, DestinationCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { mockUsers, mockDestinations, mockExperiences, mockEvents, mockReviews, mockPosts } from '../src/lib/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash a default password for all seed users
  const defaultPassword = 'password123';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // 1. Seed Users and Profiles
  console.log('Seeding users...');
  for (const user of mockUsers) {
    const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
    
    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: user.id, // Keeping same IDs for relation consistency
          name: `${user.profile.firstName} ${user.profile.lastName}`,
          email: user.email,
          passwordHash,
          role: user.role.toUpperCase() as any,
          emailVerified: user.emailVerified ? new Date() : null,
          image: user.avatarUrl,
          phone: user.phone,
          profile: {
            create: {
              firstName: user.profile.firstName,
              lastName: user.profile.lastName,
              bio: user.profile.bio,
              nationality: user.profile.nationality,
              languages: user.profile.languages,
              interests: user.profile.interests,
              location: user.profile.location,
              latitude: user.profile.latitude,
              longitude: user.profile.longitude,
            }
          },
          ...(user.guideProfile && {
            guideProfile: {
              create: {
                id: user.guideProfile.id,
                verified: user.guideProfile.verified,
                university: user.guideProfile.university,
                studentId: user.guideProfile.studentId,
                yearsOfExperience: user.guideProfile.yearsOfExperience,
                specializations: user.guideProfile.specializations,
                certifications: user.guideProfile.certifications as any,
                pricePerHour: user.guideProfile.pricePerHour,
                pricePerDay: user.guideProfile.pricePerDay,
                availableDays: user.guideProfile.availableDays,
                maxGroupSize: user.guideProfile.maxGroupSize,
                totalEarnings: user.guideProfile.totalEarnings,
                avgRating: user.guideProfile.avgRating,
                totalReviews: user.guideProfile.totalReviews,
                totalBookings: user.guideProfile.totalBookings,
              }
            }
          })
        }
      });
    }
  }

  // 2. Seed Destinations
  console.log('Seeding destinations...');
  for (const dest of mockDestinations) {
    await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: {},
      create: {
        id: dest.id,
        name: dest.name,
        slug: dest.slug,
        description: dest.description,
        shortDesc: dest.shortDesc,
        coverImage: dest.coverImage,
        images: dest.images,
        latitude: dest.latitude,
        longitude: dest.longitude,
        address: dest.address,
        city: dest.city,
        state: dest.state,
        country: dest.country,
        bestSeason: dest.bestSeason,
        avgBudget: dest.avgBudget,
        difficulty: dest.difficulty,
        tags: dest.tags,
        categories: dest.categories.map(c => c.toUpperCase() as DestinationCategory),
        featured: dest.featured,
        published: dest.published,
        avgRating: dest.avgRating,
        totalReviews: dest.totalReviews,
        viewCount: dest.viewCount,
      }
    });
  }

  // 3. Seed Experiences
  console.log('Seeding experiences...');
  for (const exp of mockExperiences) {
    await prisma.experience.upsert({
      where: { slug: exp.slug },
      update: {},
      create: {
        id: exp.id,
        guideId: exp.guideId,
        destinationId: exp.destinationId,
        title: exp.title,
        slug: exp.slug,
        description: exp.description,
        highlights: exp.highlights,
        includes: exp.includes,
        excludes: exp.excludes,
        coverImage: exp.coverImage,
        images: exp.images,
        category: exp.category.toUpperCase() as DestinationCategory,
        duration: exp.duration,
        maxGroupSize: exp.maxGroupSize,
        pricePerPerson: exp.pricePerPerson,
        languages: exp.languages,
        difficulty: exp.difficulty,
        meetingPoint: exp.meetingPoint,
        meetingLat: exp.meetingLat,
        meetingLng: exp.meetingLng,
        status: exp.status.toUpperCase() as any,
        avgRating: exp.avgRating,
        totalBookings: exp.totalBookings,
        featured: exp.featured,
      }
    });
  }

  // 4. Seed Events
  console.log('Seeding events...');
  for (const event of mockEvents) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: {
        id: event.id,
        title: event.title,
        slug: event.slug,
        description: event.description,
        coverImage: event.coverImage,
        images: event.images,
        category: event.category,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        location: event.location,
        city: event.city,
        state: event.state,
        latitude: event.latitude,
        longitude: event.longitude,
        organizer: event.organizer,
        price: event.price,
        isFree: event.isFree,
        maxAttendees: event.maxAttendees,
        currentAttendees: event.currentAttendees,
        tags: event.tags,
        featured: event.featured,
      }
    });
  }

  // 5. Seed Reviews
  console.log('Seeding reviews...');
  for (const review of mockReviews) {
    const existing = await prisma.review.findUnique({ where: { id: review.id } });
    if (!existing) {
      await prisma.review.create({
        data: {
          id: review.id,
          authorId: review.authorId,
          targetUserId: review.targetUserId,
          destinationId: review.destinationId,
          experienceId: review.experienceId,
          bookingId: review.bookingId,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          images: review.images,
          helpful: review.helpful,
          verified: review.verified,
        }
      });
    }
  }

  // 6. Seed Posts
  console.log('Seeding posts...');
  for (const post of mockPosts) {
    const existing = await prisma.post.findUnique({ where: { id: post.id } });
    if (!existing) {
      await prisma.post.create({
        data: {
          id: post.id,
          authorId: post.authorId,
          destinationId: post.destinationId,
          content: post.content,
          images: post.images,
          type: post.type,
          likesCount: post.likesCount,
          commentsCount: post.commentsCount,
          sharesCount: post.sharesCount,
        }
      });
    }
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
