'use client';

import { useTransition } from 'react';
import { updateBookingStatus } from '@/actions/guide-bookings';
import { Check, X, Loader2 } from 'lucide-react';

export function BookingActions({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleAction = (status: 'CONFIRMED' | 'CANCELLED') => {
    startTransition(async () => {
      await updateBookingStatus(bookingId, status);
    });
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button 
        onClick={() => handleAction('CANCELLED')}
        disabled={isPending}
        className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-50"
        title="Decline"
      >
        <X className="w-5 h-5" />
      </button>
      <button 
        onClick={() => handleAction('CONFIRMED')}
        disabled={isPending}
        className="px-4 py-2 bg-primary text-white font-bold rounded-xl flex items-center gap-2 hover:bg-primary-600 transition-colors disabled:opacity-50 shadow-sm"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        Accept
      </button>
    </div>
  );
}
