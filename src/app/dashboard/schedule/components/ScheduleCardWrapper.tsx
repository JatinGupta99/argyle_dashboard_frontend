'use client';

import { Event } from '@/lib/types/components';
import { ScheduleCard } from './ScheduleCard';
import { useSpeakers } from '@/hooks/useSpeakers';
import { format } from 'date-fns';

export function ScheduleCardWrapper({
  event,
  selected,
  onSelect,
}: {
  event: Event;
  selected: boolean;
  onSelect: () => void;
}) {
  const { speakers, loading } = useSpeakers(event._id);
  const speaker = speakers?.[0];

  const day = format(new Date(event.EventDate), 'EEEE');
  const time =
    format(new Date(event.schedule.startTime), 'hh:mm a') +
    ' - ' +
    format(new Date(event.schedule.endTime), 'hh:mm a');

  return (
    <ScheduleCard
      eventId={event._id}
      title={event.title}
      time={time}
      day={day}
      speaker={loading ? 'Loading…' : (speaker?.name.firstName ?? 'No Speaker')}
      position={speaker?.title ?? ''}
      image={speaker?.pictureUrl ?? ''}
      selected={selected}
      onSelect={onSelect}
    />
  );
}
