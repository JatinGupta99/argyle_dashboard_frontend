import { Button } from '@/components/ui/button';
import { redirect, RedirectType } from 'next/navigation'
export default function Home() {
  return (
    <div>
      <Button variant="outline" onClick={() => redirect('/dashboard/schedule', RedirectType.push)}>Go to Dashboard</Button>
    </div>
  );
}
