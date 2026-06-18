'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Compass, Sparkles, MapPin, Users, Star, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { getRatingLabel } from '@/lib/utils';
import { CATEGORY_META } from '@/types';

interface LandingPageProps {
  trendingDestinations: any[];
  featuredExperiences: any[];
  topGuides: any[];
  hiddenGems: any[];
}

export default function LandingClient({
  trendingDestinations,
  featuredExperiences,
  topGuides,
  hiddenGems
}: LandingPageProps) {

  const stats = [
    { label: 'Destinations', value: '12K+', icon: MapPin },
    { label: 'Verified Guides', value: '500+', icon: ShieldCheck },
    { label: 'Happy Tourists', value: '50K+', icon: Users },
    { label: 'Average Rating', value: '4.8★', icon: Star },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-dark z-0">
          <Image
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&h=900&fit=crop"
            alt="India Landscape"
            fill
            className="object-cover opacity-40 mix-blend-overlay"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-surface"></div>
          <div className="absolute inset-0 dot-pattern opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto pb-24 md:pb-32"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary-300 animate-pulse-glow" />
              <span className="text-sm font-medium text-white/90">Powered by AI Recommendation Engine</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white tracking-tight mb-6 leading-tight">
              Discover India <br className="hidden md:block" />
              <span className="gradient-text-gold">Like Never Before</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Your personalized AI-powered local tourism ecosystem. Connect with verified student guides, find hidden gems, and create unforgettable itineraries.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/discover" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-primary-900 font-bold rounded-full hover:bg-gray-100 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 flex items-center justify-center gap-2"
              >
                <Compass className="w-5 h-5" />
                Start Exploring
              </Link>
              <Link 
                href="/auth/register" 
                className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                Become a Guide
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-10 left-0 right-0 z-20 hidden md:block">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="glass px-6 py-4 rounded-2xl flex items-center gap-4 shadow-lg border border-white/50"
                >
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{stat.value}</h4>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING CAROUSEL */}
      <section className="py-24 bg-surface relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-gray-900">Trending Destinations</h2>
              <p className="text-gray-600 max-w-xl">Explore the most popular places recommended by our AI engine this week.</p>
            </div>
            <Link href="/discover" className="hidden md:flex items-center gap-2 text-primary font-medium hover:text-primary-600 transition-colors group">
              View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingDestinations.map((dest, i) => (
              <motion.div 
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/destinations/${dest.id}`} className="block group card-hover bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-full flex flex-col">
                  <div className="relative aspect-[4/3] img-zoom">
                    <Image
                      src={dest.coverImage || ''}
                      alt={dest.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                    
                    <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2">
                      {dest.categories.slice(0, 2).map(cat => {
                        const meta = CATEGORY_META[cat];
                        return (
                          <span key={cat} className="text-xs font-medium px-2 py-1 rounded-md bg-white/90 backdrop-blur-sm text-gray-900 flex items-center gap-1 shadow-sm">
                            {meta?.emoji} {meta?.label}
                          </span>
                        );
                      })}
                    </div>
                    
                    <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-primary-300 transition-colors">{dest.name}</h3>
                        <p className="text-white/80 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" /> {dest.city}, {dest.state}</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-medium border border-white/30">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {dest.avgRating}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/discover" className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-600 transition-colors">
              View all destinations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-surface-secondary border-y border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">How TourMate Works</h2>
            <p className="text-gray-600">Your journey from inspiration to unforgettable memories in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gray-200 z-0 border-t border-dashed border-gray-300"></div>

            {[
              { 
                step: 1, 
                title: 'Discover & Plan', 
                desc: 'Our AI analyzes your preferences to recommend perfect destinations and generates smart itineraries.',
                icon: Sparkles
              },
              { 
                step: 2, 
                title: 'Connect with Local Guides', 
                desc: 'Browse profiles of verified university students who know the hidden secrets of their city.',
                icon: Users
              },
              { 
                step: 3, 
                title: 'Experience & Review', 
                desc: 'Enjoy authentic local experiences, earn reward points, and share your stories with the community.',
                icon: Star
              }
            ].map((item, i) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border-4 border-surface-secondary relative group">
                  <div className="absolute inset-0 rounded-full bg-primary/10 scale-0 group-hover:scale-110 transition-transform duration-300 z-0"></div>
                  <item.icon className="w-10 h-10 text-primary relative z-10 group-hover:scale-110 transition-transform" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white z-20">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED EXPERIENCES */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Unforgettable Local Experiences</h2>
            <p className="text-gray-600">Ditch the crowded tourist traps. Explore authentic local culture guided by passionate students.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredExperiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/experiences/${exp.id}`} className="group card-hover bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full">
                  <div className="relative aspect-video img-zoom">
                    <Image
                      src={exp.coverImage || ''}
                      alt={exp.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm">
                      {(exp.duration / 60).toFixed(1)} Hours
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <Image 
                        src={exp.guide.avatarUrl || exp.guide.image || ''} 
                        alt={exp.guide.profile?.firstName || ''} 
                        width={24} 
                        height={24} 
                        className="rounded-full"
                        unoptimized
                      />
                      <span className="text-sm font-medium text-gray-600">by {exp.guide.profile?.firstName}</span>
                      <span className="mx-1 text-gray-300">•</span>
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                        {exp.avgRating}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{exp.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{exp.description}</p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium">From</span>
                        <span className="text-lg font-bold text-gray-900">₹{exp.pricePerPerson}</span>
                      </div>
                      <span className="text-primary font-medium text-sm group-hover:underline flex items-center gap-1">
                        Book Now <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              href="/experiences" 
              className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              Browse All Experiences
            </Link>
          </div>
        </div>
      </section>

      {/* AI ASSISTANT CTA */}
      <section className="py-24 bg-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[100px] pointer-events-none rounded-full transform translate-x-1/4"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 lg:max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary-300 text-sm font-medium mb-6 border border-primary/30">
                <Sparkles className="w-4 h-4" />
                <span>TourMate AI</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 leading-tight">
                Your Personal <br />
                <span className="gradient-text-gold">Travel Genius</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Don't know where to go? Tell our AI what you love, your budget, and travel dates. It will craft a personalized itinerary, suggest hidden gems, and match you with the perfect local guides in seconds.
              </p>
              
              <ul className="space-y-4 mb-10">
                {['Smart Itinerary Generation', 'Personalized Destination Matching', 'Real-time Budget Estimation', 'Local Food Recommendations'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-200">
                    <div className="bg-primary/20 p-1 rounded-full text-primary-300">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/ai-assistant" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-600 transition-all shadow-[0_0_20px_rgba(11,110,79,0.4)] hover:scale-105"
              >
                Chat with AI Now <Sparkles className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="flex-1 w-full max-w-md lg:max-w-none relative">
              {/* Decorative elements behind phone */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform rotate-3 scale-105 z-0"></div>
              
              {/* Mock Chat UI */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl relative z-10 border-4 border-gray-800 flex flex-col h-[500px] w-full max-w-[360px] mx-auto">
                <div className="bg-surface-secondary border-b border-gray-100 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">TourMate AI</h4>
                    <p className="text-xs text-primary-600 font-medium">Online</p>
                  </div>
                </div>
                
                <div className="flex-1 p-4 bg-gray-50 flex flex-col gap-4 overflow-y-auto">
                  <div className="self-end max-w-[85%]">
                    <div className="bg-primary text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm shadow-sm">
                      I want to explore hidden waterfalls near Bengaluru under ₹5000 for this weekend.
                    </div>
                  </div>
                  
                  <div className="self-start max-w-[85%] flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex-shrink-0 flex items-center justify-center text-white mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm shadow-sm">
                      <p className="mb-2">I found the perfect spot! 🌿</p>
                      <p className="font-bold text-primary-700 mb-1">Chunchi Falls (80km away)</p>
                      <p className="mb-3 text-gray-600">A hidden gem less crowded than Shivanasamudra. Great for trekking and photography.</p>
                      <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 mb-2">
                        <p className="text-xs font-semibold mb-1 text-gray-500">Estimated Budget</p>
                        <p className="font-bold">₹2,800</p>
                      </div>
                      <button className="w-full py-1.5 bg-primary/10 text-primary rounded-lg font-medium mt-1 text-xs hover:bg-primary/20 transition-colors">
                        Generate Itinerary
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-400">
                    Type a message...
                  </div>
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 bg-gradient-mesh relative">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-gray-900">Ready to start your journey?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of travelers discovering the real India through local eyes.
          </p>
          <Link 
            href="/auth/register" 
            className="inline-flex items-center justify-center px-10 py-4 bg-primary text-white text-lg font-bold rounded-full hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Create Free Account
          </Link>
          <p className="mt-6 text-sm text-gray-500">No credit card required. Free forever for tourists.</p>
        </div>
      </section>
    </div>
  );
}
