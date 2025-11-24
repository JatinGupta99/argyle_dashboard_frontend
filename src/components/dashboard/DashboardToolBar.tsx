'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { usePathname, useRouter } from 'next/navigation';

interface DashboardToolbarProps {
  title?: string;
  showDateFilters?: boolean;
  onDateFilter?: (from: string, to: string) => void;
  showViewSwitcher?: boolean;
  buttonLabel?: string;
  onButtonClick?: () => void;
  buttonIcon?: React.ReactNode;
  showButton?: boolean;
  children?: React.ReactNode;
}

export function DashboardToolbar({
  title,
  showDateFilters = false,
  onDateFilter,
  showViewSwitcher = true,
  buttonLabel = 'Add',
  onButtonClick,
  buttonIcon,
  showButton = true,
  children,
}: DashboardToolbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [view, setView] = useState<'card' | 'table'>('card');

  useEffect(() => {
    onDateFilter?.(fromDate, toDate);
  }, [fromDate, toDate]);

  useEffect(() => {
    setView(pathname.includes('table') ? 'table' : 'card');
  }, [pathname]);

  const today = new Date();

  const handleViewChange = (newView: 'card' | 'table') => {
    setView(newView);
    router.push(`/dashboard/schedule/${newView}`);
  };

  return (
    <Card className="flex w-full flex-col gap-4 overflow-visible border-none bg-transparent px-6 py-3 shadow-none md:flex-row md:items-center md:justify-between">
      {/* LEFT AREA */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-md bg-sky-200 p-2">
          <CalendarDays className="h-5 w-5 text-blue-500" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-base font-semibold">{format(today, 'EEEE')}</span>
          <span className="text-sm font-medium text-sky-500">{format(today, 'd MMMM yyyy')}</span>
        </div>
        {title && <span className="ml-4 text-lg font-semibold">{title}</span>}
      </div>

      {/* RIGHT AREA */}
      <div className="ml-auto flex flex-wrap items-center gap-3">
        {children}

        {/* Date Filters */}
        {showDateFilters && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>From</span>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-8 w-36"
            />
            <span>to</span>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-8 w-36"
            />
          </div>
        )}

        {/* Card/Table Switcher */}
        {showViewSwitcher && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 px-3 text-sm">
                {view === 'card' ? 'Card' : 'Table'}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              forceMount
              className="z-50 rounded-md bg-white p-1 shadow-md"
            >
              <DropdownMenuItem onClick={() => handleViewChange('card')}>Card</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewChange('table')}>Table</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Main Action Button */}
        {showButton && (
          <Button
            onClick={onButtonClick}
            className="flex items-center gap-2 rounded-md bg-sky-400 px-4 py-2 text-white transition-all hover:bg-blue-600"
          >
            {buttonLabel}
            {buttonIcon && <span>{buttonIcon}</span>}
          </Button>
        )}
      </div>
    </Card>
  );
}
