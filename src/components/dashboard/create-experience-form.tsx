'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createExperience } from '@/actions/guide-experiences';
import { Loader2, PlusCircle, Camera, ImageIcon } from 'lucide-react';
import { DestinationCategory } from '@prisma/client';
import Image from 'next/image';

export function CreateExperienceForm({ destinations }: { destinations: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerPerson: '',
    duration: '',
    maxGroupSize: '',
    category: 'CULTURAL' as DestinationCategory,
    destinationId: '',
    meetingPoint: ''
  });
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: 'CULTURAL', label: 'Cultural' },
    { value: 'HERITAGE', label: 'Heritage' },
    { value: 'ECO', label: 'Eco Tourism' },
    { value: 'VILLAGE', label: 'Village Tourism' },
    { value: 'FOOD', label: 'Food & Culinary' },
    { value: 'ADVENTURE', label: 'Adventure' },
    { value: 'RELIGIOUS', label: 'Religious & Spiritual' },
    { value: 'FAMILY', label: 'Family Friendly' },
    { value: 'HIDDEN_GEM', label: 'Hidden Gem' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const base64String = canvas.toDataURL('image/jpeg', 0.8);
        setCoverImage(base64String);
        setIsUploadingImage(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Form Validation
    if (formData.title.length < 5) {
      setError('Tour Title must be at least 5 characters long. Please enter relatable data.');
      return;
    }
    if (formData.description.length < 20) {
      setError('Description must be at least 20 characters long. Please provide meaningful details.');
      return;
    }
    if (formData.meetingPoint.length < 5) {
      setError('Meeting point is too short. Please provide a clear, valid location.');
      return;
    }
    const durationNum = parseInt(formData.duration, 10);
    if (durationNum <= 0 || durationNum > 48) {
      setError('Please enter a valid duration (e.g., between 1 and 48 hours).');
      return;
    }

    startTransition(async () => {
      const res = await createExperience({
        ...formData,
        pricePerPerson: parseFloat(formData.pricePerPerson),
        duration: durationNum,
        maxGroupSize: parseInt(formData.maxGroupSize, 10),
        coverImage: coverImage || undefined,
      });

      if (res.success) {
        router.push('/dashboard/guide/experiences');
      } else {
        setError(res.error || 'Failed to create experience');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}
      
      <div className="space-y-3 pb-6 border-b border-gray-100">
        <label className="text-sm font-bold text-gray-700">Cover Image</label>
        <div 
          onClick={() => !isUploadingImage && fileInputRef.current?.click()}
          className={`w-full h-48 md:h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group transition-colors ${coverImage ? 'border-primary' : 'border-gray-300 hover:border-primary hover:bg-primary/5'}`}
        >
          {coverImage ? (
            <>
              <Image src={coverImage} alt="Cover Preview" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold flex items-center gap-2">
                  <Camera className="w-5 h-5" /> Change Photo
                </span>
              </div>
            </>
          ) : (
            <>
              {isUploadingImage ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-400 mb-3 group-hover:text-primary transition-colors" />
              )}
              <span className="font-bold text-gray-700">{isUploadingImage ? 'Processing...' : 'Click to upload a cover photo'}</span>
              <span className="text-xs text-gray-500 mt-1">JPEG, PNG up to 5MB (auto-compressed)</span>
            </>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
      
      <div className="space-y-1">
        <label className="text-sm font-bold text-gray-700">Tour Title</label>
        <input 
          type="text" 
          required 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})} 
          placeholder="e.g. Old Delhi Street Food Walk" 
          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">Category</label>
          <select 
            required 
            value={formData.category} 
            onChange={e => setFormData({...formData, category: e.target.value as DestinationCategory})} 
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">Destination (City/Region)</label>
          <select 
            value={formData.destinationId} 
            onChange={e => setFormData({...formData, destinationId: e.target.value})} 
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="">-- Select Destination (Optional) --</option>
            {destinations.map(dest => (
              <option key={dest.id} value={dest.id}>{dest.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">Price Per Person (₹)</label>
          <input 
            type="number" 
            required 
            min="1"
            value={formData.pricePerPerson} 
            onChange={e => setFormData({...formData, pricePerPerson: e.target.value})} 
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">Duration (Hours)</label>
          <input 
            type="number" 
            required 
            min="1"
            value={formData.duration} 
            onChange={e => setFormData({...formData, duration: e.target.value})} 
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">Max Group Size</label>
          <input 
            type="number" 
            required 
            min="1"
            value={formData.maxGroupSize} 
            onChange={e => setFormData({...formData, maxGroupSize: e.target.value})} 
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-bold text-gray-700">Meeting Point</label>
        <input 
          type="text" 
          value={formData.meetingPoint} 
          onChange={e => setFormData({...formData, meetingPoint: e.target.value})} 
          placeholder="e.g. Gate No 3, Chandni Chowk Metro Station" 
          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-bold text-gray-700">Description</label>
        <textarea 
          required 
          rows={4}
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
          placeholder="Describe what tourists will do and see..." 
          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
        />
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
        {isPending ? 'Publishing...' : 'Publish Experience'}
      </button>
    </form>
  );
}
