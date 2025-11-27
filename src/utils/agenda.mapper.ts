import { Agenda } from "@/lib/types/agenda";

export function mapAgendaToRow(a: Agenda): Agenda {
  return {
    _id: a._id,
    title: a.title ?? '',
    description: a.description ?? '',
    startTime: a.startTime ?? '',
    endTime: a.endTime ?? '',
    date: a.date ?? '',
    hasPoll: a.hasPoll ?? false,
    speakers: a.speakers ?? [],
    event: a.event ?? '',
    createdAt: a.createdAt ?? '',
    updatedAt: a.updatedAt ?? '',
    __v:a.__v??''
  };
}
