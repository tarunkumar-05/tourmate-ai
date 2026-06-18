'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MapPin, Star, Filter, SlidersHorizontal, Clock, Users } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { motion } from 'motion/react';

export default function ExperiencesClient({ initialExperiences }: { initialExperiences: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredExperiences = initialExperiences.filter(exp => 
    exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.guide?.profile?.firstName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Hero Section */}
      <div className="bg-dark text-white pt-16 pb-24 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&h=900&fit=crop"
          alt="India Experience"
          fill
          className="object-cover opacity-30 mix-blend-overlay"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80 mix-blend-multiply"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Unforgettable Local Experiences</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">Ditch the crowded tourist traps. Explore authentic local culture guided by passionate students.</p>
          
          <div className="max-w-2xl mx-auto relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search experiences, foods, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-gray-900 rounded-full pl-12 pr-12 py-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            />
            <button className="absolute right-2 bg-primary hover:bg-primary-600 text-white p-2 rounded-full transition-colors flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 shrink-0 hidden md:block">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold">
                <Filter className="w-5 h-5" /> Filters
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {['Food Walks', 'Heritage Tours', 'Eco Treks', 'Village Tours', 'Photography', 'Nightlife'].map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary" />
                        <span className="text-sm text-gray-700">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100"></div>

                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Duration</h4>
                  <div className="space-y-2">
                    {['1-2 hours', 'Half day (3-5 hours)', 'Full day'].map(dur => (
                      <label key={dur} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary" />
                        <span className="text-sm text-gray-700">{dur}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Experiences Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 font-medium">Showing <span className="font-bold text-gray-900">{filteredExperiences.length}</span> experiences</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredExperiences.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/experiences/${exp.id}`} className="group card-hover bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full relative">
                    {exp.featured && (
                      <div className="absolute top-3 right-3 z-30 bg-primary text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                        Top Pick
                      </div>
                    )}
                    <div className="relative aspect-video img-zoom bg-gray-100">
                      <Image
                        src={exp.coverImage || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80'}
                        alt={exp.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm z-20 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {(exp.duration / 60).toFixed(1)} hrs
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow relative">
                      {/* Guide Badge overlapping image */}
                      <div className="absolute -top-6 right-5 z-20 flex items-center gap-2 bg-white pl-1 pr-3 py-1 rounded-full shadow-md border border-gray-100">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          {(exp.guide?.avatarUrl || exp.guide?.image) ? (
                            <Image src={exp.guide.avatarUrl || exp.guide.image || ''} alt={exp.guide.profile?.firstName || ''} width={32} height={32} className="object-cover w-full h-full" unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary font-bold bg-gray-200">{exp.guide?.profile?.firstName?.charAt(0)}</div>
                          )}
                        </div>
                        <span className="text-xs font-bold text-gray-900">{exp.guide?.profile?.firstName}</span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-primary font-bold uppercase mb-2">
                        {exp.category.replace('_', ' ')}
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight">{exp.title}</h3>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 mt-auto">
                        <div className="flex items-center gap-1 font-medium">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                          <span className="text-gray-900">{exp.avgRating}</span>
                          <span className="text-gray-400">({exp.totalBookings})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>Up to {exp.maxGroupSize}</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Price per person</span>
                          <span className="text-xl font-bold text-gray-900">{formatCurrency(exp.pricePerPerson)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {filteredExperiences.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No experiences found</h3>
                <p className="text-gray-500">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
