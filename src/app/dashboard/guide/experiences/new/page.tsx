import { prisma } from '@/lib/prisma';
import { CreateExperienceForm } from '@/components/dashboard/create-experience-form';

export default async function NewExperiencePage() {
  const destinations = await prisma.destination.findMany({
    select: { id: true, name: true }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-gray-900 mb-2">Create New Tour</h1>
        <p className="text-gray-500">Fill out the details below to publish a new experience for tourists.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm max-w-3xl">
        <CreateExperienceForm destinations={destinations} />
      </div>
    </div>
  );
}
