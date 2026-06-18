'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Users, Star, ArrowRight, Filter } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const EVENT_CATEGORIES = ['All', 'Cultural Festival', 'Religious Festival', 'Art Exhibition', 'Literary Festival', 'Tribal Festival'];

export default function EventsClient({ initialEvents }: { initialEvents: any[] }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredEvents = activeCategory === 'All'
    ? initialEvents
    : initialEvents.filter(e => e.category === activeCategory);

  const featuredEvent = initialEvents.find(e => e.featured) || initialEvents[0];
  const otherEvents = filteredEvents.filter(e => e.id !== featuredEvent?.id);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative gradient-hero py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20"></div>
        <div className="absolute top-20 right-10 text-6xl animate-float opacity-20 select-none">🎪</div>
        <div className="absolute top-40 left-16 text-5xl animate-float opacity-15 select-none" style={{ animationDelay: '2s' }}>🎭</div>
        <div className="absolute bottom-20 right-1/4 text-4xl animate-float opacity-10 select-none" style={{ animationDelay: '3s' }}>📅</div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border-white/20 mb-6">
              <Calendar className="w-4 h-4 text-primary-300 animate-pulse-glow" />
              <span className="text-sm font-medium text-white/90">Festivals & Cultural Events</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white tracking-tight mb-6">
              Upcoming Events <br className="hidden md:block" />
              <span className="gradient-text-gold">& Festivals</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Immerse yourself in India&apos;s vibrant cultural calendar. From ancient traditions to modern art exhibitions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Event */}
      {featuredEvent && (
        <section className="container mx-auto px-4 -mt-16 relative z-20 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link href={`/events/${featuredEvent.id}`} className="group block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative h-[350px] md:h-[450px]">
                  <Image
                    src={featuredEvent.coverImage}
                    alt={featuredEvent.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>

                  {/* Featured badge */}
                  <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/90 backdrop-blur-md text-white text-sm font-bold shadow-lg">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> Featured Event
                    </span>
                    <span className="px-3 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium border border-white/20">
                      {featuredEvent.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20">
                    <div className="max-w-2xl">
                      <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4 group-hover:text-primary-300 transition-colors">
                        {featuredEvent.title}
                      </h2>

                      <div className="flex flex-wrap items-center gap-4 mb-4 text-white/80">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary-300" />
                          {formatDate(featuredEvent.startDate)} — {formatDate(featuredEvent.endDate)}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary-300" />
                          {featuredEvent.city}, {featuredEvent.state}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        {featuredEvent.isFree ? (
                          <span className="px-4 py-2 bg-green-500/90 backdrop-blur-md rounded-full text-white font-bold text-sm shadow-lg">
                            🎉 Free Entry
                          </span>
                        ) : (
                          <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white font-bold text-sm border border-white/20">
                            ₹{featuredEvent.price}
                          </span>
                        )}
                        <span className="flex items-center gap-2 text-white/70 text-sm">
                          <Users className="w-4 h-4" />
                          {featuredEvent.currentAttendees.toLocaleString('en-IN')} / {featuredEvent.maxAttendees.toLocaleString('en-IN')} attending
                        </span>
                        <span className="hidden md:flex items-center gap-2 text-primary-300 font-bold group-hover:gap-3 transition-all ml-auto">
                          View Details <ArrowRight className="w-5 h-5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      {/* Filter Tabs */}
      <section className="container mx-auto px-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2"
        >
          <Filter className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
          {EVENT_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Events Grid */}
      <section className="container mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {otherEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link href={`/events/${event.id}`} className="group block card-hover bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-full flex flex-col">
                  <div className="relative aspect-[16/10] img-zoom">
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10"></div>

                    {/* Price badge */}
                    <div className="absolute top-3 right-3 z-20">
                      {event.isFree ? (
                        <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                          Free
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full shadow-sm">
                          ₹{event.price}
                        </span>
                      )}
                    </div>

                    {/* Category */}
                    <div className="absolute top-3 left-3 z-20">
                      <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium rounded-full shadow-sm">
                        {event.category}
                      </span>
                    </div>

                    {/* Date overlay at bottom */}
                    <div className="absolute bottom-3 left-3 z-20">
                      <div className="flex items-center gap-2 text-white text-sm">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-medium">{formatDate(event.startDate)} — {formatDate(event.endDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                      <MapPin className="w-3.5 h-3.5" /> {event.city}, {event.state}
                    </p>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                      {event.description}
                    </p>

                    {/* Attendees bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Attendees</span>
                        <span className="font-semibold text-gray-700">{event.currentAttendees.toLocaleString('en-IN')} / {event.maxAttendees.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500"
                          style={{ width: `${Math.min((event.currentAttendees / event.maxAttendees) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {event.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm text-gray-500">{event.organizer}</span>
                      <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Details <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {otherEvents.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">Try selecting a different category to find events.</p>
          </div>
        )}
      </section>
    </div>
  );
}
