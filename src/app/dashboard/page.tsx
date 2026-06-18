import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardIndex() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/login');
  }
  
  const role = (session.user as any).role?.toLowerCase();
  
  if (role === 'admin') {
    redirect('/dashboard/admin');
  } else if (role === 'guide') {
    redirect('/dashboard/guide');
  } else {
    redirect('/dashboard/tourist');
  }
}
