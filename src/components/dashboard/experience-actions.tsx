'use client';

import { useTransition } from 'react';
import { toggleExperienceStatus, deleteExperience } from '@/actions/guide-experiences';
import { MoreVertical, Edit2, Eye, EyeOff, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function ExperienceActions({ id, status }: { id: string; status: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    setIsOpen(false);
    startTransition(async () => {
      await toggleExperienceStatus(id);
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this experience?')) {
      setIsOpen(false);
      startTransition(async () => {
        await deleteExperience(id);
      });
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <MoreVertical className="w-5 h-5" />}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Edit2 className="w-4 h-4" /> Edit Details
            </button>
            <button 
              onClick={handleToggle}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              {status === 'PUBLISHED' ? (
                <><EyeOff className="w-4 h-4" /> Unpublish (Draft)</>
              ) : (
                <><Eye className="w-4 h-4" /> Publish</>
              )}
            </button>
            <div className="h-px bg-gray-100 my-1"></div>
            <button 
              onClick={handleDelete}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
