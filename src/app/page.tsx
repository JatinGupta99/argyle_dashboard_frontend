import { redirect, RedirectType } from 'next/navigation';
import { Button } from '@/components/ui/button';
export default function Home() {
  return (
    <div>
      <Button variant="outline" onClick={() => redirect('/dashboard/schedule', RedirectType.push)}>
        Go to Dashboard
      </Button>
    </div>
  );
}
