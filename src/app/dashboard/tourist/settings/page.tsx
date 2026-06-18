import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { SettingsTabs } from '@/components/dashboard/settings-tabs';

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      aiPreference: true
    }
  });

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-500">Manage your profile, preferences, and account security.</p>
      </div>

      <SettingsTabs user={user} aiPrefs={user.aiPreference} />
    </div>
  );
}
