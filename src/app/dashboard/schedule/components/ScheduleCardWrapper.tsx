'use client';

import { Event } from '@/lib/types/components';
import { ScheduleCard } from './ScheduleCard';
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
  // Get first speaker from event.speakerPreview
  const speaker = event.speakerPreview?.[0];

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
      speaker={speaker?.name ?? 'No Speaker'}
      position={speaker?.title ?? ''}
      image={speaker?.photo ?? ''}
      selected={selected}
      onSelect={onSelect}
    />
  );
}
