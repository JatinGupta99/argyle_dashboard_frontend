export default function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    UPCOMING: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    LIVE: 'bg-red-100 text-red-600',
    ADMIN: 'bg-blue-100 text-blue-700',
  };

  // Fallback if unknown status
  const appliedStyle = styles[status] || 'bg-gray-200 text-gray-700';

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${appliedStyle}`}>{status}</span>
  );
}
