'use client';

import { useState, useTransition } from 'react';
import { updateProfile } from '@/actions/settings';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface SettingsFormProps {
  initialData: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [name, setName] = useState(initialData.name || '');
  const [phone, setPhone] = useState(initialData.phone || '');
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(false);

    startTransition(async () => {
      const res = await updateProfile({ name, phone });
      if (res.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={initialData.email || ''}
            disabled
            className="w-full border border-gray-100 bg-gray-50 rounded-xl p-3 text-sm text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Email is managed via Google Sign-In.</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 "
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="pt-4 flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-primary hover:bg-primary-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? 'Saving Changes...' : 'Save Changes'}
        </button>
        {isSaved && (
          <span className="text-green-600 flex items-center gap-1 text-sm font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" /> Saved!
          </span>
        )}
      </div>
    </form>
  );
}
