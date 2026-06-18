'use client';

import { useState, useActionState } from 'react';
import Link from 'next/link';
import { Compass, Mail, Lock, Phone } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { login, loginWithGoogle } from '@/actions/auth';

const initialState = {
  error: '',
};

export default function LoginPage() {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image/Brand */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-dark text-white p-12 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&h=900&fit=crop"
          alt="India Landscape"
          fill
          className="object-cover opacity-30 mix-blend-overlay"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80 mix-blend-multiply"></div>
        
        <Link href="/" className="flex items-center gap-2 relative z-10 w-fit group">
          <div className="bg-primary p-2 rounded-xl group-hover:bg-primary-light transition-colors">
            <Compass className="w-8 h-8 text-white" />
          </div>
          <span className="font-heading font-bold text-3xl tracking-tight">
            TourMate<span className="text-primary-300">.ai</span>
          </span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-heading font-bold mb-6 leading-tight">Welcome back to your next adventure.</h1>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">Discover hidden gems, connect with local student guides, and experience India like never before.</p>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl relative">
            <div className="absolute -top-4 -left-4 text-4xl text-primary-300 opacity-50 font-serif">"</div>
            <p className="italic text-gray-200 mb-4 relative z-10">"TourMate completely changed how I travel. I explored places in Kerala I wouldn't have found on any other platform, guided by an amazing local student."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                <Image src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" width={40} height={40} unoptimized />
              </div>
              <div>
                <p className="font-bold text-sm">Sarah Jenkins</p>
                <p className="text-xs text-gray-400">Traveler from UK</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-surface relative">
        <Link href="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 group">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <Compass className="w-6 h-6 text-primary" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-gray-900">TourMate</span>
        </Link>

        <div className="w-full max-w-sm mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">Sign in</h2>
            <p className="text-gray-500 mb-8">Enter your details to access your account.</p>

            {/* Auth Method Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${authMethod === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                onClick={() => setAuthMethod('email')}
              >
                Email
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${authMethod === 'phone' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                onClick={() => setAuthMethod('phone')}
              >
                Phone (OTP)
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              {state?.error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {state.error}
                </div>
              )}
              {authMethod === 'email' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Password</label>
                      <Link href="/auth/forgot-password" className="text-xs font-medium text-primary hover:text-primary-600">Forgot password?</Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">+91</span>
                    </div>
                    <input
                      type="tel"
                      className="block w-full pl-20 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                      placeholder="98765 43210"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70"
              >
                {isPending ? 'Signing in...' : (authMethod === 'email' ? 'Sign in' : 'Send OTP')}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <form action={loginWithGoogle}>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </button>
                </form>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-bold text-primary hover:text-primary-600 hover:underline">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
