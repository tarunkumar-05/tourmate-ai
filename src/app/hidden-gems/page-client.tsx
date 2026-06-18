'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MapPin, Star, ArrowRight, Gem, Send, Eye } from 'lucide-react';
import { CATEGORY_META } from '@/types';
import { truncateText } from '@/lib/utils';

export default function HiddenGemsClient({ hiddenGems }: { hiddenGems: any[] }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const featuredGem = hiddenGems[0];
  const remainingGems = hiddenGems.slice(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative gradient-hero py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20"></div>
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-20 select-none">💎</div>
        <div className="absolute top-32 right-16 text-5xl animate-float opacity-15 select-none" style={{ animationDelay: '2s' }}>✨</div>
        <div className="absolute bottom-20 left-1/4 text-4xl animate-float opacity-10 select-none" style={{ animationDelay: '4s' }}>💎</div>
        <div className="absolute top-1/2 right-1/3 text-3xl animate-float opacity-10 select-none" style={{ animationDelay: '1s' }}>✨</div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border-white/20 mb-6">
              <Gem className="w-4 h-4 text-purple-400 animate-pulse-glow" />
              <span className="text-sm font-medium text-white/90">Handpicked by Local Experts</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white tracking-tight mb-6">
              Discover <span className="gradient-text-gold">Hidden Gems</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Off-the-beaten-path destinations handpicked by local experts. Explore places most tourists never find.
            </p>

            <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1"><Sparkles className="w-4 h-4" /> {hiddenGems.length} Gems Found</span>
              <span className="w-1 h-1 rounded-full bg-white/30"></span>
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> Curated Monthly</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Hidden Gem */}
      {featuredGem && (
        <section className="container mx-auto px-4 -mt-16 relative z-20 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link href={`/destinations/${featuredGem.id}`} className="group block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <div className="relative h-[400px] md:h-[500px]">
                  <Image
                    src={featuredGem.coverImage}
                    alt={featuredGem.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>

                  {/* Featured badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/90 backdrop-blur-md text-white text-sm font-bold shadow-lg">
                      <Gem className="w-4 h-4" /> Featured Hidden Gem
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20">
                    <div className="max-w-2xl">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {featuredGem.categories.slice(0, 3).map(cat => {
                          const meta = CATEGORY_META[cat];
                          return (
                            <span
                              key={cat}
                              className="text-xs font-bold px-3 py-1 rounded-full text-white"
                              style={{ backgroundColor: meta?.color + 'CC' }}
                            >
                              {meta?.emoji} {meta?.label}
                            </span>
                          );
                        })}
                      </div>

                      <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-3 group-hover:text-primary-300 transition-colors">
                        {featuredGem.name}
                      </h2>

                      <p className="flex items-center gap-2 text-white/80 mb-4 text-lg">
                        <MapPin className="w-5 h-5 text-primary-300" />
                        {featuredGem.city}, {featuredGem.state}
                      </p>

                      <p className="text-gray-300 text-base md:text-lg mb-6 max-w-xl leading-relaxed">
                        {truncateText(featuredGem.description, 200)}
                      </p>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-white font-bold text-lg">{featuredGem.avgRating}</span>
                          <span className="text-white/60 text-sm">({featuredGem.totalReviews} reviews)</span>
                        </div>
                        <span className="flex items-center gap-2 text-primary-300 font-bold group-hover:gap-3 transition-all">
                          Explore Now <ArrowRight className="w-5 h-5" />
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

      {/* Gems Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">More Hidden Gems</h2>
            <p className="text-gray-600">Each destination is a secret waiting to be uncovered.</p>
          </div>
          <span className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4 text-purple-500" /> Updated weekly
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {remainingGems.map((gem, i) => (
            <motion.div
              key={gem.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link href={`/destinations/${gem.id}`} className="group block card-hover bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-full flex flex-col">
                <div className="relative aspect-[4/3] img-zoom">
                  <Image
                    src={gem.coverImage}
                    alt={gem.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>

                  {/* Rating badge */}
                  <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-gray-900">{gem.avgRating}</span>
                  </div>

                  {/* Location overlay */}
                  <div className="absolute bottom-3 left-3 z-20">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-300 transition-colors">{gem.name}</h3>
                    <p className="text-white/80 text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {gem.city}, {gem.state}
                    </p>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">
                    {truncateText(gem.description, 120)}
                  </p>

                  {/* Category badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {gem.categories.slice(0, 3).map(cat => {
                      const meta = CATEGORY_META[cat];
                      return (
                        <span
                          key={cat}
                          className="text-xs font-medium px-2 py-1 rounded-md text-white"
                          style={{ backgroundColor: meta?.color }}
                        >
                          {meta?.emoji} {meta?.label}
                        </span>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{(gem.viewCount / 1000).toFixed(1)}k views</span>
                    </div>
                    <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Submit CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-hero"></div>
        <div className="absolute inset-0 dot-pattern opacity-15"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
              <Gem className="w-8 h-8 text-purple-400" />
            </div>

            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Know a Hidden Gem?
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Share your favorite off-the-beaten-path destination with the TourMate community. Help fellow travelers discover something extraordinary.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-white text-primary-900 font-bold rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Submit a Gem
              </button>
            </form>

            <AnimatePresence>
              {submitted && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-primary-300 font-medium"
                >
                  ✨ Thanks! We&apos;ll review your submission and get back to you.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
