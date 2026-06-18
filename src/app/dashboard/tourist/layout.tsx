import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { TouristSidebar } from '@/components/dashboard/tourist-sidebar';

export default async function TouristDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  if (!session || (user as any)?.role?.toLowerCase() !== 'tourist') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6 text-center max-w-md">Please login as a Tourist to view your dashboard.</p>
        <Link href="/auth/login" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-colors">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Premium Header */}
      <div className="bg-dark text-white pt-16 pb-24 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1506461883276-594540eb36b4?w=1600&h=400&fit=crop"
          alt="Dashboard Cover"
          fill
          className="object-cover opacity-20 mix-blend-overlay"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-dark/90 mix-blend-multiply"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white/20 overflow-hidden bg-white/10 backdrop-blur-sm relative z-10">
                {user?.image ? (
                  <Image src={user.image} alt={user.name || 'User'} width={96} height={96} className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-3xl font-bold">
                    {user?.name?.charAt(0) || 'T'}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-primary-400 blur-xl opacity-50 rounded-full animate-pulse z-0"></div>
            </div>
            <div className="text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-primary-200 mb-2 border border-white/10">
                EXPLORER TIER
              </div>
              <h1 className="text-4xl font-heading font-extrabold mb-1 text-white">Welcome back, {user?.name}!</h1>
              <p className="text-gray-300 text-lg">Your next great Indian adventure awaits.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Menu */}
          <div className="w-full lg:w-64 shrink-0 -mt-12 relative z-30">
            <TouristSidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-8 pt-6 pb-12">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
