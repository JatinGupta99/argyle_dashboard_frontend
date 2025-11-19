'use client';

import { useEventsContext } from '@/components/providers/EventsContextProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMemo } from 'react';
import { ScheduleTableCardList } from './ScheduleTableCardList';

export function ScheduleTabs() {
  const events = useEventsContext();

  // Normalize statuses to uppercase
  const normalize = (e: any) => e.status?.toUpperCase();

  // Group events
  const eventGroups = useMemo(() => {
    const all = events;

    const upcoming = events.filter((e) => normalize(e) === 'UPCOMING');
    const past = events.filter((e) => normalize(e) === 'PAST');
    const pending = events.filter((e) => normalize(e) === 'PENDING');

    return { all, upcoming, past, pending };
  }, [events]);

  const TABS = [
    { value: 'all', label: 'ALL', data: eventGroups.all },
    { value: 'upcoming', label: 'UPCOMING', data: eventGroups.upcoming },
    { value: 'pending', label: 'PENDING', data: eventGroups.pending },
    { value: 'past', label: 'PAST', data: eventGroups.past },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <Tabs defaultValue="all" className="flex flex-1 flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
          <TabsList className="flex w-full justify-between gap-3 bg-transparent p-0">
            {TABS.map(({ value, label, data }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-medium shadow-sm transition-all hover:bg-gray-100 data-[state=active]:border-sky-500 data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                <span className="text-gray-800">{label}</span>

                <span className="rounded-md bg-sky-500 px-2 py-0.5 text-xs text-white">
                  {data.length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4">
          {TABS.map(({ value, data }) => (
            <TabsContent key={value} value={value}>
              <ScheduleTableCardList events={data} />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
