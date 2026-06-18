import { Construction } from 'lucide-react';

export function ComingSoon({ title, description }: { title: string, description: string }) {
  return (
    <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center h-[50vh]">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
        <Construction className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-heading font-bold text-gray-900 mb-3">{title}</h2>
      <p className="text-gray-500 max-w-md">{description}</p>
    </div>
  );
}
