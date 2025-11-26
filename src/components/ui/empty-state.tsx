'use client';

interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className = '' }: EmptyStateProps) {
  return <div className={`py-10 text-center text-gray-500 ${className}`}>{message}</div>;
}
