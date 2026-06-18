'use client';

import { useState, useTransition } from 'react';
import { updateGuideProfile } from '@/actions/guide-settings';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface GuideSettingsFormProps {
  initialData: {
    university: string;
    studentId: string;
    pricePerHour: number | null;
    pricePerDay: number | null;
  };
}

export function GuideSettingsForm({ initialData }: GuideSettingsFormProps) {
  const [university, setUniversity] = useState(initialData.university);
  const [studentId, setStudentId] = useState(initialData.studentId);
  const [pricePerHour, setPricePerHour] = useState(initialData.pricePerHour?.toString() || '');
  const [pricePerDay, setPricePerDay] = useState(initialData.pricePerDay?.toString() || '');
  
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(false);

    startTransition(async () => {
      const res = await updateGuideProfile({
        university,
        studentId,
        pricePerHour: pricePerHour ? parseFloat(pricePerHour) : undefined,
        pricePerDay: pricePerDay ? parseFloat(pricePerDay) : undefined,
      });
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
          <label className="block text-sm font-bold text-gray-700 mb-2">University / College</label>
          <input
            type="text"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Student ID Number</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            required
          />
        </div>
        
        <div className="md:col-span-2 pt-4 border-t border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Pricing Settings</h3>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Base Price Per Hour (₹)</label>
          <input
            type="number"
            value={pricePerHour}
            onChange={(e) => setPricePerHour(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Base Price Per Day (₹)</label>
          <input
            type="number"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
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
          {isPending ? 'Saving...' : 'Save Profile'}
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
