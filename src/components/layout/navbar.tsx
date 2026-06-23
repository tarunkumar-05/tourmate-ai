'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Sparkles, Bell, Menu, X, User as UserIcon } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const user = session?.user;
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Discover', href: '/discover' },
    { label: 'Guides', href: '/guides' },
    { label: 'Experiences', href: '/experiences' },
    { label: 'Events', href: '/events' },
    { label: 'AI Itinerary', href: '/itinerary-generator' },
    { label: 'Hidden Gems', href: '/hidden-gems' },
    { label: 'Community', href: '/community' },
  ];

  const isDashboard = pathname?.startsWith('/dashboard');
  const isSolid = isScrolled || isDashboard;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
        isSolid ? 'bg-white/80 backdrop-blur-md shadow-sm border-gray-200 py-3' : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Compass className="w-6 h-6 text-primary" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">
              <span className="gradient-text">TourMate</span>
              <span className="ml-1 bg-primary text-white text-[10px] uppercase px-2 py-0.5 rounded-full relative -top-1">
                AI
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary relative',
                    isActive ? 'text-primary' : 'text-gray-600'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* AI Assistant Button */}
            <Link
              href="/ai-assistant"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full transition-all group"
            >
              <Sparkles className="w-4 h-4 group-hover:animate-pulse-glow" />
              <span>Ask AI</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button className="relative p-2 text-gray-500 hover:text-primary transition-colors hidden md:block">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt=""
                        width={36}
                        height={36}
                        className="rounded-full object-cover border-2 border-white shadow-sm bg-gray-100"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name?.split(' ')[0]}</span>
                  </button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 mb-2">
                          <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <Link
                          href={`/dashboard/${(user as any)?.role?.toLowerCase() || 'tourist'}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href={`/dashboard/${(user as any)?.role?.toLowerCase() || 'tourist'}/settings`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Settings
                        </Link>
                        <div className="h-px bg-gray-100 my-2"></div>
                        <button
                          onClick={() => {
                            signOut();
                            setIsProfileDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : status === 'loading' ? (
              <div className="hidden lg:flex items-center gap-3">
                <div className="w-16 h-8 bg-gray-100 animate-pulse rounded-md"></div>
                <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-full"></div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary px-3 py-2 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-medium text-white bg-primary hover:bg-primary-600 px-4 py-2 rounded-full transition-colors shadow-sm shadow-primary/20"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-4 py-3 rounded-lg text-base font-medium transition-colors',
                      pathname === link.href || pathname.startsWith(`${link.href}/`)
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              
              {!isAuthenticated && status !== 'loading' && (
                <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                  <Link
                    href="/auth/login"
                    className="w-full py-3 text-center text-primary font-medium border border-primary rounded-lg"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="w-full py-3 text-center text-white bg-primary font-medium rounded-lg"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
