'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  meta: { page: number; totalPages: number; limit: number };
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function ServerPagination({ meta, onPageChange, onPageSizeChange }: Props) {
  return (
    <div className="flex items-center justify-between px-2 py-3">
      <div className="flex space-x-2">
        <Button onClick={() => onPageChange(1)} disabled={meta.page <= 1}>
          First
        </Button>
        <Button onClick={() => onPageChange(meta.page - 1)} disabled={meta.page <= 1}>
          Prev
        </Button>
        <span>
          Page {meta.page} of {meta.totalPages}
        </span>
        <Button onClick={() => onPageChange(meta.page + 1)} disabled={meta.page >= meta.totalPages}>
          Next
        </Button>
        <Button
          onClick={() => onPageChange(meta.totalPages)}
          disabled={meta.page >= meta.totalPages}
        >
          Last
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Select value={meta.limit.toString()} onValueChange={(v) => onPageSizeChange(Number(v))}>
          {[10, 20, 25, 50].map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}
