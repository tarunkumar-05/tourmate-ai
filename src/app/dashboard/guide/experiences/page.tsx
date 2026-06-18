import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { MapPin, Clock, Users, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ExperienceActions } from '@/components/dashboard/experience-actions';

export default async function GuideExperiencesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const experiences = await prisma.experience.findMany({
    where: { guideId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { destination: true }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-gray-900 mb-2">My Experiences</h1>
          <p className="text-gray-500">Manage the tours and experiences you offer to tourists.</p>
        </div>
        <Link href="/dashboard/guide/experiences/new" className="px-6 py-3 bg-primary hover:bg-primary-600 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 shrink-0">
          <PlusCircle className="w-5 h-5" /> Create New Tour
        </Link>
      </div>

      {experiences.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-400">
            <MapPin className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No experiences yet</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            Create your first experience to start getting bookings from tourists looking to explore your area.
          </p>
          <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-sm hover:bg-primary-600 transition-colors">
            Create Your First Tour
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group">
              {/* Image Placeholder */}
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                {exp.images && exp.images.length > 0 ? (
                  <img src={(exp.images as string[])[0]} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                    No Image
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  {exp.status === 'PUBLISHED' ? (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-sm">
                      <CheckCircle2 className="w-3 h-3" /> Published
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 bg-gray-800 text-white text-xs font-bold rounded-full shadow-sm">
                      <AlertCircle className="w-3 h-3" /> Draft
                    </span>
                  )}
                </div>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
                  <ExperienceActions id={exp.id} status={exp.status} />
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">{exp.category}</span>
                  <span className="font-extrabold text-gray-900">{formatCurrency(exp.pricePerPerson)}<span className="text-xs text-gray-500 font-normal">/pp</span></span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{exp.title}</h3>
                
                <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-gray-100 text-xs font-medium text-gray-500">
                  <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> {exp.destination?.name || 'Local'}</div>
                  <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-gray-400" /> {exp.duration} hrs</div>
                  <div className="flex items-center gap-1"><Users className="w-4 h-4 text-gray-400" /> Max {exp.maxGroupSize}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
