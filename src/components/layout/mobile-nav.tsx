'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Sparkles, Calendar, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

export function MobileNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show when scrolling up or at top, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Compass, label: 'Discover', href: '/discover' },
    { icon: Sparkles, label: 'AI Chat', href: '/ai-assistant', isAction: true },
    { icon: Calendar, label: 'Bookings', href: user ? `/dashboard/${(user as any).role?.toLowerCase() || 'tourist'}/bookings` : '/auth/login' },
    { icon: User, label: 'Profile', href: user ? `/dashboard/${(user as any).role?.toLowerCase() || 'tourist'}` : '/auth/login' },
  ];

  return (
    <div 
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 pb-safe",
        isVisible ? "translate-y-0" : "translate-y-[150%]"
      )}
    >
      <div className="bg-white/90 backdrop-blur-lg border-t border-gray-200/50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-2xl px-6 py-2">
        <nav className="flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            if (item.isAction) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative -top-5 flex flex-col items-center justify-center p-3 rounded-full bg-primary text-white shadow-lg shadow-primary/30"
                >
                  <Icon className="w-6 h-6 animate-pulse-glow" />
                </Link>
              );
            }
            
            return (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 min-w-[64px] transition-colors",
                  isActive ? "text-primary" : "text-gray-500 hover:text-gray-900"
                )}
              >
                <div className={cn(
                  "relative mb-1 transition-transform",
                  isActive ? "transform scale-110" : ""
                )}>
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : ""
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
