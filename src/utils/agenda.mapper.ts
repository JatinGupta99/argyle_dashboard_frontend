import { AgendaRow } from '@/app/dashboard/events/[eventId]/agenda/components/AgendaTable';
import type { Agenda } from '@/lib/types/agenda';

export function mapAgendaToRow(a: Agenda): AgendaRow {
  return {
    _id: a._id,
    title: a.title,
    startTime: a.startTime ?? '',
    endTime: a.endTime ?? '',
    hasPoll: a.hasPoll ?? false,
    speakers: a.speakers ?? [],
  };
}
