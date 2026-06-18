'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { resetPassword } from '@/actions/auth';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsPending(true);
    setError('');

    const res = await resetPassword(token, password);
    
    if (res.error) {
      setError(res.error);
      setIsPending(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login?reset=success');
      }, 2000);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center max-w-sm">
          <div className="text-red-500 mb-4 font-bold">Invalid Reset Link</div>
          <Link href="/auth/forgot-password" className="text-primary hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-heading font-extrabold text-gray-900">New Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create a strong, new password for your account.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
            {success ? (
              <div className="text-center py-4">
                <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Password Updated!</h3>
                <p className="text-sm text-gray-500 mb-4">
                  You can now log in with your new password.
                </p>
                <div className="flex justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition-colors"
                  >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
