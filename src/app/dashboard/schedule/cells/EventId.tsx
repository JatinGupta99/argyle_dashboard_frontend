import React from 'react';

export default function EventId({ id }: { id: string }) {
  return <span className="text-xs font-bold text-sky-500">#{id.slice(-4)}</span>;
}
