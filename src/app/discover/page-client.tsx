'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Star, Filter, SlidersHorizontal, Sparkles, Map as MapIcon, Grid } from 'lucide-react';
import { CATEGORY_META, DestinationCategory } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import MapWrapper from '@/components/ui/map-wrapper';

export default function DiscoverClient({ initialDestinations }: { initialDestinations: any[] }) {
  const [activeCategory, setActiveCategory] = useState<DestinationCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  
  const categories: (DestinationCategory | 'all')[] = ['all', 'hidden_gem', 'heritage', 'eco', 'village', 'food', 'adventure', 'religious', 'cultural', 'family'];

  const filteredDestinations = initialDestinations.filter(dest => {
    const destCategories = (dest.categories || []).map((c: string) => c.toLowerCase());
    const matchesCategory = activeCategory === 'all' || destCategories.includes(activeCategory as string);
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dest.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dest.tags?.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Search & Header Header */}
      <div className="bg-dark text-white pt-10 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-80 mix-blend-multiply"></div>
        <div className="absolute inset-0 dot-pattern opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Discover Your Next Adventure</h1>
            <p className="text-gray-300 text-lg">Explore AI-curated destinations, hidden gems, and unforgettable experiences across India.</p>
          </div>
          
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full bg-white text-gray-900 rounded-full pl-12 pr-12 py-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              placeholder="Search destinations, cities, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute inset-y-2 right-2 bg-primary hover:bg-primary-600 text-white p-2 rounded-full transition-colors flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        {/* Categories Carousel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 md:p-4 mb-10 overflow-x-auto scrollbar-hide flex gap-2 md:gap-4 snap-x">
          {categories.map((cat) => {
            const isAll = cat === 'all';
            const meta = isAll ? null : CATEGORY_META[cat as DestinationCategory];
            const isActive = activeCategory === cat;
            
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "snap-center shrink-0 flex items-center gap-2 px-4 py-2 md:py-3 rounded-xl text-sm font-medium transition-all",
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100"
                )}
              >
                {isAll ? <Sparkles className={cn("w-4 h-4", isActive ? "text-white" : "text-primary")} /> : <span>{meta?.emoji}</span>}
                <span className="whitespace-nowrap">{isAll ? 'All AI Picks' : meta?.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 font-medium text-sm hidden sm:block">
            Showing <span className="text-gray-900 font-bold">{filteredDestinations.length}</span> destinations
          </p>
          
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="bg-gray-100 p-1 rounded-lg flex items-center">
              <button 
                onClick={() => setShowMap(false)}
                className={cn("px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all", !showMap ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900")}
              >
                <Grid className="w-4 h-4" /> Grid
              </button>
              <button 
                onClick={() => setShowMap(true)}
                className={cn("px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all", showMap ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900")}
              >
                <MapIcon className="w-4 h-4" /> Map
              </button>
            </div>
            
            <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              <Filter className="w-4 h-4" /> <span className="hidden sm:inline">Sort: Recommended</span>
            </button>
          </div>
        </div>

        {/* View Content (Map or Grid) */}
        {showMap ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-[600px] w-full rounded-3xl overflow-hidden shadow-lg border border-gray-100 mb-12"
          >
            <MapWrapper 
              markers={filteredDestinations.map(d => ({
                id: d.id,
                latitude: d.latitude,
                longitude: d.longitude,
                title: d.name,
                subtitle: d.city,
                image: d.images[0],
                link: `/destinations/${d.id}`
              }))}
              center={filteredDestinations.length > 0 ? [filteredDestinations[0].latitude, filteredDestinations[0].longitude] : [20.5937, 78.9629]}
              zoom={5}
            />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          <AnimatePresence>
            {filteredDestinations.map((dest, i) => (
              <motion.div
                key={dest.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Link href={`/destinations/${dest.id}`} className="block group card-hover bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-full flex flex-col relative">
                  {dest.featured && (
                    <div className="absolute top-3 right-3 z-30 bg-primary text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                      Featured
                    </div>
                  )}
                  
                  <div className="relative aspect-[4/3] img-zoom overflow-hidden bg-gray-100">
                    <Image
                      src={dest.coverImage || ''}
                      alt={dest.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                    
                    <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1 leading-tight group-hover:text-primary-300 transition-colors">{dest.name}</h3>
                        <p className="text-white/90 text-sm flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {dest.city}, {dest.state}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {dest.categories.map(cat => {
                        const meta = CATEGORY_META[cat];
                        return (
                          <span key={cat} className="text-[10px] font-bold px-2 py-1 rounded bg-gray-100 text-gray-700">
                            {meta?.emoji} {meta?.label}
                          </span>
                        );
                      })}
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{dest.shortDesc || dest.description}</p>
                    
                    <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {dest.avgRating} <span className="text-gray-400 text-xs font-normal">({dest.totalReviews})</span>
                      </div>
                      <div className="text-sm font-bold text-primary">
                        {formatCurrency(dest.avgBudget || 0)} <span className="text-xs text-gray-500 font-normal">avg</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        )}
        
        {filteredDestinations.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 text-gray-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveCategory('all');}}
              className="mt-6 px-6 py-2 bg-primary text-white font-medium rounded-full hover:bg-primary-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
