import Link from 'next/link';
import { Compass, Globe, Mail, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-dark text-white pt-20 pb-24 md:pb-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none transform -translate-x-1/2 translate-y-1/4"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-2 rounded-xl">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight text-white">
                TourMate<span className="text-primary-300">.ai</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              Discover India's hidden gems, connect with verified local student guides, and plan unforgettable experiences powered by AI.
            </p>
            
            <div className="w-full max-w-sm mb-8">
              <h4 className="text-sm font-semibold mb-3 text-gray-300">Subscribe to our newsletter</h4>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-l-lg focus:outline-none focus:border-primary-400 w-full text-sm placeholder:text-gray-500"
                />
                <button 
                  type="button"
                  className="bg-primary hover:bg-primary-600 text-white px-4 py-2.5 rounded-r-lg transition-colors flex items-center justify-center"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 text-white">Explore</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/discover" className="hover:text-primary-300 transition-colors">Destinations</Link></li>
              <li><Link href="/hidden-gems" className="hover:text-primary-300 transition-colors">Hidden Gems</Link></li>
              <li><Link href="/experiences" className="hover:text-primary-300 transition-colors">Local Experiences</Link></li>
              <li><Link href="/events" className="hover:text-primary-300 transition-colors">Festivals & Events</Link></li>
              <li><Link href="/itinerary" className="hover:text-primary-300 transition-colors">AI Trip Planner</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 text-white">For Guides</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/auth/register" className="hover:text-primary-300 transition-colors">Become a Guide</Link></li>
              <li><Link href="#" className="hover:text-primary-300 transition-colors">Guide Resources</Link></li>
              <li><Link href="#" className="hover:text-primary-300 transition-colors">Earnings & Payouts</Link></li>
              <li><Link href="#" className="hover:text-primary-300 transition-colors">Success Stories</Link></li>
              <li><Link href="#" className="hover:text-primary-300 transition-colors">Community Forum</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 text-white">Company</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-primary-300 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary-300 transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary-300 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary-300 transition-colors">Trust & Safety</Link></li>
              <li><Link href="#" className="hover:text-primary-300 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} TourMate AI Inc. All rights reserved.</p>
            <div className="hidden md:flex items-center gap-4">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
              <span>English (IN)</span>
              <span>₹ INR</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm font-medium">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">IG</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">X</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">YT</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">IN</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
