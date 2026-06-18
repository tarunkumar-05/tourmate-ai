import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ChatWindow } from '@/components/dashboard/chat-window';

export default async function ChatPage({ params }: { params: Promise<{ chatId: string }> | { chatId: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const { chatId } = await Promise.resolve(params);

  const chat = await prisma.chatRoom.findUnique({
    where: { id: chatId },
    include: {
      booking: {
        include: {
          guide: true,
          tourist: true,
        }
      },
      messages: {
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, name: true, image: true } } }
      }
    }
  });

  if (!chat || !chat.participants.includes(session.user.id)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Chat Not Found</h2>
        <p className="text-gray-500">This conversation doesn't exist or you don't have access.</p>
      </div>
    );
  }

  const isTourist = chat.booking?.touristId === session.user.id;
  const otherUser = isTourist ? chat.booking?.guide : chat.booking?.tourist;
  const fallbackName = isTourist ? "Guide" : "Tourist";

  return (
    <ChatWindow 
      chatId={chat.id} 
      currentUserId={session.user.id} 
      initialMessages={chat.messages}
      otherUser={{
        name: otherUser?.name || fallbackName,
        image: otherUser?.image || null
      }}
    />
  );
}
