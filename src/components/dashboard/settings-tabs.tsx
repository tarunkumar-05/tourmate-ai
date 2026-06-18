'use client';

import { useState, useTransition } from 'react';
import { User, Bell, Shield, Sparkles, CheckCircle2, Loader2, Key } from 'lucide-react';
import { SettingsForm } from './settings-form';
import { updateAiPreferences } from '@/actions/settings';

export function SettingsTabs({ 
  user, 
  aiPrefs 
}: { 
  user: any; 
  aiPrefs: any;
}) {
  const [activeTab, setActiveTab] = useState<'personal' | 'ai' | 'notifications' | 'security'>('personal');

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 flex overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => setActiveTab('personal')}
          className={`px-6 py-4 border-b-2 font-bold text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'personal' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          <User className="w-4 h-4" /> Personal Info
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`px-6 py-4 border-b-2 font-bold text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'ai' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          <Sparkles className="w-4 h-4" /> AI Preferences
        </button>
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`px-6 py-4 border-b-2 font-bold text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'notifications' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          <Bell className="w-4 h-4" /> Notifications
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`px-6 py-4 border-b-2 font-bold text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'security' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          <Shield className="w-4 h-4" /> Security
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'personal' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
            <SettingsForm initialData={{ name: user.name, email: user.email, phone: user.phone }} />
          </div>
        )}

        {activeTab === 'ai' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">AI Generator Preferences</h2>
            <p className="text-sm text-gray-500 mb-6">Tune how TourMate's AI plans your itineraries by default.</p>
            <AiPrefsForm initialData={aiPrefs} />
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="max-w-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h2>
            <div className="space-y-4">
              {[
                { title: 'Email Notifications', desc: 'Receive daily digests and trip updates via email.', active: true },
                { title: 'Push Notifications', desc: 'Get instant alerts for messages from your guide.', active: true },
                { title: 'Marketing & Promos', desc: 'Exclusive deals on hidden gem experiences.', active: false },
              ].map((notif, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{notif.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{notif.desc}</p>
                  </div>
                  <button className={`w-11 h-6 rounded-full transition-colors relative ${notif.active ? 'bg-primary' : 'bg-gray-200'}`}>
                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notif.active ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="max-w-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Security & Login</h2>
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0 text-blue-600">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Managed via Google SSO</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Your account is securely linked to your Google Account (<b>{user.email}</b>). Password changes and two-factor authentication are handled directly through Google.
                </p>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  Manage Google Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AiPrefsForm({ initialData }: { initialData: any }) {
  const [styles, setStyles] = useState<string[]>(initialData?.travelStyle || []);
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);

  const styleOptions = ['Adventure', 'Relaxation', 'Culture', 'Food', 'Nature', 'History'];

  const toggleStyle = (style: string) => {
    setStyles(prev => prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]);
  };

  const handleSave = () => {
    setIsSaved(false);
    startTransition(async () => {
      const res = await updateAiPreferences({ travelStyle: styles });
      if (res.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    });
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-3">Preferred Travel Styles</label>
        <div className="flex flex-wrap gap-2">
          {styleOptions.map(style => {
            const isSelected = styles.includes(style);
            return (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                  isSelected 
                    ? 'bg-primary-50 border-primary text-primary-700' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-4 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-6 py-3 bg-primary hover:bg-primary-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? 'Saving...' : 'Save AI Preferences'}
        </button>
        {isSaved && (
          <span className="text-green-600 flex items-center gap-1 text-sm font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" /> Saved!
          </span>
        )}
      </div>
    </div>
  );
}
