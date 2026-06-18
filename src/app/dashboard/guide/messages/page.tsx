import { MessageCircle } from 'lucide-react';

export default function GuideMessagesIndexPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white/50 h-full">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6">
        <MessageCircle className="w-10 h-10" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Tourist Inquiries</h2>
      <p className="text-gray-500 max-w-sm">
        Select a conversation from the sidebar to respond to your tourists.
      </p>
    </div>
  );
}
