import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', options ?? {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(d);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return 'Exceptional';
  if (rating >= 4.0) return 'Excellent';
  if (rating >= 3.5) return 'Very Good';
  if (rating >= 3.0) return 'Good';
  if (rating >= 2.0) return 'Average';
  return 'Below Average';
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Easy': return 'text-green-600 bg-green-50';
    case 'Moderate': return 'text-amber-600 bg-amber-50';
    case 'Challenging': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const PLACEHOLDER_IMAGES = {
  destination: (index: number) =>
    `https://images.unsplash.com/photo-${['1524492412937-b28074a5d7da', '1506905925346-21bda4d32df4', '1564507592924-d4a3e7f1f5e2', '1602216056096-3b40cc0c9944', '1512343879784-a960bf40e7f2', '1570168007204-dfb528c6958f', '1590766940554-634f4e171e73', '1544735716-392fe2489ffa'][index % 8]}?w=800&h=600&fit=crop`,
  guide: (index: number) =>
    `https://images.unsplash.com/photo-${['1507003211169-0a1dd7228f2d', '1494790108377-be9c29b29330', '1472099645785-5658abf4ff4e', '1438761681033-6461ffad8d80', '1500648767791-00dcc994a43e', '1534528741775-53994a69daeb'][index % 6]}?w=400&h=400&fit=crop&crop=face`,
  experience: (index: number) =>
    `https://images.unsplash.com/photo-${['1533105079780-92b9be482077', '1476514525535-07fb3b4ae5f1', '1501785888508-aa6a40e7a3ab', '1519451241324-20b4ea2c4220'][index % 4]}?w=800&h=600&fit=crop`,
  event: (index: number) =>
    `https://images.unsplash.com/photo-${['1533174072545-7a4b6ad7a6c3', '1492684223066-81342ee5ff30', '1514525253161-7a46d19cd819', '1501281668745-f7f57925c3b4'][index % 4]}?w=800&h=600&fit=crop`,
  avatar: (index: number) =>
    `https://images.unsplash.com/photo-${['1507003211169-0a1dd7228f2d', '1494790108377-be9c29b29330', '1472099645785-5658abf4ff4e'][index % 3]}?w=200&h=200&fit=crop&crop=face`,
};
