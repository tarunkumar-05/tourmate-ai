'use client';

import { useTransition } from 'react';
import { createChatRoom } from '@/actions/chat';
import { useRouter } from 'next/navigation';
import { MessageSquare, Loader2 } from 'lucide-react';

export function StartChatButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStartChat = () => {
    startTransition(async () => {
      const chat = await createChatRoom(bookingId);
      if (chat) {
        router.push(`/dashboard/tourist/messages/${chat.id}`);
      } else {
        // Fallback to inbox
        router.push('/dashboard/tourist/messages');
      }
    });
  };

  return (
    <button
      onClick={handleStartChat}
      disabled={isPending}
      className="px-4 py-2 bg-primary hover:bg-primary-600 text-white font-medium rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
      Message Guide
    </button>
  );
}
