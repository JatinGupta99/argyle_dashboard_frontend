'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { format } from 'date-fns';
import { FileDown, Filter, Plus, CalendarDays, ChevronDown } from 'lucide-react';

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

  const router = useRouter();
  const pathname = usePathname();

  const showViewDropdown =
    pathname === '/dashboard/schedule/table' || pathname === '/dashboard/schedule/card';

  const [view, setView] = useState<'card' | 'table'>('card');

  useEffect(() => {
    if (pathname.includes('table')) setView('table');
    else setView('card');
  }, [pathname]);

  const today = new Date();
  const day = format(today, 'EEEE');
  const date = format(today, 'd MMMM yyyy');

  const handleViewChange = (newView: 'card' | 'table') => {
    setView(newView);
    router.push(`/dashboard/schedule/${newView}`);
  };

  return (
    <Card className="flex w-full flex-col justify-between gap-4 border-none bg-transparent px-6 py-3 shadow-none md:flex-row md:items-center">
      <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
        <div className="flex items-center gap-3 text-gray-800">
          <div className="flex items-center justify-center rounded-md bg-sky-200 p-2 shadow-sm">
            <CalendarDays className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold">{day}</span>
            <span className="text-sm font-medium text-sky-500">{date}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="mr-1">From</span>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-8 w-36 text-sm"
          />
          <span className="mx-2">to</span>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-8 w-36 text-sm"
          />
        </div>
      </div>

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

        {showViewDropdown && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex h-8 items-center gap-2 border-gray-300 px-3 text-sm text-gray-700 hover:bg-gray-100"
              >
                {view === 'card' ? 'Card' : 'Table'}
                <ChevronDown className="h-4 w-4 text-sky-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewChange('card')}>Card</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewChange('table')}>Table</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          onClick={() => onExportClick?.()}
          className="flex items-center gap-2 rounded-md bg-sky-400 px-4 py-2 text-white transition-all duration-200 hover:bg-blue-600"
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
