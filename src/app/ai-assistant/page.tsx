'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Bot, Loader2, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

const SUGGESTED_PROMPTS = [
  "Plan a 3-day trip to Hampi under ₹5000",
  "Find hidden waterfalls near Bengaluru",
  "Suggest a Telugu-speaking guide in Hyderabad",
  "What are the best food trails in Delhi?",
];

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: '1',
  role: 'assistant',
  content: "Hi there! I'm TourMate AI, your personal travel genius powered by Llama 3 on Groq. I can help you plan itineraries, find hidden gems, discover amazing local guides, and estimate budgets based on our platform's real data. What kind of adventure are you looking for today?",
};

export default function AIAssistantPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendChat = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    // Add the user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage.trim(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Prepare the assistant placeholder
    const assistantId = (Date.now() + 1).toString();

    try {
      // Abort any previous request
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      // Add the assistant message placeholder
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        // Update the assistant message with streamed content
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m)
        );
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      console.warn('Chat error:');
      setMessages(prev => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: `⚠️ Sorry, I encountered an error: ${error.message}. Please try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sendChat(input);
  };

  const handleNewChat = () => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([INITIAL_MESSAGE]);
    setInput('');
    setIsLoading(false);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-surface-secondary overflow-hidden">
      {/* SIDEBAR */}
      <div className="hidden md:flex w-80 flex-col bg-white border-r border-gray-100 h-full">
        <div className="p-4 border-b border-gray-100">
          <button 
            onClick={handleNewChat}
            className="w-full py-2.5 px-4 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4" /> New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Suggested Topics</h3>
          <div className="space-y-2">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button 
                key={idx}
                onClick={() => sendChat(prompt)}
                disabled={isLoading}
                className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-primary/5 text-gray-700 hover:text-primary transition-colors text-sm border border-transparent hover:border-primary/20 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-primary/5 to-primary-100/30 m-4 rounded-2xl border border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Powered by Llama 3</h4>
          </div>
          <p className="text-xs text-gray-600">The AI Assistant uses live data from the TourMate platform to recommend actual guides and destinations.</p>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col h-full">
        
        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  {/* Avatar */}
                  <div className="shrink-0 mt-1">
                    {msg.role === 'assistant' ? (
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                        <Bot className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 border border-gray-300">
                        <UserIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className={cn(
                      "text-xs font-bold px-1",
                      msg.role === 'user' ? "text-right text-gray-500" : "text-primary"
                    )}>
                      {msg.role === 'user' ? 'You' : 'TourMate AI'}
                    </span>
                    
                    <div className={cn(
                      "p-4 rounded-2xl shadow-sm text-[15px] leading-relaxed prose prose-sm max-w-none",
                      msg.role === 'user' 
                        ? "bg-primary text-white rounded-tr-none prose-p:text-white prose-strong:text-white" 
                        : "bg-white border border-gray-100 text-gray-800 rounded-tl-none prose-p:text-gray-800"
                    )}>
                      {msg.role === 'user' ? (
                        <p>{msg.content}</p>
                      ) : (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 max-w-[85%]"
                >
                  <div className="shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                      <Bot className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold px-1 text-primary">TourMate AI</span>
                    <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-gray-100 shadow-sm flex items-center gap-2 text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" /> Thinking...
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 shrink-0">
          <div className="max-w-3xl mx-auto relative">
            <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-gray-50 rounded-3xl border border-gray-200 p-2 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-sm">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about destinations, budgets, or guides..."
                className="w-full bg-transparent resize-none outline-none py-3 px-4 max-h-32 text-gray-800 placeholder:text-gray-400"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim()) {
                      handleSubmit();
                    }
                  }
                }}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="shrink-0 p-3 bg-primary text-white rounded-full hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:hover:bg-primary"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <div className="text-center mt-3">
              <span className="text-[10px] font-medium text-gray-400">AI responses may be inaccurate. Please verify important information.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

