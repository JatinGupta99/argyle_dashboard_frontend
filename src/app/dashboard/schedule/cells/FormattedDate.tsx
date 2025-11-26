import React from 'react';

export default function FormattedDate({ date }: { date: string }) {
  if (!date) return <span>N/A</span>;

  return <>{new Date(date).toLocaleDateString('en-GB')}</>;
}
