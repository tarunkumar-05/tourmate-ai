import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Wallet, TrendingUp, IndianRupee, Clock, ArrowDownToLine, Landmark } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default async function GuideEarningsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const guideProfile = await prisma.guideProfile.findUnique({
    where: { userId: session.user.id }
  });

  const bookings = await prisma.booking.findMany({
    where: { guideId: session.user.id, status: { in: ['COMPLETED', 'CONFIRMED'] } },
    orderBy: { createdAt: 'desc' },
    include: { experience: { select: { title: true } } }
  });

  const totalEarnings = guideProfile?.totalEarnings || 0;
  
  // Pending earnings are from CONFIRMED bookings that haven't happened/completed yet
  const pendingEarnings = bookings
    .filter(b => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + b.guideEarnings, 0);

  // Available for withdrawal are COMPLETED bookings
  const availableEarnings = bookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.guideEarnings, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-gray-900 mb-2">Earnings & Payouts</h1>
          <p className="text-gray-500">Track your revenue, pending balances, and withdrawal history.</p>
        </div>
        <button className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 shrink-0">
          <ArrowDownToLine className="w-5 h-5" /> Withdraw Funds
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white shadow-lg shadow-green-500/20 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-2 text-green-100 font-bold mb-4 text-sm uppercase">
            <IndianRupee className="w-4 h-4" /> Available Balance
          </div>
          <div className="text-4xl font-extrabold mb-2 tracking-tight">{formatCurrency(availableEarnings)}</div>
          <div className="text-green-100 text-sm">Ready to be withdrawn to your bank</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 text-gray-500 font-bold mb-4 text-sm uppercase">
            <Clock className="w-4 h-4" /> Pending in Escrow
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">{formatCurrency(pendingEarnings)}</div>
          <div className="text-gray-500 text-sm">From upcoming confirmed trips</div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 text-gray-500 font-bold mb-4 text-sm uppercase">
            <Wallet className="w-4 h-4" /> Lifetime Earnings
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">{formatCurrency(totalEarnings)}</div>
          <div className="text-gray-500 text-sm">Since joining TourMate</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Payout Bank Details</h2>
          <span className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full border border-green-100">Verified</span>
        </div>
        <div className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-gray-900">HDFC Bank ending in •••• 4589</p>
            <p className="text-sm text-gray-500">Ravi Kumar</p>
          </div>
          <button className="ml-auto px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-lg text-sm transition-colors border border-gray-200">
            Update Details
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Earnings History</h2>
        </div>
        
        {bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No earning history found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4 border-b border-gray-100">Date</th>
                  <th className="px-6 py-4 border-b border-gray-100">Tour</th>
                  <th className="px-6 py-4 border-b border-gray-100">Status</th>
                  <th className="px-6 py-4 border-b border-gray-100 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(booking.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {booking.experience?.title || 'Custom Tour'}
                    </td>
                    <td className="px-6 py-4">
                      {booking.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-md">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 text-xs font-bold px-2 py-1 rounded-md">
                          Escrow
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
