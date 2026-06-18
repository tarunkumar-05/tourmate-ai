import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { Shield, Users, Calendar, TrendingUp, AlertCircle, CheckCircle, Search, MoreVertical, X, Menu, Settings } from 'lucide-react';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { withTimeout } from '@/lib/utils';
import { mockUsers } from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';

export default async function AdminDashboard() {
  const session = await auth();
  const user = session?.user;

  if (!user || (user as any).role !== 'ADMIN') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6 text-center max-w-md">Please login as an Admin to view this dashboard.</p>
        <Link href="/auth/login" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-colors">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-32">
      {/* Header */}
      <div className="bg-dark text-white pt-16 pb-20 relative">
        <div className="absolute inset-0 bg-gradient-hero opacity-80 mix-blend-multiply"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-2">Admin Control Center</h1>
              <p className="text-white/80">Manage users, approve guides, and monitor platform activity.</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full font-bold transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" /> System Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <Suspense fallback={<AdminDashboardSkeleton />}>
          <AdminDashboardContent />
        </Suspense>
      </div>
    </div>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-32 w-full rounded-3xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
        <div>
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

async function AdminDashboardContent() {
  let guides = mockUsers.filter(u => u.role === 'guide');
  let totalUsers = 120;
  let totalBookings = 45;

  try {
    guides = await withTimeout(
      prisma.user.findMany({ where: { role: 'GUIDE' }, include: { guideProfile: true, profile: true } }) as any,
      3000,
      guides
    );
    totalUsers = await withTimeout(prisma.user.count(), 1000, totalUsers);
    totalBookings = await withTimeout(prisma.booking.count(), 1000, totalBookings);
  } catch(e) {}

  const pendingGuides = guides.filter(u => !u.guideProfile?.verified);

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center text-sm font-bold text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" /> +12%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Users</h3>
          <p className="text-3xl font-heading font-bold text-gray-900">{totalUsers}</p>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="w-6 h-6" />
            </div>
            <span className="flex items-center text-sm font-bold text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" /> +5%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Active Guides</h3>
          <p className="text-3xl font-heading font-bold text-gray-900">{guides.length}</p>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <span className="flex items-center text-sm font-bold text-gray-500">
              Needs Review
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Pending Approvals</h3>
          <p className="text-3xl font-heading font-bold text-gray-900">{pendingGuides.length}</p>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="flex items-center text-sm font-bold text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" /> +24%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Bookings</h3>
          <p className="text-3xl font-heading font-bold text-gray-900">{totalBookings}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Guide Approvals */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Pending Guide Approvals</h2>
                <p className="text-sm text-gray-500">Review and verify new guide applications.</p>
              </div>
              <span className="bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full text-sm">
                {pendingGuides.length} Action{pendingGuides.length !== 1 ? 's' : ''} Needed
              </span>
            </div>
            
            <div className="divide-y divide-gray-100">
              {pendingGuides.length > 0 ? (
                pendingGuides.map(guide => (
                  <div key={guide.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0">
                        {(guide.avatarUrl || (guide as any).image) ? (
                          <Image src={guide.avatarUrl || (guide as any).image || ''} alt="Guide" width={48} height={48} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary font-bold">{guide.profile?.firstName?.charAt(0)}</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          {guide.profile?.firstName} {guide.profile?.lastName}
                        </h4>
                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <span>{guide.profile?.location || 'Unknown Location'}</span>
                          <span>•</span>
                          <span>{guide.guideProfile?.university || 'University Not Listed'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm">
                        View Details
                      </button>
                      <button className="flex-1 sm:flex-none px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-colors text-sm flex items-center justify-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>All caught up! No pending guide applications.</p>
                </div>
              )}
            </div>
          </section>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-700 transition-colors flex items-center justify-between group">
                <span>Manage Categories</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-700 transition-colors flex items-center justify-between group">
                <span>Platform Settings</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-700 transition-colors flex items-center justify-between group">
                <span>View Reports</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
              </button>
            </div>
          </section>
        </div>
        
      </div>
    </>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
