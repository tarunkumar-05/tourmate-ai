'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createExperience } from '@/actions/guide-experiences';
import { Loader2, PlusCircle } from 'lucide-react';
import { DestinationCategory } from '@prisma/client';

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
    category: 'cultural' as DestinationCategory,
    destinationId: '',
    meetingPoint: ''
  });

  const categories = [
    { value: 'cultural', label: 'Cultural' },
    { value: 'heritage', label: 'Heritage' },
    { value: 'eco', label: 'Eco Tourism' },
    { value: 'village', label: 'Village Tourism' },
    { value: 'food', label: 'Food & Culinary' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'religious', label: 'Religious & Spiritual' },
    { value: 'family', label: 'Family Friendly' },
    { value: 'hidden_gem', label: 'Hidden Gem' }
  ];

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
