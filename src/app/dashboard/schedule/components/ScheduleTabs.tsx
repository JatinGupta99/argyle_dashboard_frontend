'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ScheduleList } from './ScheduleList';

const TABS = [
  { value: 'pending', label: 'Pending', count: 3 },
  { value: 'upcoming', label: 'Upcoming', count: 5 },
  { value: 'past', label: 'Past', count: 2 },
];

export function ScheduleTabs() {
  return (
    <div className="flex flex-1 flex-col">
      <Tabs defaultValue="pending" className="flex flex-1 flex-col">
        <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
          <TabsList className="flex w-full justify-between gap-4 bg-transparent p-0">
            {TABS.map(({ value, label, count }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-medium shadow-sm transition-all hover:bg-gray-100 data-[state=active]:border-sky-500 data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-sky-500/90 px-3 py-1 text-xs font-semibold text-white">
                    {count}
                  </span>
                  <span className="text-gray-800">{label}</span>
                </div>
                <MoreVertIcon fontSize="small" className="text-gray-500" />
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4">
          {TABS.map(({ value }) => (
            <TabsContent key={value} value={value}>
              <ScheduleList />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
