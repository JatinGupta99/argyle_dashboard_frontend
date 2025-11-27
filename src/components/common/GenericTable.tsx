'use client';

import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { DataTablePagination } from '@/app/dashboard/schedule/components/DataTablePagination';

interface DataTableProps<T> {
  data: T[];
  columns: any[];
  totalItems?: number; 
  query: { page: number; limit: number };
  setQuery: (query: { page: number; limit: number }) => void;
}

export function DataTable<T>({ data, columns, totalItems = 0, query, setQuery }: DataTableProps<T>) {
  const pageCount = Math.ceil(totalItems / query.limit);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { pagination: { pageIndex: query.page - 1, pageSize: query.limit } },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: updater => {
      const next = typeof updater === 'function' ? updater({ pageIndex: query.page - 1, pageSize: query.limit }) : updater;
      setQuery({ page: next.pageIndex + 1, limit: next.pageSize });
    },
  });

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(hg => (
            <TableRow key={hg.id} className="bg-sky-50 shadow-sm">
              {hg.headers.map(header => (
                <TableHead key={header.id} className="px-4 py-2 text-center">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} className="px-4 py-3 text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-10 text-center text-gray-500">
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DataTablePagination table={table} />
    </div>
  );
}
