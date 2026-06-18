import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Star, Clock, Calendar, CheckCircle2, ShieldCheck, Users } from 'lucide-react';
import { getExperienceById } from '@/lib/data/experiences';
import { formatCurrency } from '@/lib/utils';
import { BookingWidget } from '@/components/experiences/booking-widget';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExperienceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const experience = await getExperienceById(id);
  
  if (!experience) {
    notFound();
  }

  const expReviews = experience.reviews;

  return (
    <div className="min-h-screen bg-surface pb-32">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-dark">
        <Image
          src={experience.coverImage || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=80'}
          alt={experience.title}
          fill
          className="object-cover opacity-70"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
          <div className="container mx-auto">
            <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded mb-4">
              {experience.category.replace('_', ' ')}
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4 max-w-4xl leading-tight">
              {experience.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/90 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-gray-200">
                  {(experience.guide.avatarUrl || experience.guide.image) ? (
                    <Image src={experience.guide.avatarUrl || experience.guide.image || ''} alt={experience.guide.profile?.firstName || ''} width={32} height={32} className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-bold">{experience.guide.profile?.firstName?.charAt(0)}</div>
                  )}
                </div>
                <span>Hosted by <Link href={`/guides/${experience.guideId}`} className="text-white font-bold hover:underline">{experience.guide.profile?.firstName}</Link></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{experience.avgRating}</span>
                <span className="text-white/60">({experience.totalBookings} bookings)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary-300" />
                <span>{experience.guide.profile?.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <div className="flex-1 space-y-12">
            
            {/* Quick Info Bar */}
            <div className="flex flex-wrap items-center gap-y-6 gap-x-12 py-6 border-y border-gray-100">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500 font-bold uppercase">Duration</div>
                  <div className="font-medium text-gray-900">{(experience.duration / 60).toFixed(1)} hours</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500 font-bold uppercase">Group Size</div>
                  <div className="font-medium text-gray-900">Up to {experience.maxGroupSize} people</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500 font-bold uppercase">Availability</div>
                  <div className="font-medium text-primary">Check Calendar</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What you'll do</h2>
              <div className="prose prose-lg text-gray-600">
                <p>{experience.description}</p>
                <p>Join me for an authentic local experience that goes beyond the standard tourist trails. I'll share my passion for my city, its history, and its culture with you.</p>
              </div>
            </section>

            {/* Highlights */}
            {experience.highlights && experience.highlights.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Highlights</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {experience.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Meet your Guide */}
            <section className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet your guide, {experience.guide.profile?.firstName}</h2>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 bg-gray-200">
                  {(experience.guide.avatarUrl || experience.guide.image) ? (
                    <Image src={experience.guide.avatarUrl || experience.guide.image || ''} alt={experience.guide.profile?.firstName || ''} width={96} height={96} className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-bold text-2xl">{experience.guide.profile?.firstName?.charAt(0)}</div>
                  )}
                </div>
                <div>
                  <p className="text-gray-700 mb-4">
                    "I am a student at {experience.guide.guideProfile?.university} with a passion for {experience.guide.guideProfile?.specializations?.slice(0, 2).join(' and ') || 'traveling'}. I love showing travelers the hidden gems of my city!"
                  </p>
                  <div className="flex gap-4">
                    <Link href={`/guides/${experience.guideId}`} className="text-primary font-bold hover:underline">View Full Profile</Link>
                  </div>
                </div>
              </div>
            </section>

          </div>
          
          {/* Booking Card */}
          <div className="lg:w-[380px] shrink-0">
            <BookingWidget experience={experience} />
          </div>

        </div>
      </div>

    </div>
  );
}
