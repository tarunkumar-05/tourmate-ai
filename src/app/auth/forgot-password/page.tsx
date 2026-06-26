'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { requestPasswordReset } from '@/actions/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError('');

    const res = await requestPasswordReset(email);
    
    if (res.error) {
      setError(res.error);
      setIsPending(false);
    } else {
      setSuccess(true);
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-heading font-extrabold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive a reset link.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
            {success ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Check your email</h3>
                <p className="text-sm text-gray-500 mb-6">
                  We have sent a password reset link to <br/>
                  <span className="font-medium text-gray-900">{email}</span>
                </p>
                <Link href="/auth/login" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 transition-colors">
                  Return to Login
                </Link>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition-colors"
                  >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                  </button>
                </div>
                
                <div className="text-center mt-4">
                  <Link href="/auth/login" className="text-sm font-medium text-primary hover:text-primary-600 flex items-center justify-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
