'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScheduleCardProps {
  title: string;
  time: string;
  day: string;
  speaker: string;
  position: string;
}

export function ScheduleCard({ title, time, day, speaker, position }: ScheduleCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
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
        <div>
          <p className="text-sm font-medium">{speaker}</p>
          <p className="text-muted-foreground text-xs">{position}</p>
        </div>
        <Button size="sm" variant="secondary">
          See Detail
        </Button>
      </CardFooter>
    </Card>
  );
}
