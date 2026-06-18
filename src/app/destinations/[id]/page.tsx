import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Star, Clock, Calendar, ShieldCheck, ChevronRight, Compass } from 'lucide-react';
import { getDestinationById } from '@/lib/data/destinations';
import { prisma } from '@/lib/prisma';
import { CATEGORY_META } from '@/types';
import { formatCurrency } from '@/lib/utils';
import MapWrapper from '@/components/ui/map-wrapper';
import { mockUsers } from '@/lib/mock-data';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const destination = await getDestinationById(id);
  
  if (!destination) {
    notFound();
  }

  const primaryCategory = destination.categories?.[0] || 'heritage';
  const categoryMeta = CATEGORY_META[primaryCategory as any] || { label: primaryCategory, emoji: '📍', color: '#6B7280' };
  
  // Find guides who operate in this city
  const localGuides = mockUsers.filter(u => u.role === 'guide' && u.profile?.location?.toLowerCase().includes(destination.city.toLowerCase()));
  
  // Find reviews for this destination
  const destinationReviews = destination.reviews;

  return (
    <div className="min-h-screen bg-surface pb-32">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full bg-dark">
        <Image
          src={destination.images[0]}
          alt={destination.name}
          fill
          className="object-cover opacity-60"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/discover" className="hover:text-white">Destinations</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{destination.name}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: categoryMeta.color }}>
                {categoryMeta.emoji} {categoryMeta.label}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white backdrop-blur-md">
                {destination.difficulty} Difficulty
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-4">
              {destination.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-300" />
                <span className="text-lg">{destination.city}, {destination.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-bold">{destination.avgRating}</span>
                <span className="text-white/60">({destination.totalReviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content */}
          <div className="flex-1 space-y-12">
            
            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <Calendar className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs text-gray-500 font-bold uppercase">Best Season</span>
                <span className="font-medium text-gray-900">{destination.bestSeason}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <Clock className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs text-gray-500 font-bold uppercase">Ideal Duration</span>
                <span className="font-medium text-gray-900">2-3 Days</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <Compass className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs text-gray-500 font-bold uppercase">Distance</span>
                <span className="font-medium text-gray-900">View Map</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold text-primary mb-1">{formatCurrency(destination.avgBudget)}</span>
                <span className="text-xs text-gray-500 font-bold uppercase">Avg. Budget</span>
                <span className="font-medium text-gray-900">Per Day</span>
              </div>
            </div>

            {/* About */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {destination.name}</h2>
              <div className="prose prose-lg text-gray-600 max-w-none">
                <p>{destination.description}</p>
                <p>Immerse yourself in the local culture, explore ancient heritage, and experience the warmth of the locals. Whether you're seeking adventure or tranquility, this destination offers an unforgettable journey curated just for you.</p>
              </div>
            </section>

            {/* Map Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="h-[400px] rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <MapWrapper 
                  markers={[{
                    id: destination.id,
                    latitude: destination.latitude,
                    longitude: destination.longitude,
                    title: destination.name,
                    subtitle: destination.city,
                    image: destination.images[0],
                  }]}
                  center={[destination.latitude, destination.longitude]}
                  zoom={12}
                />
              </div>
            </section>

            {/* Gallery */}
            {destination.images.length > 1 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {destination.images.slice(1).map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden img-zoom shadow-sm">
                      <Image src={img} alt={`${destination.name} gallery ${idx}`} fill className="object-cover" unoptimized />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Local Guides */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Verified Local Guides</h2>
                <Link href={`/guides?location=${destination.city}`} className="text-primary font-bold hover:underline">View All</Link>
              </div>
              
              {localGuides.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {localGuides.slice(0, 4).map(guide => (
                    <Link key={guide.id} href={`/guides/${guide.id}`} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-gray-200">
                        {(guide.avatarUrl || guide.image) ? (
                          <Image src={guide.avatarUrl || guide.image || ''} alt={guide.profile?.firstName || ''} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary font-bold">{guide.profile?.firstName?.charAt(0)}</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{guide.profile?.firstName} {guide.profile?.lastName}</h4>
                        <p className="text-xs text-gray-500 mb-1">{guide.guideProfile?.university}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="flex items-center text-yellow-600 font-bold"><Star className="w-3 h-3 fill-yellow-400 mr-1" /> {guide.guideProfile?.avgRating || 0}</span>
                          <span className="text-gray-400">•</span>
                          <span className="font-bold text-gray-900">₹{guide.guideProfile?.pricePerHour || 0}/hr</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 text-center">
                  <p className="text-gray-500 font-medium">No verified student guides found exactly in {destination.city} right now. Check nearby areas!</p>
                </div>
              )}
            </section>

          </div>
          
          {/* Sidebar / Booking Card */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to explore?</h3>
              <p className="text-gray-500 text-sm mb-6">Book a verified student guide to show you around {destination.name}.</p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>100% Verified Student Guides</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Discover Hidden Local Spots</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Star className="w-5 h-5 text-primary" />
                  <span>Highly Rated Experiences</span>
                </div>
              </div>
              
              <Link href="/guides" className="block w-full py-4 bg-primary text-white text-center font-bold rounded-xl hover:bg-primary-600 transition-colors shadow-[0_4px_20px_rgba(11,110,79,0.3)]">
                Find a Guide
              </Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
