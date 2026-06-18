import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

export default function LoadingItinerary() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="inline-flex items-center gap-2 text-gray-400 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to My Trips
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-200 to-gray-300"></div>
        <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-2" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
        
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-100">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#F8FAFC] bg-gray-200 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
              <Skeleton className="h-8 w-1/2 mb-6" />
              
              <div className="space-y-6">
                {[1, 2].map((j) => (
                  <div key={j} className="pl-6 border-l-2 border-gray-100 pb-6 last:pb-0">
                    <Skeleton className="h-4 w-24 mb-3" />
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-4" />
                    <Skeleton className="h-6 w-20 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
