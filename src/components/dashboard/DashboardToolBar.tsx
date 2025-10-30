'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { format } from 'date-fns';
import { FileDown, Filter, Plus, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

interface DashboardToolbarProps {
  showFilter?: boolean;
  onFilterClick?: () => void;
  defaultFromDate?: string;
  defaultToDate?: string;
}

export function DashboardToolbar({
  showFilter = true,
  onFilterClick,
  defaultFromDate = '',
  defaultToDate = '',
}: DashboardToolbarProps) {
  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);
  const { exportLabel, onExportClick } = useAppSelector((state: RootState) => state.toolbar);

  const today = new Date();
  const day = format(today, 'EEEE');
  const date = format(today, 'd MMMM yyyy');

  return (
    <Card className="flex w-full flex-col justify-between gap-4 border-none bg-transparent px-6 py-3 shadow-none md:flex-row md:items-center">
      {/* Left side — date + range */}
      <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
        {/* Day / Date */}
        <div className="mr-20 flex items-center gap-3 text-gray-800">
          <CalendarDays className="h-6 w-6 text-sky-600" />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold">{day}</span>
            <span className="text-sm text-gray-600">{date}</span>
          </div>
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="mr-1">From</span>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-8 w-36 text-sm"
          />
          <span className="mx-2">to</span> {/* space between From and To */}
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-8 w-36 text-sm"
          />
        </div>
      </div>

      {/* Right side — buttons */}
      <div className="flex items-center gap-2">
        {showFilter && (
          <Button
            onClick={onFilterClick}
            className="flex items-center gap-2 bg-sky-400 text-white hover:bg-blue-600"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        )}

        <Button
          onClick={() => onExportClick?.()}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-white transition-all duration-200 ${
            exportLabel?.toLowerCase().includes('add')
              ? 'bg-sky-400 hover:bg-blue-600'
              : 'bg-sky-400 hover:bg-blue-600'
          }`}
        >
          {exportLabel}
          {exportLabel?.toLowerCase().includes('add') ? (
            <Plus className="h-4 w-4" />
          ) : (
            <FileDown className="h-4 w-4" />
          )}
        </Button>
      </div>
    </Card>
  );
}
