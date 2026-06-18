import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Calendar as CalendarIcon, Users, Clock, Tag, ChevronRight, Share2, Heart, ShieldCheck } from 'lucide-react';
import { getEventById, getEvents } from '@/lib/data/events';
import { formatDate } from '@/lib/utils';
import MapWrapper from '@/components/ui/map-wrapper';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEventById(id);
  
  if (!event) {
    notFound();
  }

  // Calculate duration in days
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const durationDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

  const allEvents = await getEvents();
  const relatedEvents = allEvents.filter(e => e.id !== event.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-surface pb-32">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full bg-dark">
        <Image
          src={event.coverImage}
          alt={event.title}
          fill
          className="object-cover opacity-70"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
          <div className="container mx-auto">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/events" className="hover:text-white transition-colors">Events</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white line-clamp-1 max-w-[200px] sm:max-w-none">{event.title}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-primary text-white shadow-lg shadow-primary/30">
                {event.category}
              </span>
              {event.isFree && (
                <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-green-500 text-white shadow-lg shadow-green-500/30">
                  Free Entry
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold text-white mb-6 leading-tight">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary-300" />
                <span className="text-lg">{formatDate(event.startDate)} — {formatDate(event.endDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-300" />
                <span className="text-lg">{event.city}, {event.state}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-8">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-2">
                  <Tag className="w-5 h-5" />
                </div>
                <div className="text-xs text-gray-500 font-bold uppercase mb-1">Price</div>
                <div className="font-bold text-gray-900 text-lg">
                  {event.isFree ? 'Free' : `₹${event.price}`}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-xs text-gray-500 font-bold uppercase mb-1">Duration</div>
                <div className="font-bold text-gray-900 text-lg">
                  {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-2">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-xs text-gray-500 font-bold uppercase mb-1">Capacity</div>
                <div className="font-bold text-gray-900 text-lg">
                  {event.maxAttendees.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-2">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-xs text-gray-500 font-bold uppercase mb-1">Registered</div>
                <div className="font-bold text-gray-900 text-lg">
                  {event.currentAttendees.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About this Event</h2>
              <div className="prose prose-lg prose-primary max-w-none text-gray-600">
                <p className="whitespace-pre-line leading-relaxed">{event.description}</p>
              </div>
              
              {/* Tags */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
              <div className="h-[350px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4">
                <MapWrapper 
                  markers={[{
                    id: event.id,
                    latitude: event.latitude,
                    longitude: event.longitude,
                    title: event.title,
                    subtitle: event.location,
                    image: event.coverImage,
                    type: 'event'
                  }]}
                  center={[event.latitude, event.longitude]}
                  zoom={13}
                />
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-primary/10 p-2 rounded-full text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{event.location}</h4>
                  <p className="text-gray-500 text-sm">{event.city}, {event.state}</p>
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Organizer</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                    {event.organizer.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{event.organizer}</h4>
                    <p className="text-sm text-gray-500">Official Event Organizer</p>
                  </div>
                </div>
                <button className="px-5 py-2.5 bg-white text-gray-900 font-bold rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                  Contact Organizer
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar / Booking Card */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 p-6 md:p-8">
                {/* Registration Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-gray-500 uppercase">Availability</span>
                    <span className="font-bold text-gray-900">
                      {Math.max(0, event.maxAttendees - event.currentAttendees).toLocaleString('en-IN')} spots left
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        (event.currentAttendees / event.maxAttendees) > 0.9 ? 'bg-red-500' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min((event.currentAttendees / event.maxAttendees) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <span className="block text-sm text-gray-500 font-bold uppercase mb-1">Registration Fee</span>
                  <div className="text-4xl font-extrabold text-gray-900">
                    {event.isFree ? 'Free' : `₹${event.price}`}
                  </div>
                </div>
                
                <button className="w-full py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mb-4 group flex items-center justify-center gap-2">
                  Register Now
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4" /> Save
                  </button>
                  <button className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    Secure registration & payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="mt-20 pt-16 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-heading font-bold text-gray-900">More Events Like This</h2>
              <Link href="/events" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                View All Events <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map(relatedEvent => (
                <Link key={relatedEvent.id} href={`/events/${relatedEvent.id}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all card-hover block">
                  <div className="relative h-48 img-zoom">
                    <Image
                      src={relatedEvent.coverImage}
                      alt={relatedEvent.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold rounded-lg shadow-sm">
                        {relatedEvent.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">{relatedEvent.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(relatedEvent.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{relatedEvent.city}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
