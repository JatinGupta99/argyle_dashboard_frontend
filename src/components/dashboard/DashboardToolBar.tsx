'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { Filter, FileDown, CreditCard } from 'lucide-react';

export function DashboardToolbar() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const today = new Date(2025, 9, 23); // October = month index 9
  const formattedDate = format(today, 'EEEE, d MMMM yyyy'); // "Thursday, 23 October 2025"

  return (
    <Card className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-3 border-none shadow-none bg-transparent">
      {/* Left section: Date and range */}
      <div className="flex items-center gap-6">
        {/* Date */}
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
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Card
        </Button>
        <Button className="flex items-center gap-2 bg-sky-500/90 text-white hover:bg-sky-600">
          <FileDown className="h-4 w-4" />
          Export
        </Button>
      </div>
    </Card>
  );
}
