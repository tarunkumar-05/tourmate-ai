'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Share2, Bookmark, Image as ImageIcon, MapPin, Search, Send, MoreHorizontal, Hash, TrendingUp, Star } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { useSession } from 'next-auth/react';

interface CommunityClientProps {
  initialPosts: any[];
  topGuides: any[];
  trendingDestinations: any[];
  allDestinations: any[];
}

export default function CommunityClient({ initialPosts, topGuides, trendingDestinations, allDestinations }: CommunityClientProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const [activeTab, setActiveTab] = useState('All');
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState(initialPosts);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const postAuthor = user || { id: 'fallback', name: 'Guest', email: '', image: '', role: 'tourist' };

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handlePostSubmit = () => {
    if (!postText.trim() && !selectedImage) return;

    const newPost = {
      id: `p${Date.now()}`,
      authorId: postAuthor.id,
      author: postAuthor,
      destinationId: selectedLocationId || undefined,
      content: postText,
      images: selectedImage ? [selectedImage] : [],
      type: 'trip_report' as const,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString()
    };

    setPosts([newPost, ...posts]);
    setPostText('');
    setSelectedImage(null);
    setSelectedLocationId(null);
    setShowLocationPicker(false);
  };

  return (
    <div className="min-h-screen bg-surface pb-32">
      {/* Hero Header */}
      <div className="bg-dark text-white pt-12 pb-16 relative mb-8">
        <div className="absolute inset-0 bg-gradient-hero opacity-80 mix-blend-multiply"></div>
        <div className="absolute inset-0 dot-pattern opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">TourMate Community</h1>
            <p className="text-gray-300 text-lg">Share your travel stories, ask questions, and connect with fellow explorers and local guides.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Feed */}
          <div className="w-full lg:w-2/3 max-w-2xl mx-auto lg:mx-0">
            
            {/* Create Post Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0 overflow-hidden border-2 border-white shadow-sm relative">
                  {postAuthor.image ? (
                    <Image src={postAuthor.image} alt="You" fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {postAuthor.name ? postAuthor.name.charAt(0) : 'U'}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="Share your travel experience, ask a question, or give a tip..."
                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-primary/20 focus:bg-white resize-none transition-all placeholder:text-gray-400"
                    rows={3}
                  ></textarea>
                </div>
                
                {/* Previews */}
                {(selectedImage || selectedLocationId || showLocationPicker) && (
                  <div className="mt-3 flex flex-col gap-3">
                    {selectedImage && (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-sm group">
                        <Image src={selectedImage} alt="Selected" fill className="object-cover" unoptimized />
                        <button onClick={() => setSelectedImage(null)} className="absolute top-1 right-1 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                      </div>
                    )}
                    
                    {showLocationPicker && (
                      <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-gray-500 uppercase">Select Location</span>
                          <button onClick={() => setShowLocationPicker(false)} className="text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                          </button>
                        </div>
                        <select 
                          value={selectedLocationId || ''} 
                          onChange={(e) => setSelectedLocationId(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-primary focus:border-primary"
                        >
                          <option value="">None</option>
                          {allDestinations.map(d => (
                            <option key={d.id} value={d.id}>{d.name}, {d.city}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    {selectedLocationId && !showLocationPicker && (
                      <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full w-max">
                        <MapPin className="w-3.5 h-3.5" />
                        {allDestinations.find(d => d.id === selectedLocationId)?.name}
                        <button onClick={() => setSelectedLocationId(null)} className="ml-1 hover:text-primary-600">
                           <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                <div className="flex gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" hidden />
                  <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-sm font-medium hidden sm:inline">Photo</span>
                  </button>
                  <button onClick={() => setShowLocationPicker(!showLocationPicker)} className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm font-medium hidden sm:inline">Location</span>
                  </button>
                </div>
                <button 
                  onClick={handlePostSubmit}
                  disabled={!postText.trim() && !selectedImage}
                  className={`px-6 py-2.5 font-bold rounded-full flex items-center gap-2 transition-all ${
                    (postText.trim() || selectedImage)
                      ? 'bg-primary text-white shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Post <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Feed Filters */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mb-6 border-b border-gray-200 pb-px">
              {['All', 'Trip Reports', 'Tips & Advice', 'Questions', 'Photos'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 font-semibold text-sm whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post, i) => {
                const destination = post.destinationId ? allDestinations.find(d => d.id === post.destinationId) : null;
                const isLiked = likedPosts[post.id];
                
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {/* Post Header */}
                    <div className="p-5 pb-3 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Link href={`/profile/${post.authorId}`} className="w-12 h-12 rounded-full overflow-hidden relative shrink-0 bg-gray-100">
                          {(post.author.avatarUrl || post.author.image) && (
                            <Image src={post.author.avatarUrl || post.author.image || ''} alt={`${post.author.profile?.firstName || ''} ${post.author.profile?.lastName || ''}`} fill className="object-cover" unoptimized />
                          )}
                        </Link>
                        <div>
                          <Link href={`/profile/${post.authorId}`} className="font-bold text-gray-900 hover:text-primary transition-colors flex items-center gap-2">
                            {post.author?.profile?.firstName || post.author?.name || 'Anonymous'} {post.author?.profile?.lastName || ''}
                            {post.author?.role === 'guide' && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] uppercase rounded-full tracking-wider">Guide</span>
                            )}
                          </Link>
                          <div className="text-sm text-gray-500 flex items-center gap-1.5">
                            <span>{formatRelativeTime(post.createdAt)}</span>
                            {destination && (
                              <>
                                <span>•</span>
                                <Link href={`/destinations/${destination.id}`} className="hover:text-primary transition-colors flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {destination.name}
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className="px-5 py-2">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">{post.content}</p>
                    </div>

                    {/* Post Images */}
                    {post.images && post.images.length > 0 && (
                      <div className="mt-3 px-5">
                        <div className={`grid gap-2 ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                          {post.images.map((img: string, index: number) => (
                            <div key={index} className={`relative rounded-xl overflow-hidden ${post.images && post.images.length === 3 && index === 0 ? 'col-span-2 aspect-[21/9]' : 'aspect-square sm:aspect-video'}`}>
                              <Image src={img} alt="Post content" fill className="object-cover hover:scale-105 transition-transform duration-500" unoptimized />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="px-5 py-4 mt-2 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                        >
                          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                          <span>{post.likesCount + (isLiked ? 1 : 0)}</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span>{post.commentsCount}</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-500 transition-colors">
                          <Share2 className="w-5 h-5" />
                          <span className="hidden sm:inline">Share</span>
                        </button>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                Load More Posts
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block w-1/3">
            <div className="sticky top-24 space-y-6">
              
              {/* Search */}
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search community..." 
                  className="w-full bg-white border border-gray-200 rounded-full py-3 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
                />
              </div>

              {/* Trending Topics */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> Trending Topics
                </h3>
                <div className="space-y-4">
                  {[
                    { tag: 'MonsoonTravel', posts: '2.4k' },
                    { tag: 'HiddenGems', posts: '1.8k' },
                    { tag: 'BudgetBackpacking', posts: '956' },
                    { tag: 'SoloFemaleTraveler', posts: '842' },
                  ].map(topic => (
                    <div key={topic.tag} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Hash className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">{topic.tag}</span>
                      </div>
                      <span className="text-xs text-gray-400">{topic.posts} posts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Guides */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" /> Top Guides this Week
                </h3>
                <div className="space-y-5">
                  {topGuides.map(guide => (
                    <div key={guide.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full relative overflow-hidden bg-gray-100 shrink-0">
                        {(guide.avatarUrl || guide.image) ? (
                          <Image src={guide.avatarUrl || guide.image || ''} alt={guide.profile?.firstName || ''} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                            {guide.profile?.firstName?.charAt(0) || 'G'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{guide.profile?.firstName} {guide.profile?.lastName}</h4>
                        <p className="text-xs text-gray-500 truncate">{guide.guideProfile?.university}</p>
                      </div>
                      <Link href={`/guides/${guide.id}`} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full hover:bg-primary hover:text-white transition-colors shrink-0">
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Destinations */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" /> Popular Destinations
                </h3>
                <div className="space-y-4">
                  {trendingDestinations.map(dest => (
                    <Link key={dest.id} href={`/destinations/${dest.id}`} className="flex items-center gap-3 group">
                      <div className="w-12 h-12 rounded-xl relative overflow-hidden shrink-0">
                        <Image src={dest.images[0]} alt={dest.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors">{dest.name}</h4>
                        <p className="text-xs text-gray-500">{dest.state}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
