import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Star, ShieldCheck, GraduationCap, Languages, Calendar as CalendarIcon, MessageCircle } from 'lucide-react';
import { getGuideById } from '@/lib/data/guides';
import { prisma } from '@/lib/prisma';
import { CATEGORY_META } from '@/types';
import { mockExperiences, mockReviews } from '@/lib/mock-data';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GuideProfilePage({ params }: PageProps) {
  const { id } = await params;
  const guide = await getGuideById(id);
  
  if (!guide || !guide.guideProfile) {
    notFound();
  }

  const guideExperiences: any[] = mockExperiences.filter(e => e.guideId === guide.id);
  const guideReviews: any[] = mockReviews.filter(r => r.targetUserId === guide.id);

  return (
    <div className="min-h-screen bg-surface pb-32">
      {/* Cover Photo */}
      <div className="h-64 md:h-80 w-full bg-gradient-mesh relative">
        <div className="absolute inset-0 bg-dark/20 mix-blend-multiply"></div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Profile Area */}
          <div className="flex-1">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8 relative">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white shrink-0 mt-[-60px] sm:mt-0 relative">
                  {(guide.avatarUrl || guide.image) ? (
                    <Image 
                      src={guide.avatarUrl || guide.image || ''} 
                      alt={guide.profile?.firstName || ''} 
                      fill 
                      className="object-cover" 
                      unoptimized 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-bold text-4xl bg-gray-200">{guide.profile?.firstName?.charAt(0)}</div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-heading font-extrabold text-gray-900 flex items-center gap-2">
                        {guide.profile.firstName} {guide.profile.lastName}
                        {guide.guideProfile.verified && (
                          <ShieldCheck className="w-6 h-6 text-primary" />
                        )}
                      </h1>
                      <div className="flex items-center gap-2 text-gray-500 mt-1 mb-4 font-medium">
                        <MapPin className="w-4 h-4" /> {guide.profile?.location}
                      </div>
                    </div>
                    <div className="hidden sm:flex gap-3">
                      <button className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-100 mb-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Rating</span>
                      <div className="flex items-center gap-1 font-bold text-gray-900">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                        {guide.guideProfile.avgRating} <span className="text-gray-400 font-normal">({guide.guideProfile.totalReviews})</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Total Tours</span>
                      <div className="font-bold text-gray-900">{guide.guideProfile.totalBookings}</div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Experience</span>
                      <div className="font-bold text-gray-900">{guide.guideProfile.yearsOfExperience} Years</div>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {guide.profile?.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* University & Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                  <GraduationCap className="w-5 h-5 text-primary" /> Education
                </h3>
                <p className="text-gray-700 font-medium">{guide.guideProfile.university}</p>
                <p className="text-sm text-gray-500 mt-1">Student / Alumnus</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                  <Languages className="w-5 h-5 text-primary" /> Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {guide.profile?.languages?.map((lang: string) => (
                    <span key={lang} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Specializations</h2>
              <div className="flex flex-wrap gap-3">
                {guide.guideProfile?.specializations?.map((spec: string) => {
                    const meta = CATEGORY_META[spec as any] || { emoji: '✨', color: '#0B6E4F' };
                  return (
                    <div key={spec} className="px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-white" style={{ backgroundColor: meta.color }}>
                      <span>{meta.emoji}</span> {spec}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Experiences by this guide */}
            {guideExperiences.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Experiences by {guide.profile?.firstName}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {guideExperiences.map(exp => (
                    <Link key={exp.id} href={`/experiences/${exp.id}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm block card-hover">
                      <div className="relative h-48 bg-gray-200">
                        <Image src={exp.coverImage} alt={exp.title} fill className="object-cover" unoptimized />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-900 shadow-sm">
                          ₹{exp.pricePerPerson} / person
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="text-xs text-primary font-bold uppercase mb-1">{exp.category.replace('_', ' ')}</div>
                        <h3 className="font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-primary transition-colors">{exp.title}</h3>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" /> {exp.avgRating}</span>
                          <span>{exp.duration / 60} hours</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar / Booking */}
          <div className="lg:w-[350px] shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-24">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <p className="text-gray-500 text-sm font-bold uppercase mb-1">Guide Rate</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-gray-900">₹{guide.guideProfile.pricePerHour}</span>
                  <span className="text-gray-500 font-medium">/ hour</span>
                </div>
              </div>

              <button className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary/20 mb-4 flex items-center justify-center gap-2">
                <CalendarIcon className="w-5 h-5" /> Request Booking
              </button>
              
              <button className="w-full bg-gray-50 text-gray-700 border border-gray-200 font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" /> Message Guide
              </button>

              <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500 text-center">
                <ShieldCheck className="w-4 h-4 mx-auto mb-2 text-green-500" />
                Payments are securely held until the tour is completed.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
