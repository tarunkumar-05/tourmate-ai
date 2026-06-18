import ExperiencesClient from './page-client';
import { getExperiences } from '@/lib/data/experiences';

export default async function ExperiencesPage() {
  const experiences = await getExperiences();

  return <ExperiencesClient initialExperiences={experiences} />;
}
