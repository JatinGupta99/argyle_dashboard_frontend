'use client';

import { DataTable } from '@/components/common/GenericTable';
import { getSponsorColumns } from '@/components/sponsor/SponsorsColumn';
import { Sponsor } from '@/lib/types/sponsor';

export interface SponsorTableProps {
  data: Partial<Sponsor>[];
  meta?: { total: number; totalPages: number; page: number; limit: number };
  query: { page: number; limit: number };
  setQuery: (query: { page: number; limit: number }) => void;
  onEdit?: (sponsor: Sponsor) => void;
  onDelete?: (sponsor: Sponsor) => void;
}

export function SponsorsTable({
  data,
  meta,
  query,
  setQuery,
  onEdit,
  onDelete,
}: SponsorTableProps) {
  return (
    <DataTable
      data={data.map((d) => ({ ...d, key: d._id }))}
      columns={getSponsorColumns({ onEdit, onDelete })}
      totalItems={meta?.total ?? data.length}
      query={query}
      setQuery={setQuery}
    />
  );
}
