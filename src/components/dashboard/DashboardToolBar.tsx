'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { Filter, FileDown, CreditCard } from 'lucide-react';

interface DashboardToolbarProps {
  exportLabel?: string;
  showFilter?: boolean;
  showCard?: boolean;
  onFilterClick?: () => void;
  onCardClick?: () => void;
  onExportClick?: (range: { fromDate: string; toDate: string }) => void;
  defaultFromDate?: string;
  defaultToDate?: string;
}

export function DashboardToolbar({
  exportLabel = 'Export',
  showFilter = true,
  showCard = true,
  onFilterClick,
  onCardClick,
  onExportClick,
  defaultFromDate = '',
  defaultToDate = '',
}: DashboardToolbarProps) {
  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);

  // ✅ Make date dynamic (today’s date)
  const today = new Date();
  const formattedDate = format(today, 'EEEE, d MMMM yyyy');

  const handleExport = () => {
    if (onExportClick) onExportClick({ fromDate, toDate });
  };

  return (
    <Card className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-3 border-none shadow-none bg-transparent">
      {/* Left section: Date and range */}
      <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
        {/* Current date */}
        <h2 className="text-lg font-semibold text-gray-800 whitespace-nowrap">
          {formattedDate}
        </h2>

        {/* Date range inputs */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Set the date from</span>
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
      </div>

      {/* Right section: Buttons */}
      <div className="flex items-center gap-2">
        {showFilter && (
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onFilterClick}
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        )}

        {showCard && (
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onCardClick}
          >
            <CreditCard className="h-4 w-4" />
            Card
          </Button>
        )}

        <Button
          onClick={handleExport}
          className="flex items-center gap-2 bg-sky-500/90 text-white hover:bg-sky-600"
        >
          <FileDown className="h-4 w-4" />
          {exportLabel}
        </Button>
      </div>
    </Card>
  );
}
