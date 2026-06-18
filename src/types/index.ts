// ===== USER & AUTH TYPES =====
export type UserRole = 'tourist' | 'guide' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  phone?: string;
  emailVerified: boolean;
  createdAt: string;
  profile: Profile;
  guideProfile?: GuideProfile;
}

export interface Profile {
  firstName: string;
  lastName: string;
  bio?: string;
  dateOfBirth?: string;
  nationality?: string;
  languages: string[];
  interests: string[];
  location?: string;
  latitude?: number;
  longitude?: number;
}

export interface GuideProfile {
  id: string;
  userId: string;
  verified: boolean;
  university: string;
  studentId: string;
  yearsOfExperience: number;
  specializations: DestinationCategory[];
  certifications: Certification[];
  pricePerHour: number;
  pricePerDay: number;
  availableDays: string[];
  maxGroupSize: number;
  totalEarnings: number;
  avgRating: number;
  totalReviews: number;
  totalBookings: number;
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
}

// ===== DESTINATION TYPES =====
export type DestinationCategory =
  | 'hidden_gem'
  | 'heritage'
  | 'eco'
  | 'village'
  | 'food'
  | 'adventure'
  | 'religious'
  | 'cultural'
  | 'family';

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  coverImage: string;
  images: string[];
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  bestSeason: string;
  avgBudget: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  tags: string[];
  categories: DestinationCategory[];
  featured: boolean;
  published: boolean;
  avgRating: number;
  totalReviews: number;
  viewCount: number;
  createdAt: string;
}

// ===== BOOKING TYPES =====
export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'disputed';

export interface Booking {
  id: string;
  touristId: string;
  tourist: User;
  guideId: string;
  guide: User;
  destinationId?: string;
  destination?: Destination;
  experienceId?: string;
  experience?: Experience;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  groupSize: number;
  totalAmount: number;
  platformFee: number;
  guideEarnings: number;
  specialRequests?: string;
  meetingPoint?: string;
  createdAt: string;
}

// ===== REVIEW TYPES =====
export interface Review {
  id: string;
  authorId: string;
  author: User;
  targetUserId?: string;
  destinationId?: string;
  destination?: Destination;
  experienceId?: string;
  bookingId?: string;
  rating: number;
  title?: string;
  comment: string;
  images: string[];
  helpful: number;
  verified: boolean;
  response?: string;
  createdAt: string;
}

// ===== EXPERIENCE TYPES =====
export type ExperienceStatus = 'draft' | 'published' | 'archived' | 'cancelled';

export interface Experience {
  id: string;
  guideId: string;
  guide: User;
  destinationId?: string;
  destination?: Destination;
  title: string;
  slug: string;
  description: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  coverImage: string;
  images: string[];
  category: DestinationCategory;
  duration: number; // minutes
  maxGroupSize: number;
  pricePerPerson: number;
  languages: string[];
  difficulty?: string;
  meetingPoint?: string;
  meetingLat?: number;
  meetingLng?: number;
  status: ExperienceStatus;
  avgRating: number;
  totalBookings: number;
  featured: boolean;
  createdAt: string;
}

// ===== EVENT TYPES =====
export interface TourEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  images: string[];
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  organizer: string;
  price: number;
  isFree: boolean;
  maxAttendees: number;
  currentAttendees: number;
  tags: string[];
  featured: boolean;
  createdAt: string;
}

// ===== CHAT TYPES =====
export interface ChatRoom {
  id: string;
  bookingId?: string;
  participants: string[];
  participantDetails: User[];
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  sender: User;
  content: string;
  messageType: 'text' | 'image' | 'location' | 'system';
  readBy: string[];
  createdAt: string;
}

// ===== ITINERARY TYPES =====
export interface Itinerary {
  id: string;
  userId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  totalDays: number;
  days: ItineraryDay[];
  createdAt: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  title: string;
  items: ItineraryItem[];
  estimatedCost: number;
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'destination' | 'food' | 'transport' | 'activity' | 'rest';
  destination?: Destination;
  duration: number; // minutes
  estimatedCost: number;
  notes?: string;
}

// ===== SOCIAL TYPES =====
export interface Post {
  id: string;
  authorId: string;
  author: User;
  destinationId?: string;
  destination?: Destination;
  content: string;
  images: string[];
  videoUrl?: string;
  type: 'post' | 'trip_report' | 'tip' | 'question';
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  parentId?: string;
  content: string;
  likesCount: number;
  createdAt: string;
  replies?: Comment[];
}

// ===== GAMIFICATION TYPES =====
export type BadgeDifficulty = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Badge {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  category: string;
  difficulty: BadgeDifficulty;
  pointsAwarded: number;
  isHidden: boolean;
}

export interface UserBadge {
  id: string;
  userId: string;
  badge: Badge;
  earnedAt: string;
}

export interface UserPoints {
  totalPoints: number;
  currentLevel: number;
  levelName: string;
  nextLevelPoints: number;
  pointsToNextLevel: number;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
}

// ===== NOTIFICATION TYPES =====
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

// ===== AI TYPES =====
export interface AIRecommendation {
  id: string;
  destination: Destination;
  score: number;
  reason: string;
  algorithm: 'collaborative' | 'content' | 'hybrid';
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    destinations?: Destination[];
    itinerary?: Itinerary;
    guides?: User[];
  };
}

// ===== ANALYTICS TYPES =====
export interface DashboardStats {
  label: string;
  value: number | string;
  change: number;
  changeLabel: string;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// ===== FILTER TYPES =====
export interface DestinationFilters {
  category?: DestinationCategory;
  city?: string;
  state?: string;
  minBudget?: number;
  maxBudget?: number;
  difficulty?: string;
  rating?: number;
  search?: string;
}

export interface GuideFilters {
  language?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  university?: string;
  rating?: number;
  specialization?: DestinationCategory;
  search?: string;
}

// ===== CATEGORY METADATA =====
export const CATEGORY_META: Record<DestinationCategory, { label: string; icon: string; color: string; emoji: string }> = {
  hidden_gem: { label: 'Hidden Gems', icon: 'Gem', color: '#8B5CF6', emoji: '💎' },
  heritage: { label: 'Heritage', icon: 'Landmark', color: '#D97706', emoji: '🏛️' },
  eco: { label: 'Eco Tourism', icon: 'Leaf', color: '#059669', emoji: '🌿' },
  village: { label: 'Village Tourism', icon: 'Home', color: '#7C3AED', emoji: '🏡' },
  food: { label: 'Food & Cuisine', icon: 'UtensilsCrossed', color: '#DC2626', emoji: '🍛' },
  adventure: { label: 'Adventure', icon: 'Mountain', color: '#2563EB', emoji: '🏔️' },
  religious: { label: 'Religious', icon: 'Church', color: '#F59E0B', emoji: '🛕' },
  cultural: { label: 'Cultural', icon: 'Palette', color: '#EC4899', emoji: '🎭' },
  family: { label: 'Family', icon: 'Users', color: '#10B981', emoji: '👨‍👩‍👧‍👦' },
};
