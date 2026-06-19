import { Suspense } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Compass, Calendar, MapPin, Star, Settings, LogOut, MessageSquare, CreditCard, Sparkles, Award, ArrowRight, ChevronRight } from 'lucide-react';
import { getBookingsByUserId } from '@/lib/data/bookings';
import { getFeaturedDestinations } from '@/lib/data/destinations';
import { logout } from '@/actions/auth';
import { Skeleton } from '@/components/ui/skeleton';

export default async function TouristDashboard() {
  const session = await auth();
  const user = session?.user;

  if (!session || (user as any)?.role?.toLowerCase() !== 'tourist') {
    return null; // Layout handles redirect/access denied
  }

  return (
    <Suspense fallback={<TouristDashboardSkeleton />}>
      <TouristDashboardContent userId={user?.id || ''} />
    </Suspense>
  );
}

// ----------------------------------------------------------------------
// DATA FETCHING COMPONENT
// ----------------------------------------------------------------------
async function TouristDashboardContent({ userId }: { userId: string }) {
  const bookings = await getBookingsByUserId(userId);
  const upcomingTrip = bookings.find(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const featuredDestinations = await getFeaturedDestinations();

  return (
    <>
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Places Visited</p>
              <h3 className="text-3xl font-heading font-extrabold text-gray-900">
                {bookings.filter(b => b.status === 'COMPLETED').length || 0}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Upcoming Trips</p>
              <h3 className="text-3xl font-heading font-extrabold text-gray-900">
                {bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length || 0}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 shadow-md text-white relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
            <Award className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <p className="text-primary-100 text-sm font-medium mb-1">Wanderer Points</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-heading font-extrabold">1,250</h3>
              <span className="text-sm text-primary-200 mb-1">pts</span>
            </div>
            <p className="text-xs text-primary-200 mt-2">250 pts to Gold Tier</p>
          </div>
        </div>
      </div>

      {/* Next Adventure / AI Box Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {upcomingTrip ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="h-32 relative bg-primary/20 flex items-center justify-center">
              {upcomingTrip.experience?.destination?.coverImage ? (
                <Image 
                  src={upcomingTrip.experience.destination.coverImage} 
                  alt="Destination" 
                  fill 
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <MapPin className="w-12 h-12 text-primary opacity-50" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <span className="bg-green-500 text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block">UPCOMING TRIP</span>
                <h3 className="font-heading font-bold text-xl">{upcomingTrip.experience?.title || `Guide Booking: ${(upcomingTrip as any).guide?.name || 'Local Guide'}`}</h3>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(upcomingTrip.startDate).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {upcomingTrip.experience?.destination?.name || 'Local Tour'}</span>
                </div>
                <p className="text-gray-600 line-clamp-2 text-sm">
                  {upcomingTrip.experience?.description || 'Get ready for your personalized tour with your verified local student guide.'}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                <Link href="#" className="flex-1 text-center py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors">
                  Itinerary
                </Link>
                <Link href="#" className="flex-1 text-center py-2 bg-primary hover:bg-primary-600 text-white font-medium rounded-lg text-sm transition-colors shadow-sm">
                  Message Guide
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">No upcoming trips</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">You don't have any booked experiences right now. Time to plan your next adventure!</p>
            <Link href="/discover" className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2">
              Explore Destinations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* AI Itinerary CTA */}
        <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl p-8 shadow-sm border border-primary-100 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 flex flex-col h-full justify-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary/20 p-2 rounded-lg text-primary">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="font-bold text-primary-800">TourMate AI</span>
            </div>
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-3">Plan your dream trip in seconds</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">Tell our AI what you love, and get a personalized, day-by-day itinerary complete with hidden gems and verified student guides.</p>
            <button className="self-start px-6 py-3 bg-white border border-primary-200 hover:border-primary hover:shadow-md text-primary-700 font-bold rounded-xl transition-all flex items-center gap-2 group-hover:bg-primary group-hover:text-white">
              Generate Itinerary
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Destinations */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-gray-900 flex items-center gap-2">
            Recommended Based on Your Interests
          </h2>
          <Link href="/discover" className="text-primary hover:text-primary-600 font-medium text-sm flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredDestinations.slice(0, 4).map((dest) => (
            <Link href={`/destinations/${dest.id}`} key={dest.id} className="group block h-64 rounded-2xl overflow-hidden relative shadow-sm hover:shadow-xl transition-all">
              <Image
                src={dest.coverImage}
                alt={dest.name}
                fill
                className="object-cover img-zoom"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              
              <div className="absolute top-4 left-4">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30 uppercase tracking-wider">
                  {dest.categories[0]}
                </span>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-2xl font-heading font-bold mb-1">{dest.name}</h3>
                <div className="flex items-center justify-between text-sm text-gray-200">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {dest.state}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400 font-bold">
                    <Star className="w-4 h-4 fill-current" /> {dest.rating}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

// ----------------------------------------------------------------------
// SKELETON COMPONENT
// ----------------------------------------------------------------------
function TouristDashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-32 flex flex-col justify-center">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-10 w-16" />
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-64">
          <Skeleton className="h-32 w-full rounded-t-2xl" />
          <div className="p-5">
            <Skeleton className="h-4 w-3/4 mb-3" />
            <Skeleton className="h-4 w-1/2 mb-6" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="h-10 flex-1 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-64 p-8 flex flex-col justify-center">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-8" />
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
      </div>

      <div className="mt-4">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-64 rounded-2xl w-full" />
          ))}
        </div>
      </div>
    </>
  );
}
