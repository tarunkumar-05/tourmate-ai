'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, MapPin, User as UserIcon, CheckCircle2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { loginWithGoogle } from '@/actions/auth';

import { registerUser } from '@/actions/auth';

type RegisterStep = 'role' | 'details' | 'guide-details';

export default function RegisterPage() {
  const [step, setStep] = useState<RegisterStep>('role');
  const [role, setRole] = useState<'tourist' | 'guide' | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    university: '',
    studentId: ''
  });
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  
  const router = useRouter();

  const handleRoleSelect = (selectedRole: 'tourist' | 'guide') => {
    setRole(selectedRole);
    setStep('details');
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'guide' && step === 'details') {
      setStep('guide-details');
    } else {
      setIsPending(true);
      setError('');
      try {
        const res = await registerUser({ ...formData, role });
        if (res.success) {
          router.push('/auth/login?registered=true');
        } else {
          setError(res.error || 'Failed to register');
          setIsPending(false);
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
        setIsPending(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Left Panel - Image/Brand */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-dark text-white p-12 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=1600&h=900&fit=crop"
          alt="India Heritage"
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
          <h1 className="text-4xl font-heading font-bold mb-6 leading-tight">Join the new era of local tourism.</h1>
          <ul className="space-y-4 mb-10">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary-300 shrink-0 mt-0.5" />
              <span className="text-gray-200">Discover authentic, offbeat destinations</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary-300 shrink-0 mt-0.5" />
              <span className="text-gray-200">Connect with verified student guides</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary-300 shrink-0 mt-0.5" />
              <span className="text-gray-200">Get AI-powered personalized itineraries</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative py-12">
        <Link href="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <span className="font-heading font-bold text-xl text-gray-900">TourMate.ai</span>
        </Link>

        <div className="w-full max-w-md mx-auto">
          {/* Progress Bar */}
          <div className="mb-8 flex gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-primary"></div>
            <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step === 'details' || step === 'guide-details' ? 'bg-primary' : 'bg-gray-200'}`}></div>
            {role === 'guide' && (
              <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step === 'guide-details' ? 'bg-primary' : 'bg-gray-200'}`}></div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {step === 'role' && (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">How do you want to use TourMate?</h2>
                <p className="text-gray-500 mb-8">Select your primary role. You can always change this later.</p>

                <div className="space-y-4">
                  <button
                    onClick={() => handleRoleSelect('tourist')}
                    className="w-full text-left p-6 border-2 border-gray-200 hover:border-primary hover:bg-primary/5 rounded-2xl transition-all group flex items-start gap-4"
                  >
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <MapPin className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">I'm a Tourist</h3>
                      <p className="text-sm text-gray-500">I want to explore India, find hidden gems, and book local guides.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('guide')}
                    className="w-full text-left p-6 border-2 border-gray-200 hover:border-primary hover:bg-primary/5 rounded-2xl transition-all group flex items-start gap-4"
                  >
                    <div className="bg-green-100 text-green-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <UserIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">I'm a Student Guide</h3>
                      <p className="text-sm text-gray-500">I want to earn money by showing tourists my city and its culture.</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button onClick={() => setStep('role')} className="text-sm text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-1 font-medium">
                  ← Back to roles
                </button>
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">Create your account</h2>
                <p className="text-gray-500 mb-8">
                  Signing up as a <span className="font-bold text-gray-900 capitalize">{role}</span>.
                </p>

                <form onSubmit={handleNext} className="space-y-4">
                  {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                      <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                      <input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
                  </div>

                  <button disabled={isPending} type="submit" className="w-full py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 transition-colors mt-6 shadow-sm shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-50">
                    {role === 'guide' ? 'Next: Guide Details' : (isPending ? 'Creating...' : 'Create Account')}
                    {role === 'guide' && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>

                {role === 'tourist' && (
                  <div className="mt-6">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-surface text-gray-500 font-medium">Or continue with</span>
                      </div>
                    </div>
                    
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
                )}
              </motion.div>
            )}

            {step === 'guide-details' && (
              <motion.div
                key="guide-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button onClick={() => setStep('details')} className="text-sm text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-1 font-medium">
                  ← Back to details
                </button>
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">Student Verification</h2>
                <p className="text-gray-500 mb-8">We verify all student guides to ensure a safe and authentic experience for tourists.</p>

                <form onSubmit={handleNext} className="space-y-4">
                  {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">University/College</label>
                    <input type="text" required value={formData.university} onChange={e => setFormData({...formData, university: e.target.value})} placeholder="e.g. University of Delhi" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Student ID Number</label>
                    <input type="text" required value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Upload Student ID Card</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600 justify-center">
                          <span className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-600 focus-within:outline-none">
                            Upload a file
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Languages Spoken</label>
                    <input type="text" placeholder="e.g. English, Hindi, Telugu" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
                  </div>

                  <button disabled={isPending} type="submit" className="w-full py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 transition-colors mt-6 shadow-sm shadow-primary/30 disabled:opacity-50">
                    {isPending ? 'Creating...' : 'Complete Registration'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold text-primary hover:text-primary-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
