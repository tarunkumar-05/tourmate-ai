'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getChats() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const chats = await prisma.chatRoom.findMany({
      where: {
        participants: {
          has: session.user.id,
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
      include: {
        booking: {
          include: {
            experience: {
              include: { destination: true }
            },
            guide: { select: { id: true, name: true, image: true } },
            tourist: { select: { id: true, name: true, image: true } },
          }
        }
      }
    });

    return chats;
  } catch (error) {
    console.error('Failed to fetch chats:', error);
    return [];
  }
}

export async function getMessages(chatRoomId: string) {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    // Verify user is in this chat
    const chat = await prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chat || !chat.participants.includes(session.user.id)) {
      throw new Error('Unauthorized');
    }

    const messages = await prisma.chatMessage.findMany({
      where: { chatRoomId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    });

    return messages;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }
}

export async function sendMessage(chatRoomId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    // Verify user is in this chat
    const chat = await prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chat || !chat.participants.includes(session.user.id)) {
      return { success: false, error: 'Unauthorized' };
    }

    const message = await prisma.chatMessage.create({
      data: {
        chatRoomId,
        senderId: session.user.id,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    });

    await prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: {
        lastMessage: content,
        lastMessageAt: new Date(),
      },
    });

    revalidatePath(`/dashboard/tourist/messages/${chatRoomId}`);
    return { success: true, message };
  } catch (error) {
    console.error('Failed to send message:', error);
    return { success: false, error: 'Internal Server Error' };
  }
}

// Utility to create a chat room when a booking is confirmed (or instantly if desired)
export async function createChatRoom(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) return null;

    const existingChat = await prisma.chatRoom.findUnique({
      where: { bookingId },
    });

    if (existingChat) return existingChat;

    const newChat = await prisma.chatRoom.create({
      data: {
        bookingId,
        participants: [booking.touristId, booking.guideId],
      },
    });

    return newChat;
  } catch (error) {
    console.error('Failed to create chat room:', error);
    return null;
  }
}
