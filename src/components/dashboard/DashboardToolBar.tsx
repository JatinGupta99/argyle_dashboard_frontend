'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { CalendarDays, ChevronDown, FileDown, Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { format } from 'date-fns';

interface DashboardToolbarProps {
  onPrimaryClick?: () => void;
  customLabel?: string;
  showDateFilters?: boolean;
}

export function DashboardToolbar({
  onPrimaryClick,
  customLabel,
  showDateFilters = true,
}: DashboardToolbarProps) {
  const { exportLabel } = useAppSelector((state: RootState) => state.toolbar);
  const label = customLabel || exportLabel;

  const router = useRouter();
  const pathname = usePathname();
  const [view, setView] = useState<'card' | 'table'>('card');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // ✅ Detect schedule pages
  const isSchedulePage =
    pathname === '/dashboard/schedule/card' ||
    pathname === '/dashboard/schedule/table';

  // ✅ Determine whether to show the Card/Table switcher
  const showViewSwitcher = useMemo(() => isSchedulePage, [pathname]);

  useEffect(() => {
    if (pathname.includes('table')) setView('table');
    else setView('card');
  }, [pathname]);

  const today = new Date();
  const day = format(today, 'EEEE');
  const date = format(today, 'd MMMM yyyy');

  return (
    <Card className="flex w-full flex-col justify-between gap-4 border-none bg-transparent px-6 py-3 shadow-none md:flex-row md:items-center md:justify-between">
      {/* Left: Day & Date */}
      <div className="flex items-center gap-3 text-gray-800">
        <div className="flex items-center justify-center rounded-md bg-sky-200 p-2 shadow-sm">
          <CalendarDays className="h-5 w-5 text-blue-500" />
        </div>

        {/* ✅ Conditionally render layout based on page */}
        {isSchedulePage ? (
         <>
        <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold">{day}</span>
            <span className="text-sm font-medium text-sky-500">{date}</span>
          </div>
          </>
        ) : (
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold">{day}</span>
            <span className="text-sm font-medium text-sky-500">{date}</span>
          </div>
        )}
      </div>

      {/* Center: Date filters (optional) */}
      {showDateFilters && (
        <div className="ml-80 flex items-center gap-2 text-sm text-gray-600">
          <span>From</span>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-8 w-36 text-sm"
          />
          <span>to</span>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-8 w-36 text-sm"
          />
        </div>
      )}

      {/* Right: View switcher (only for schedule/card & schedule/table) + Action button */}
      <div className="flex items-center gap-2">
        {showViewSwitcher && (
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
              <DropdownMenuItem
                onClick={() => router.push('/dashboard/schedule/card')}
              >
                Card
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push('/dashboard/schedule/table')}
              >
                Table
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          onClick={onPrimaryClick}
          className="flex items-center gap-2 rounded-md bg-sky-400 px-4 py-2 text-white transition-all duration-200 hover:bg-blue-600"
        >
          {label}
          {label?.toLowerCase().includes('add') ? (
            <Plus className="h-4 w-4" />
          ) : (
            <FileDown className="h-4 w-4" />
          )}
        </Button>
      </div>
    </Card>
  );
}
