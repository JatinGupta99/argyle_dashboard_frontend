'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SpeakerFormDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Speaker</DialogTitle>
        </DialogHeader>

        <form className="space-y-4 mt-4">
          <Input placeholder="First Name" />
          <Input placeholder="Last Name" />
          <Input placeholder="Email" type="email" />
          <Input placeholder="Company" />
          <Input placeholder="Title" />
          <Textarea placeholder="Bio" />
          <Input placeholder="LinkedIn URL" />

          <div className="flex justify-end">
            <Button type="button" onClick={() => onOpenChange(false)}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
