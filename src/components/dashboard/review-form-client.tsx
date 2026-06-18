'use client';

import { useState, useTransition } from 'react';
import { submitReview } from '@/actions/reviews';
import { Star, Loader2, CheckCircle2 } from 'lucide-react';

interface ReviewFormClientProps {
  bookingId: string;
  targetUserId?: string;
  destinationId?: string;
  experienceId?: string;
}

export function ReviewFormClient({ bookingId, targetUserId, destinationId, experienceId }: ReviewFormClientProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      setError('Please leave a comment');
      return;
    }

    setError('');
    
    startTransition(async () => {
      const res = await submitReview({
        bookingId,
        rating,
        comment,
        targetUserId,
        destinationId,
        experienceId,
      });

      if (res.success) {
        setIsSubmitted(true);
      } else {
        setError(res.error || 'Failed to submit review');
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-gray-900 mb-1">Review Submitted!</h4>
        <p className="text-sm text-gray-500">Thank you for sharing your experience.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">Rate your experience</label>
        <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110"
              onMouseEnter={() => setHovered(star)}
              onClick={() => setRating(star)}
            >
              <Star 
                className={`w-7 h-7 ${(hovered || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
              />
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4 flex-1">
        <label className="block text-sm font-bold text-gray-700 mb-2">Leave a comment</label>
        <textarea 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How was the guide? Was the destination what you expected?"
          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-24"
        ></textarea>
        {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full py-2.5 bg-primary hover:bg-primary-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {isPending ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
