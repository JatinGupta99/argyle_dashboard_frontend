'use client';

import { getAgendaColumns } from '@/components/agenda/AgendaTableColumns';
import { DataTable } from '@/components/common/GenericTable';
import { Agenda } from '@/lib/types/agenda';

export interface AgendaTableProps {
  data: Agenda[];
  meta?: { total: number; totalPages: number; page: number; limit: number };
  query: { page: number; limit: number };
  setQuery: (query: { page: number; limit: number }) => void;
  onEdit?: (agenda: Agenda) => void;
  onDelete?: (agenda: Agenda) => void;
}

export function AgendaTable({ data, meta, query, setQuery, onEdit, onDelete }: AgendaTableProps) {
  return (
    <DataTable
      data={data.map(d => ({ ...d, key: d._id }))}
      columns={getAgendaColumns({ onEdit, onDelete })}
      totalItems={meta?.total ?? data.length}
      query={query}
      setQuery={setQuery}
    />
  );
}
