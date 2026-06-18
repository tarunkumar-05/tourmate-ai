import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Clock, IndianRupee, MapPin, Calendar, Wallet, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ViewSavedItinerary({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  // Handle both Next.js 14 params object and Next.js 15+ params Promise
  const resolvedParams = await Promise.resolve(params);

  const savedItinerary = await prisma.savedItinerary.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!savedItinerary || savedItinerary.userId !== session.user.id) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm mt-8">
        <h2 className="text-xl font-bold mb-2">Itinerary Not Found</h2>
        <p className="text-gray-500 mb-6">This itinerary may have been deleted or you don't have access to it.</p>
        <Link href="/dashboard/tourist/trips" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 transition-colors">Back to My Trips</Link>
      </div>
    );
  }

  const itinerary = savedItinerary.itineraryData as any;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/dashboard/tourist/trips" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to My Trips
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-green-400 to-primary"></div>
        <h1 className="text-4xl font-heading font-extrabold text-gray-900 mb-3">{itinerary.title}</h1>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">{itinerary.description}</p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 border border-gray-100">
            <Calendar className="w-4 h-4 text-primary" /> {savedItinerary.days} Days
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 border border-gray-100">
            <Wallet className="w-4 h-4 text-primary" /> {savedItinerary.budget}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 border border-gray-100">
            <MapPin className="w-4 h-4 text-primary" /> {savedItinerary.destination}
          </div>
        </div>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
        {itinerary.days?.map((day: any) => (
          <div key={day.dayNumber} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#F8FAFC] bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
              {day.dayNumber}
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-xl text-gray-900 mb-6 pb-4 border-b border-gray-50">{day.theme}</h3>
              
              <div className="space-y-6">
                {day.activities?.map((activity: any, aIdx: number) => (
                  <div key={aIdx} className="relative pl-6 border-l-2 border-primary/20 pb-6 last:pb-0">
                    <div className="absolute w-3 h-3 rounded-full border-2 border-white bg-primary -left-[7px] top-1"></div>
                    <div className="flex items-center gap-2 text-xs font-bold text-primary mb-2">
                      <Clock className="w-3.5 h-3.5" /> {activity.time}
                    </div>
                    <h4 className="font-bold text-gray-900 text-base mb-2">{activity.title}</h4>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">{activity.description}</p>
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1.5 rounded-md">
                      <IndianRupee className="w-3.5 h-3.5" /> Est. ₹{activity.costEstimate}
                    </div>
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
