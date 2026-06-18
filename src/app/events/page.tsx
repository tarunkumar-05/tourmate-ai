import EventsClient from './page-client';
import { getEvents } from '@/lib/data/events';

export default async function EventsPage() {
  const events = await getEvents();

  return <EventsClient initialEvents={events} />;
}
