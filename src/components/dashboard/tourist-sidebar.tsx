'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Calendar, Star, Settings, LogOut, MessageSquare, CreditCard } from 'lucide-react';
import { logout } from '@/actions/auth';
import { cn } from '@/lib/utils';

export function TouristSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard/tourist', icon: Compass },
    { name: 'My Trips', href: '/dashboard/tourist/trips', icon: Calendar },
    { name: 'Messages', href: '/dashboard/tourist/messages', icon: MessageSquare },
    { name: 'Reviews', href: '/dashboard/tourist/reviews', icon: Star },
    { name: 'Payments', href: '/dashboard/tourist/payments', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/tourist/settings', icon: Settings },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-gray-200/50 border border-white p-4 sticky top-24">
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all",
                isActive 
                  ? "bg-gradient-to-r from-primary/10 to-transparent text-primary font-bold border-l-4 border-primary" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
              )}
            >
              <Icon className="w-5 h-5" /> {item.name}
            </Link>
          );
        })}
        
        <div className="pt-4 mt-4 border-t border-gray-100">
          <form action={logout}>
            <button type="submit" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold rounded-xl transition-colors w-full text-left">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
}
