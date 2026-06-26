'use client';

import { useState, useTransition, useRef } from 'react';
import { updateGuideProfile, uploadProfilePicture } from '@/actions/guide-settings';
import { Loader2, CheckCircle2, Camera, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface GuideSettingsFormProps {
  initialData: {
    university: string;
    studentId: string;
    pricePerHour: number | null;
    pricePerDay: number | null;
    image?: string | null;
  };
}

export function GuideSettingsForm({ initialData }: GuideSettingsFormProps) {
  const { update } = useSession();
  const [university, setUniversity] = useState(initialData.university);
  const [studentId, setStudentId] = useState(initialData.studentId);
  const [pricePerHour, setPricePerHour] = useState(initialData.pricePerHour?.toString() || '');
  const [pricePerDay, setPricePerDay] = useState(initialData.pricePerDay?.toString() || '');
  const [profileImage, setProfileImage] = useState(initialData.image || null);
  
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Compress image using canvas
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
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
        setProfileImage(base64String);

        // Upload to server
        startTransition(async () => {
          const res = await uploadProfilePicture(base64String);
          if (res.success) {
            // Instantly refresh the NextAuth session so Navbar updates!
            await update(); 
          }
          setIsUploadingImage(false);
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(false);

    startTransition(async () => {
      const res = await updateGuideProfile({
        university,
        studentId,
        pricePerHour: pricePerHour ? parseFloat(pricePerHour) : undefined,
        pricePerDay: pricePerDay ? parseFloat(pricePerDay) : undefined,
      });
      if (res.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Profile Picture Section */}
      <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
            {profileImage ? (
              <Image src={profileImage} alt="Profile" width={96} height={96} className="object-cover w-full h-full" unoptimized />
            ) : (
              <User className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingImage}
            className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-md hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-1">Profile Picture</h3>
          <p className="text-sm text-gray-500 mb-3">Upload a professional photo to build trust with tourists.</p>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingImage}
            className="text-sm font-bold text-primary hover:text-primary-600"
          >
            {isUploadingImage ? 'Uploading...' : 'Change Picture'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">University / College</label>
          <input
            type="text"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Student ID Number</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            required
          />
        </div>
        
        <div className="md:col-span-2 pt-4 border-t border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Pricing Settings</h3>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Base Price Per Hour (₹)</label>
          <input
            type="number"
            value={pricePerHour}
            onChange={(e) => setPricePerHour(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Base Price Per Day (₹)</label>
          <input
            type="number"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="pt-4 flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-primary hover:bg-primary-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? 'Saving...' : 'Save Profile'}
        </button>
        {isSaved && (
          <span className="text-green-600 flex items-center gap-1 text-sm font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" /> Saved!
          </span>
        )}
      </div>
    </form>
  );
}
