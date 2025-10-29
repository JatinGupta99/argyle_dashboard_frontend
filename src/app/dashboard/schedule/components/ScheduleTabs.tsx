'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScheduleList } from './ScheduleList';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const TABS = [
  { value: 'pending', label: 'Pending', count: 3 },
  { value: 'upcoming', label: 'Upcoming', count: 5 },
  { value: 'past', label: 'Past', count: 2 },
];

export function ScheduleTabs() {
  return (
    <div className="flex h-full w-full flex-col">
      <Tabs defaultValue="pending" className="flex h-full w-full flex-col">
        {/* Tabs Header */}
        <div className="sticky top-2 z-10 flex-shrink-0 bg-gray-50 pb-2">
          <TabsList className="flex w-full justify-between gap-6 bg-transparent p-0">
            {TABS.map(({ value, label, count }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm transition-all data-[state=active]:border-blue-500 data-[state=active]:shadow-md"
              >
                {/* Label + Count */}
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-sky-500/90 px-3 py-1 text-sm font-medium text-white">
                    {count}
                  </span>
                  <span className="font-medium text-gray-800">{label}</span>
                </div>

                {/* Action Icon */}
                <MoreVertIcon fontSize="small" className="text-gray-500" />
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tabs Content */}
        <div className="flex-1 overflow-y-auto">
          {TABS.map(({ value }) => (
            <TabsContent key={value} value={value}>
              <ScheduleList  />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
