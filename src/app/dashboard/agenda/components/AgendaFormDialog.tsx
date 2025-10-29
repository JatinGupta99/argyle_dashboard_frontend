'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onOpenChange: () => void;
}

export function AgendaFormDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Agenda</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input placeholder="Title" />
          <Input type="date" placeholder="Date" />
          <Input placeholder="Speaker" />
          <Textarea placeholder="Description" />
          <Button>Add Agenda</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
