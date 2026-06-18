'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createBooking } from '@/actions/tourist-bookings';
import { formatCurrency } from '@/lib/utils';
import { ShieldCheck, Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-primary text-white text-lg font-bold py-4 rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary/20 mb-4 flex items-center justify-center gap-2 disabled:opacity-70"
    >
      {pending && <Loader2 className="w-5 h-5 animate-spin" />}
      {pending ? 'Confirming Booking...' : 'Book Experience'}
    </button>
  );
}

export function BookingWidget({ experience }: { experience: any }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-6 md:p-8 sticky top-24">
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-gray-900">{formatCurrency(experience.pricePerPerson)}</span>
          <span className="text-gray-500 font-medium">/ person</span>
        </div>
      </div>

      <form action={createBooking}>
        <div className="space-y-4 mb-6">
          <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
            <label className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50">
              <div className="font-bold text-gray-900 text-sm uppercase tracking-wide">Date</div>
              <input 
                type="date" 
                name="bookingDate" 
                required 
                min={new Date().toISOString().split('T')[0]} 
                className="text-primary font-medium text-sm bg-transparent border-none focus:ring-0 cursor-pointer text-right outline-none"
              />
            </label>
            <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
              <div className="font-bold text-gray-900 text-sm uppercase tracking-wide">Guests</div>
              <select name="guests" className="text-gray-600 font-medium text-sm bg-transparent border-none focus:ring-0 outline-none text-right cursor-pointer">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <input type="hidden" name="experienceId" value={experience.id} />
        <input type="hidden" name="guideId" value={experience.guideId} />
        <input type="hidden" name="price" value={experience.pricePerPerson} />
        
        <SubmitButton />
      </form>
      
      <div className="text-center text-sm text-gray-500 mb-6">
        You won't be charged yet
      </div>

      <div className="pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-600">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <span className="font-medium">100% Student Verified</span>
      </div>
    </div>
  );
}
