import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { User, Key } from 'lucide-react';
import { GuideSettingsForm } from '@/components/dashboard/guide-settings-form';

export default async function GuideSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const guideProfile = await prisma.guideProfile.findUnique({
    where: { userId: session.user.id },
    include: { user: true }
  });

  if (!guideProfile) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-gray-900 mb-2">Guide Profile Settings</h1>
        <p className="text-gray-500">Manage your university details, base pricing, and account security.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 flex overflow-x-auto hide-scrollbar">
          <button className="px-6 py-4 border-b-2 border-primary text-primary font-bold text-sm whitespace-nowrap flex items-center gap-2">
            <User className="w-4 h-4" /> Professional Profile
          </button>
        </div>

        <div className="p-8">
          <GuideSettingsForm 
            initialData={{ 
              university: guideProfile.university,
              studentId: guideProfile.studentId,
              pricePerHour: guideProfile.pricePerHour,
              pricePerDay: guideProfile.pricePerDay
            }} 
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-8">
        <div className="max-w-xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Security & Login</h2>
          <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0 text-blue-600">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Managed via Google SSO</h4>
              <p className="text-sm text-gray-600 mb-4">
                Your account is securely linked to your Google Account (<b>{guideProfile.user.email}</b>). Password changes and two-factor authentication are handled directly through Google.
              </p>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                Manage Google Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
