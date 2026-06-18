'use client';

import { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage } from '@/actions/chat';
import { Send, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ChatWindowProps {
  chatId: string;
  currentUserId: string;
  initialMessages: any[];
  otherUser: { name: string | null; image: string | null } | null;
}

export function ChatWindow({ chatId, currentUserId, initialMessages, otherUser }: ChatWindowProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simple polling for real-time feel (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(async () => {
      const latestMessages = await getMessages(chatId);
      if (latestMessages && latestMessages.length > messages.length) {
        setMessages(latestMessages);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [chatId, messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const content = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    // Optimistic UI update
    const tempMessage = {
      id: Date.now().toString(),
      content,
      senderId: currentUserId,
      createdAt: new Date(),
      sender: { name: 'You', image: null },
    };
    setMessages((prev) => [...prev, tempMessage]);

    const res = await sendMessage(chatId, content);
    if (!res.success) {
      // Revert if failed (for MVP we just log)
      console.error(res.error);
    } else if (res.message) {
      // Replace temp message with actual
      setMessages((prev) => prev.map(m => m.id === tempMessage.id ? res.message : m));
    }
    
    setIsSending(false);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative shrink-0">
          {otherUser?.image ? (
             <Image src={otherUser.image} alt={otherUser.name || 'User'} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold">
              {otherUser?.name?.charAt(0) || 'U'}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 leading-tight">{otherUser?.name || 'Guide'}</h3>
          <span className="text-xs text-green-500 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Online
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${
                isMe 
                  ? 'bg-primary text-white rounded-br-sm' 
                  : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <span className={`text-[10px] block mt-1 ${isMe ? 'text-primary-200' : 'text-gray-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="flex gap-2 items-center bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-primary focus-within:bg-white transition-colors shadow-inner">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
