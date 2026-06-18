import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Calendar as CalendarIcon, CheckCircle2, Clock, XCircle, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { BookingActions } from '@/components/dashboard/booking-actions';

export default async function GuideBookingsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const bookings = await prisma.booking.findMany({
    where: { guideId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      experience: { select: { title: true } },
      tourist: { select: { name: true, image: true } },
      destination: { select: { name: true } }
    }
  });

  const pendingBookings = bookings.filter(b => b.status === 'PENDING');
  const pastBookings = bookings.filter(b => b.status !== 'PENDING');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-gray-900 mb-2">Bookings Manager</h1>
        <p className="text-gray-500">Review requests, manage your schedule, and view past trips.</p>
      </div>

      {pendingBookings.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span> Action Required
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {pendingBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-2xl border-2 border-yellow-100 shadow-sm p-6 flex flex-col md:flex-row gap-6 md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">New Request</span>
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" /> {new Date(booking.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{booking.experience?.title || 'Custom Tour'}</h3>
                  <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" /> {booking.destination?.name || 'Local'}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 overflow-hidden">
                      {booking.tourist?.image ? <img src={booking.tourist.image} alt="Tourist" /> : booking.tourist?.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tourist</p>
                      <p className="text-sm font-bold text-gray-900">{booking.tourist?.name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:border-l border-gray-100 md:pl-6 shrink-0 flex flex-col justify-between h-full">
                  <div className="mb-4 text-left md:text-right">
                    <p className="text-xs text-gray-500 mb-1">Your Earnings</p>
                    <p className="text-2xl font-extrabold text-gray-900">{formatCurrency(booking.guideEarnings)}</p>
                  </div>
                  <BookingActions bookingId={booking.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">All Bookings</h2>
        </div>
        
        {pastBookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No historical bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4 border-b border-gray-100">Tour / Date</th>
                  <th className="px-6 py-4 border-b border-gray-100">Tourist</th>
                  <th className="px-6 py-4 border-b border-gray-100">Status</th>
                  <th className="px-6 py-4 border-b border-gray-100 text-right">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pastBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{booking.experience?.title || 'Custom Tour'}</p>
                      <p className="text-xs text-gray-500">{new Date(booking.startDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {booking.tourist?.name}
                    </td>
                    <td className="px-6 py-4">
                      {booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-md border border-green-100">
                          <CheckCircle2 className="w-3 h-3" /> {booking.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-bold px-2 py-1 rounded-md border border-red-100">
                          <XCircle className="w-3 h-3" /> {booking.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                      {formatCurrency(booking.guideEarnings)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
