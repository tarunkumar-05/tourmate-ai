import { getChats } from '@/actions/chat';
import { auth } from '@/auth';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare } from 'lucide-react';
import { Suspense } from 'react';

export default async function GuideMessagesLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-[75vh] flex">
      {/* Inbox List (Left Pane) */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/30">
        <div className="p-4 border-b border-gray-100 bg-white">
          <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Tourist Inquiries
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Suspense fallback={<div className="p-4 text-center text-sm text-gray-500">Loading chats...</div>}>
            <ChatList userId={userId!} />
          </Suspense>
        </div>
      </div>

      {/* Chat Area (Right Pane) */}
      <div className="w-2/3 flex flex-col bg-[#F8FAFC]">
        {children}
      </div>
    </div>
  );
}

async function ChatList({ userId }: { userId: string }) {
  const chats = await getChats();

  if (!chats || chats.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 text-sm mb-4">No active conversations.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {chats.map((chat) => {
        const isTourist = chat.booking?.touristId === userId;
        const otherUser = isTourist ? chat.booking?.guide : chat.booking?.tourist;
        const fallbackName = isTourist ? "Guide" : "Tourist";
        
        return (
          <Link 
            key={chat.id} 
            href={`/dashboard/guide/messages/${chat.id}`}
            className="p-4 border-b border-gray-50 hover:bg-white transition-colors block group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0 relative">
                {otherUser?.image ? (
                  <Image src={otherUser.image} alt={otherUser.name || fallbackName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                    {otherUser?.name?.charAt(0) || fallbackName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{otherUser?.name || fallbackName}</h4>
                  {chat.lastMessageAt && (
                    <span className="text-xs text-gray-400 shrink-0">
                      {new Date(chat.lastMessageAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate group-hover:text-gray-700 transition-colors">
                  {chat.lastMessage || `Booking: ${chat.booking?.experience?.title || 'Custom Tour'}`}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
