'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Wallet, Compass, Loader2, Sparkles, Clock, CheckCircle2, IndianRupee, Save } from 'lucide-react';
import Image from 'next/image';
import { saveItinerary } from '@/actions/itinerary';

interface GeneratedItinerary {
  title: string;
  description: string;
  days: {
    dayNumber: number;
    theme: string;
    activities: {
      time: string;
      title: string;
      description: string;
      costEstimate: number;
    }[];
  }[];
}

export default function ItineraryGeneratorClient({ destinations }: { destinations: any[] }) {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState('Moderate');
  const [interests, setInterests] = useState<string[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (!itinerary) return;
    
    startTransition(async () => {
      const res = await saveItinerary({
        destination,
        days,
        budget,
        interests,
        itineraryData: itinerary,
      });
      if (res.success) {
        setIsSaved(true);
      } else {
        setError(res.error || 'Failed to save');
      }
    });
  };

  const BUDGET_OPTIONS = ['Budget (Backpacker)', 'Moderate', 'Luxury'];
  const INTEREST_OPTIONS = ['Heritage & History', 'Food & Culinary', 'Nature & Eco', 'Adventure', 'Spiritual', 'Village Life', 'Photography', 'Shopping'];

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      if (interests.length < 3) {
        setInterests([...interests, interest]);
      }
    }
  };

  const handleGenerate = async () => {
    if (!destination.trim() || interests.length === 0) {
      setError('Please provide a destination and at least one interest.');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    setItinerary(null);

    try {
      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, days, budget, interests }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const data = await response.json();
      setItinerary(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-32">
      {/* Hero Header */}
      <div className="bg-dark text-white pt-12 pb-16 relative mb-8">
        <div className="absolute inset-0 bg-gradient-hero opacity-80 mix-blend-multiply"></div>
        <div className="absolute inset-0 dot-pattern opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-green-400" /> Powered by Llama 3 AI
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">Smart Itinerary Generator</h1>
          <p className="text-gray-300 text-lg">Let our AI travel expert plan your perfect trip to India, down to the hour. Tailored to your interests, budget, and schedule.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Preferences</h2>
              
              <div className="space-y-5">
                {/* Destination */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Where to?</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g. Hampi, Karnataka"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {destinations.slice(0, 3).map(d => (
                      <button 
                        key={d.id} 
                        onClick={() => setDestination(d.name)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-md text-gray-600 transition-colors"
                      >
                        {d.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Days */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                    <span>Duration: {days} days</span>
                  </label>
                  <input 
                    type="range" 
                    min="1" max="7" 
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value))}
                    className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1 font-medium">
                    <span>1 day</span>
                    <span>1 week</span>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Budget Level</label>
                  <div className="grid grid-cols-1 gap-2">
                    {BUDGET_OPTIONS.map(b => (
                      <button
                        key={b}
                        onClick={() => setBudget(b)}
                        className={`py-2 px-3 text-sm font-medium rounded-lg border text-left transition-all ${
                          budget === b 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between">
                    <span>Interests</span>
                    <span className="text-gray-400 font-normal">{interests.length}/3</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map(interest => {
                      const isSelected = interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                            isSelected 
                              ? 'bg-primary border-primary text-white shadow-sm' 
                              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !destination || interests.length === 0}
                  className="w-full py-3.5 bg-primary hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Crafting Magic...</>
                  ) : (
                    <><Sparkles className="w-5 h-5" /> Generate Itinerary</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!isGenerating && !itinerary && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                    <Compass className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ready for an adventure?</h3>
                  <p className="text-gray-500 max-w-md">Tell us where you want to go and what you love doing, and our AI will craft a personalized day-by-day plan instantly.</p>
                </motion.div>
              )}

              {isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center p-12 space-y-8"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-gray-100"></div>
                    <div className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin absolute inset-0"></div>
                    <Sparkles className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <div className="space-y-2 text-center">
                    <h3 className="text-xl font-bold text-gray-900">Curating the perfect plan</h3>
                    <p className="text-gray-500 animate-pulse">Analyzing local gems and travel times...</p>
                  </div>
                </motion.div>
              )}

              {itinerary && !isGenerating && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-green-400 to-primary"></div>
                    <h2 className="text-3xl font-heading font-extrabold text-gray-900 mb-3">{itinerary.title}</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">{itinerary.description}</p>
                    
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                        <Calendar className="w-4 h-4 text-primary" /> {days} Days
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                        <Wallet className="w-4 h-4 text-primary" /> {budget}
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                      <button
                        onClick={handleSave}
                        disabled={isPending || isSaved}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${
                          isSaved 
                            ? 'bg-green-50 text-green-600 border border-green-200' 
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-primary hover:text-primary'
                        }`}
                      >
                        {isPending ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                        ) : isSaved ? (
                          <><CheckCircle2 className="w-5 h-5" /> Saved to Dashboard</>
                        ) : (
                          <><Save className="w-5 h-5" /> Save to Dashboard</>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                    {itinerary.days.map((day, index) => (
                      <div key={day.dayNumber} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
                          {day.dayNumber}
                        </div>
                        
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white shadow-sm border border-gray-100">
                          <h3 className="font-bold text-lg text-gray-900 mb-4">{day.theme}</h3>
                          
                          <div className="space-y-4">
                            {day.activities.map((activity, aIdx) => (
                              <div key={aIdx} className="relative pl-4 border-l-2 border-primary/20 pb-4 last:pb-0">
                                <div className="absolute w-2 h-2 rounded-full bg-primary -left-[5px] top-1.5"></div>
                                <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
                                  <Clock className="w-3.5 h-3.5" /> {activity.time}
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm mb-1">{activity.title}</h4>
                                <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                                <div className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                  <IndianRupee className="w-3 h-3" /> Est. ₹{activity.costEstimate}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
