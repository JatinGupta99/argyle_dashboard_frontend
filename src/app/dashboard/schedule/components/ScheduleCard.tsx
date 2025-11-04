'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScheduleCardProps {
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
  title,
  time,
  day,
  speaker,
  position,
  image,
  selected,
  onSelect,
}: ScheduleCardProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Card clickable */}
      <Card
        onClick={onSelect}
        className={`cursor-pointer overflow-hidden transition-shadow hover:shadow-md ${
          selected ? 'ring-primary ring-2' : ''
        }`}
      >
        <CardHeader>
          <h3 className="text-base leading-tight font-semibold">{title}</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Lorem ipsum dolor sit amet consectetur.
          </p>
        </CardHeader>

        <CardContent className="text-muted-foreground flex items-center justify-between text-sm">
          {/* 📅 Calendar inside blue rectangular box */}
          <div className="flex items-center gap-2 rounded-md bg-sky-500 px-2 py-1 text-xs font-medium text-white">
            <Calendar className="h-3 w-3" />
            <span>{day}</span>
          </div>

          <span>{time}</span>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {image && (
              <button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-gray-50 transition hover:bg-gray-100"
              >
                <Image
                  src={image} // ✅ use image prop here
                  alt={speaker} // ✅ use speaker name for alt
                  fill
                  className="rounded-md object-cover"
                  sizes="36px"
                />
              </button>
            )}

            <div>
              <p className="text-sm font-medium">{speaker}</p>
              <p className="text-muted-foreground text-xs">{position}</p>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Reserve space for button */}
      <div className="flex h-12 items-center justify-center">
        {selected && (
          <Button size="sm" variant="default" className="bg-blue-500">
            See Detail
          </Button>
        )}
      </div>
    </div>
  );
}
