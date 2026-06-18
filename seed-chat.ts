import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock data for messaging test...');

  // Get the first tourist user (which is the user testing it)
  const tourist = await prisma.user.findFirst({
    where: { role: 'TOURIST' }
  });

  if (!tourist) {
    console.log('No tourist found. Cannot seed.');
    return;
  }

  // Find or create a guide
  let guide = await prisma.user.findFirst({
    where: { role: 'GUIDE' }
  });

  if (!guide) {
    guide = await prisma.user.create({
      data: {
        name: 'Ravi Kumar (Guide)',
        email: 'ravi.guide@example.com',
        role: 'GUIDE',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      }
    });
  }

  // Create a destination if needed
  let destination = await prisma.destination.findFirst();
  if (!destination) {
    destination = await prisma.destination.create({
      data: {
        name: 'Taj Mahal',
        slug: 'taj-mahal-test',
        description: 'Test destination',
        latitude: 27.1751,
        longitude: 78.0421,
      }
    });
  }

  // Create an experience
  let experience = await prisma.experience.findFirst();
  if (!experience) {
    experience = await prisma.experience.create({
      data: {
        guideId: guide.id,
        destinationId: destination.id,
        title: 'Sunset at the Taj Mahal',
        slug: 'sunset-taj-test',
        description: 'A beautiful sunset tour.',
        category: 'HERITAGE',
        duration: 3,
        maxGroupSize: 10,
        pricePerPerson: 1500,
        status: 'PUBLISHED'
      }
    });
  }

  // Create a booking
  const booking = await prisma.booking.create({
    data: {
      touristId: tourist.id,
      guideId: guide.id,
      experienceId: experience.id,
      status: 'CONFIRMED',
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
      totalAmount: 1500,
      platformFee: 150,
      guideEarnings: 1350,
    }
  });

  // Create a ChatRoom
  const chatRoom = await prisma.chatRoom.create({
    data: {
      bookingId: booking.id,
      participants: [tourist.id, guide.id],
      lastMessage: 'Looking forward to the tour!',
      lastMessageAt: new Date(),
    }
  });

  // Create an initial message
  await prisma.chatMessage.create({
    data: {
      chatRoomId: chatRoom.id,
      senderId: guide.id,
      content: 'Looking forward to the tour! Let me know if you need any help finding the meeting point.',
    }
  });

  console.log('Successfully seeded mock chat data!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
