import { Suspense } from 'react';
import { getPendingReviews, getUserReviews } from '@/actions/reviews';
import { Star, MapPin, Calendar, Edit3 } from 'lucide-react';
import Image from 'next/image';
import { ReviewFormClient } from '@/components/dashboard/review-form-client';

export default async function ReviewsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-gray-900 mb-2">My Reviews</h1>
        <p className="text-gray-500">Rate your past experiences and view your review history.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-primary" /> Pending Reviews
        </h2>
        <Suspense fallback={<ReviewsSkeleton />}>
          <PendingReviewsList />
        </Suspense>
      </div>
      
      <div className="pt-8 border-t border-gray-100 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" fill="currentColor" /> Past Reviews
        </h2>
        <Suspense fallback={<ReviewsSkeleton />}>
          <PastReviewsList />
        </Suspense>
      </div>
    </div>
  );
}

async function PendingReviewsList() {
  const pending = await getPendingReviews();

  if (!pending || pending.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center shadow-sm">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
          <Edit3 className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-gray-900 mb-2">You're all caught up!</h3>
        <p className="text-gray-500 text-sm">You have no pending reviews. Complete a trip to leave feedback.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {pending.map((booking) => (
        <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1">{booking.experience?.title}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {booking.experience?.destination?.name}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(booking.startDate).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4 md:mb-0">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 relative">
                 {booking.guide.image ? (
                   <Image src={booking.guide.image} alt={booking.guide.name || 'Guide'} fill className="object-cover" />
                 ) : (
                   <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold">
                     {booking.guide.name?.charAt(0) || 'G'}
                   </div>
                 )}
              </div>
              <div>
                <p className="text-xs text-gray-500">Your Guide</p>
                <p className="text-sm font-bold text-gray-900">{booking.guide.name}</p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-[400px] shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
             <ReviewFormClient 
                bookingId={booking.id} 
                targetUserId={booking.guideId}
                destinationId={booking.destinationId || undefined}
                experienceId={booking.experienceId || undefined}
             />
          </div>
        </div>
      ))}
    </div>
  );
}

async function PastReviewsList() {
  const reviews = await getUserReviews();

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center shadow-sm">
        <h3 className="font-bold text-gray-900 mb-2">No past reviews</h3>
        <p className="text-gray-500 text-sm">Reviews you write will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">{review.experience?.title || review.destination?.name || 'Experience'}</h3>
              <p className="text-xs text-gray-500">Rated {review.targetUser?.name}</p>
            </div>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-3">"{review.comment}"</p>
          <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">
            Posted on {new Date(review.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="bg-white rounded-2xl h-48 border border-gray-100 animate-pulse p-6"></div>
  );
}
