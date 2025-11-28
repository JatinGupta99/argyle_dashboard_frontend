'use client';

import { DataTable } from '@/components/common/GenericTable';
import { SpeakerAssiciatedwithAgendas } from '@/lib/types/agenda';
import { getSpeakerColumns } from './SpeakerTableColumns';
import { Speaker } from '@/lib/types/speaker';

export interface SpeakersTableProps {
  data: SpeakerAssiciatedwithAgendas[];
  meta?: { total: number; totalPages: number; page: number; limit: number };
  query: { page: number; limit: number };
  setQuery: (query: { page: number; limit: number }) => void;
  onEdit?: (speaker: Speaker) => void;
  onDelete?: (speaker: Speaker) => void;
}

export function SpeakersTable({
  data,
  meta,
  query,
  setQuery,
  onEdit,
  onDelete,
}: SpeakersTableProps) {
  console.log(data,'alscnlcs')
  return (
    <DataTable
      data={data.map(d => ({ ...d, key: d._id }))}
      columns={getSpeakerColumns({ onEdit, onDelete })}
      totalItems={meta?.total ?? data.length}
      query={query}
      setQuery={setQuery}
    />
  );
}
