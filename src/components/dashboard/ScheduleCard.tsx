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
        className={`transition-shadow hover:shadow-md overflow-hidden cursor-pointer ${
          selected ? 'ring-2 ring-primary' : ''
        }`}
      >
        <CardHeader>
          <h3 className="text-base leading-tight font-semibold">{title}</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Lorem ipsum dolor sit amet consectetur.
          </p>
        </CardHeader>

        <CardContent className="text-muted-foreground flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{day}</span>
          </div>
          <span>{time}</span>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {image && (
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src={image}
                  alt={`${speaker} photo`}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            )}
            <div>
              <p className="text-sm font-medium">{speaker}</p>
              <p className="text-muted-foreground text-xs">{position}</p>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* 🧩 Keep height stable by reserving space */}
      <div className="h-12 flex items-center justify-center">
        {selected && (
          <Button size="sm" variant="default" className="bg-blue-500">
            See Detail
          </Button>
        )}
      </div>
    </div>
  );
}
