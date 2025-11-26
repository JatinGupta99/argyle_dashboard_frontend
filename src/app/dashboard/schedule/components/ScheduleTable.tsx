'use client';

import { useAppDispatch } from '@/redux/hooks';
import { openEventForm, setEventDeleteTarget } from '@/redux/slices/event-slice';
import { useEventsContext } from '@/components/providers/EventsContextProvider';
import {
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { scheduleColumns as getColumns } from './ScheduleRow';
import { DataTablePagination } from './DataTablePagination';

export default function ScheduleTable() {
  const dispatch = useAppDispatch();
  const { events, meta, query, setQuery } = useEventsContext();

  // Pass callbacks to columns
  const columns = getColumns({
    onEdit: (event:any) => dispatch(openEventForm(event)),
    onDelete: (event:any) => dispatch(setEventDeleteTarget(event)),
  });

  const table = useReactTable({
    data: events,
    columns,
    pageCount: meta.totalPages,
    state: { pagination: { pageIndex: (query.page || 1) - 1, pageSize: query.limit || 10 } },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater({ pageIndex: (query.page || 1) - 1, pageSize: query.limit || 10 })
          : updater;

      setQuery({
        ...query,
        page: next.pageIndex + 1,
        limit: next.pageSize,
      });
    },
  });

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="bg-sky-50 shadow-sm">
              {hg.headers.map((header) => (
                <TableHead key={header.id} className="px-4">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-10 text-center text-gray-500">
                No schedules found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DataTablePagination table={table} />
    </div>
  );
}
