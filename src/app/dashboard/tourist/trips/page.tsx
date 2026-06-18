import { Suspense } from 'react';
import { getSavedItineraries } from '@/actions/itinerary';
import { getBookingsByUserId } from '@/lib/data/bookings';
import { auth } from '@/auth';
import { Calendar, MapPin, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { StartChatButton } from '@/components/dashboard/start-chat-button';

export default async function TripsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-gray-900 mb-2">My Trips & Itineraries</h1>
        <p className="text-gray-500">Manage your upcoming adventures and AI-generated plans.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Saved AI Itineraries
        </h2>
        <Suspense fallback={<TripsSkeleton />}>
          <SavedItinerariesList userId={session.user.id} />
        </Suspense>
      </div>
      
      <div className="pt-8 border-t border-gray-100 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" /> Booked Experiences
        </h2>
        <Suspense fallback={<TripsSkeleton />}>
          <BookedTripsList userId={session.user.id} />
        </Suspense>
      </div>
    </div>
  );
}

async function SavedItinerariesList({ userId }: { userId: string }) {
  const itineraries = await getSavedItineraries();

  if (!itineraries || itineraries.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center shadow-sm">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-gray-900 mb-2">No saved itineraries yet</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">Use our AI to generate a custom day-by-day plan for your dream Indian destination.</p>
        <Link href="/itinerary-generator" className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
          Generate an Itinerary
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {itineraries.map((itinerary) => {
        const data = itinerary.itineraryData as any;
        return (
          <div key={itinerary.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">
                {itinerary.days} Days
              </span>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1 pr-16 truncate">{data?.title || itinerary.destination}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
              <MapPin className="w-4 h-4" /> {itinerary.destination} • {itinerary.budget}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {itinerary.interests.map((interest: string) => (
                <span key={interest} className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded border border-gray-100">
                  {interest}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
              <span className="text-xs text-gray-400">Created {new Date(itinerary.createdAt).toLocaleDateString()}</span>
              <Link href={`/dashboard/tourist/trips/itinerary/${itinerary.id}`} className="text-primary hover:text-primary-600 text-sm font-bold flex items-center gap-1">
                View Details
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

async function BookedTripsList({ userId }: { userId: string }) {
  const bookings = await getBookingsByUserId(userId);
  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');

  if (!activeBookings || activeBookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <Calendar className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-gray-900 mb-2">No booked trips</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">You don't have any upcoming experiences booked. Start exploring destinations!</p>
        <Link href="/discover" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
          Explore Destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {activeBookings.map((booking) => (
        <div key={booking.id} className="bg-white flex flex-col sm:flex-row rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="w-full sm:w-48 h-48 sm:h-auto bg-gray-200 relative shrink-0">
            {booking.experience?.destination?.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={booking.experience.destination.coverImage} 
                alt="Destination"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-2 left-2">
              <span className={`text-xs font-bold px-2 py-1 rounded-md text-white ${
                booking.status === 'CONFIRMED' ? 'bg-green-500' : 'bg-yellow-500'
              }`}>
                {booking.status}
              </span>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-bold text-lg text-gray-900">{booking.experience?.title}</h3>
                <span className="font-bold text-primary">₹{booking.totalAmount}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(booking.startDate).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {booking.experience?.destination?.name}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="#" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg text-sm transition-colors border border-gray-200">
                Itinerary
              </Link>
              <StartChatButton bookingId={booking.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TripsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2].map(i => (
        <div key={i} className="bg-white rounded-2xl h-48 border border-gray-100 animate-pulse p-6">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="flex gap-2 mb-6">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
        </div>
      ))}
    </div>
  );
}
