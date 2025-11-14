import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Speaker } from '@/lib/types/schedule';

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

export default function SpeakerCell({ speakers }: { speakers: Speaker[] }) {
  if (!speakers?.length) return <span className="text-gray-500 italic">No speakers assigned</span>;

  const visible = speakers.slice(0, 3);
  const extra = speakers.length - visible.length;

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2 overflow-hidden">
        {visible.map((speaker, i) => (
          <Avatar key={speaker.name || i} className="h-8 w-8 border-2 border-white">
            <AvatarImage src={speaker.profileUrl} alt={speaker.name} />
            <AvatarFallback>{getInitials(speaker.name)}</AvatarFallback>
          </Avatar>
        ))}
        {extra > 0 && (
          <span className="gap-1 px-3 py-2 text-xs font-semibold text-gray-600">
            {extra} more people
          </span>
        )}
      </div>
    </div>
  );
}
