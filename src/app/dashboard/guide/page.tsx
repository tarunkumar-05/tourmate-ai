import { Suspense } from 'react';
import { auth } from '@/auth';
import Link from 'next/link';
import { Wallet, CalendarCheck, Star, TrendingUp, Users, Briefcase, MessageSquare } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getBookingsByGuideId } from '@/lib/data/bookings';
import { prisma } from '@/lib/prisma';
import { Skeleton } from '@/components/ui/skeleton';

export default async function GuideDashboard() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return (
    <Suspense fallback={<GuideDashboardSkeleton />}>
      <GuideOverviewContent userId={session.user.id} />
    </Suspense>
  );
}

async function GuideOverviewContent({ userId }: { userId: string }) {
  const bookings = await getBookingsByGuideId(userId);
  
  const guideProfile = await prisma.guideProfile.findUnique({
    where: { userId }
  });

  const totalEarnings = guideProfile?.totalEarnings || 0;
  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
  const totalReviews = guideProfile?.totalReviews || 0;
  const avgRating = guideProfile?.avgRating || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-gray-900 mb-1">Overview</h2>
        <p className="text-gray-500">Here's what's happening with your guide business today.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> +12%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Total Earnings</p>
          <h3 className="text-2xl font-heading font-extrabold text-gray-900">{formatCurrency(totalEarnings)}</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Active Bookings</p>
          <h3 className="text-2xl font-heading font-extrabold text-gray-900">{activeBookings}</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Average Rating</p>
          <h3 className="text-2xl font-heading font-extrabold text-gray-900 flex items-baseline gap-1">
            {avgRating.toFixed(1)} <span className="text-sm font-medium text-gray-500">({totalReviews} reviews)</span>
          </h3>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Tourists Guided</p>
          <h3 className="text-2xl font-heading font-extrabold text-gray-900">{guideProfile?.totalBookings || 0}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Recent Booking Requests</h3>
            <Link href="/dashboard/guide/bookings" className="text-sm font-bold text-primary hover:text-primary-600 transition-colors">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {bookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold">
                      {booking.tourist?.name?.charAt(0) || 'T'}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{booking.experience?.title || 'Tour'}</h4>
                    <p className="text-xs text-gray-500">{booking.tourist?.name} • {new Date(booking.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-gray-900">{formatCurrency(booking.totalAmount)}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
            
            {bookings.length === 0 && (
              <div className="text-center py-6 text-gray-500 text-sm">
                No recent booking requests.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/guide/experiences" className="flex flex-col items-center justify-center p-6 border border-gray-100 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all group">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-900 text-sm">Manage Tours</span>
            </Link>
            
            <Link href="/dashboard/guide/messages" className="flex flex-col items-center justify-center p-6 border border-gray-100 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all group">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-900 text-sm">Read Messages</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuideDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}
