'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScheduleCardProps {
  description: string;
  eventId: string;
  title: string;
  time: string;
  day: string;
  speaker: string;
  position: string;
  image?: string;
  selected?: boolean;
  onSelect?: () => void;
}

export function ScheduleCard({
  description,
  eventId,
  title,
  time,
  day,
  speaker,
  position,
  image,
  selected = false,
  onSelect,
}: ScheduleCardProps) {
  const router = useRouter();
  console.log(eventId, 'acslascln');
  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/events/${eventId}`);
  };

  return (
    <div className="flex w-full flex-col items-center">
      {/* CARD */}
      <Card
        onClick={onSelect}
        className={`w-full cursor-pointer overflow-hidden rounded-xl transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] ${selected ? 'shadow-xl ring-2 ring-sky-500' : 'shadow-sm'} `}
      >
        {/* Header */}
        <CardHeader className="pb-2">
          <h3 className="text-base leading-tight font-semibold">{title}</h3>
          <p className="mt-1 line-clamp-3 text-sm text-gray-700">{description}</p>
        </CardHeader>

        {/* Schedule Row */}
        <CardContent className="mx-2 flex items-center justify-between rounded-lg border-y border-black/10 bg-gray-50 px-3 py-1 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-sky-600" />
            <span>{day}</span>
          </div>
          <span className="font-medium text-sky-600">{time}</span>
        </CardContent>

        {/* Speaker Row */}
        <CardFooter className="flex items-center justify-between pt-3 pb-4">
          <div className="flex items-center gap-3">
            {image ? (
              <div className="relative h-10 w-10 overflow-hidden rounded-md">
                <Image
                  src={image}
                  alt={`${speaker} photo`}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-md bg-gray-200" />
            )}

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-gray-800">{speaker}</span>
              <span className="text-xs text-gray-500">{position}</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* SEE DETAIL BUTTON */}
      {selected && (
        <div className="mt-1 flex h-10 items-center justify-center">
          <Button
            size="sm"
            className="bg-sky-500 px-4 text-white hover:bg-sky-600"
            onClick={handleDetailClick}
          >
            See Detail
          </Button>
        </div>
      )}
    </div>
  );
}
