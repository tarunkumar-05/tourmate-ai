'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MapPin, Star, Filter, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CATEGORY_META } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export default function GuidesClient({ initialGuides }: { initialGuides: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const guides = initialGuides;

  const filteredGuides = guides.filter(guide => 
    guide.profile?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.profile?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.profile?.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.guideProfile?.university?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Hero Section */}
      <div className="bg-dark text-white pt-16 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-80 mix-blend-multiply"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Find Your Perfect Local Guide</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">Connect with verified university students who know the hidden secrets of their cities.</p>
          
          <div className="max-w-2xl mx-auto relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, university, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-gray-900 rounded-full pl-12 pr-32 py-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            />
            <button className="absolute right-2 bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-primary-600 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold">
                <Filter className="w-5 h-5" /> Filters
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Languages</h4>
                  <div className="space-y-2">
                    {['English', 'Hindi', 'Telugu', 'Kannada', 'Tamil'].map(lang => (
                      <label key={lang} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary" />
                        <span className="text-sm text-gray-700">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100"></div>

                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Rating</h4>
                  <div className="space-y-2">
                    {[4, 3].map(rating => (
                      <label key={rating} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary" />
                        <span className="text-sm text-gray-700 flex items-center gap-1">{rating}+ <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /></span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guide Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 font-medium">Showing <span className="font-bold text-gray-900">{filteredGuides.length}</span> verified guides</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide, i) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/guides/${guide.id}`} className="block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden card-hover group">
                    <div className="h-24 bg-gradient-mesh relative">
                      {guide.guideProfile?.verified && (
                        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md shadow-sm flex items-center gap-1 text-xs font-bold text-primary">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verified
                        </div>
                      )}
                    </div>
                    
                    <div className="px-6 pb-6 relative pt-12">
                      {/* Avatar */}
                      <div className="absolute -top-12 left-6">
                        <div className="w-20 h-20 rounded-xl overflow-hidden border-4 border-white shadow-md bg-gray-200">
                          {(guide.avatarUrl || guide.image) ? (
                            <Image src={guide.avatarUrl || guide.image || ''} alt={guide.profile?.firstName || ''} width={80} height={80} className="w-full h-full object-cover" unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary font-bold text-2xl">{guide.profile?.firstName?.charAt(0)}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors flex items-center gap-2">
                            {guide.profile?.firstName} {guide.profile?.lastName}
                          </h3>
                          <p className="text-xs font-medium text-gray-500 line-clamp-1">{guide.guideProfile?.university}</p>
                        </div>
                        <div className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1 shrink-0">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" /> {guide.guideProfile?.avgRating}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-4">
                        <MapPin className="w-4 h-4" /> {guide.profile?.location}
                      </div>

                      {/* Languages */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {guide.profile?.languages?.map((lang: string) => (
                          <span key={lang} className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {lang}
                          </span>
                        ))}
                      </div>

                      {/* Specializations */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {guide.guideProfile?.specializations?.slice(0, 3).map((spec: string) => {
                          // Try to match with category meta for emoji
                          const matchedCategory = Object.entries(CATEGORY_META).find(([key, meta]) => meta.label.toLowerCase() === spec.toLowerCase());
                          return (
                            <span key={spec} className="text-xs font-medium bg-primary/10 text-primary-700 px-2 py-1 rounded-md flex items-center gap-1">
                              {matchedCategory ? matchedCategory[1].emoji : '📍'} {spec}
                            </span>
                          );
                        })}
                        {(guide.guideProfile?.specializations.length || 0) > 3 && (
                          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                            +{(guide.guideProfile?.specializations.length || 0) - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">From</p>
                          <p className="text-lg font-bold text-gray-900">₹{guide.guideProfile?.pricePerHour}<span className="text-sm font-medium text-gray-500">/hr</span></p>
                        </div>
                        <button className="bg-primary/10 hover:bg-primary text-primary hover:text-white transition-colors px-4 py-2 rounded-lg text-sm font-bold">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {filteredGuides.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No guides found</h3>
                <p className="text-gray-500">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
