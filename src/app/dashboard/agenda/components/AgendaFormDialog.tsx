'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface Agenda {
  id?: string;
  title: string;
  date: string;
  timeStart: string;
  timeStartPeriod: 'AM' | 'PM';
  timeEnd: string;
  timeEndPeriod: 'AM' | 'PM';
  description: string;
  speaker: string;
  audiencePoll?: boolean;
  profileUrl?: string;
  position?: string;
}

interface AgendaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (agenda: Agenda) => void;
  editData?: Partial<Agenda>;
  speakerOptions?: string[];
}

const defaultForm: Agenda = {
  title: '',
  date: '',
  timeStart: '',
  timeStartPeriod: 'AM',
  timeEnd: '',
  timeEndPeriod: 'AM',
  description: '',
  speaker: 'Audience Polls',
  audiencePoll: false,
};

export function AgendaFormDialog({
  open,
  onOpenChange,
  onSubmit,
  editData,
  speakerOptions = ['Audience Polls'],
}: AgendaFormDialogProps) {
  const [form, setForm] = useState<Agenda>(defaultForm);

  // Prefill for edit mode
  useEffect(() => {
    if (editData) {
      setForm({
        ...defaultForm,
        ...editData,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editData, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm(defaultForm);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Agenda' : 'Add Agenda'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Time Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Time</Label>
              <div className="flex gap-2">
                <Input
                  name="timeStart"
                  type="time"
                  value={form.timeStart}
                  onChange={handleChange}
                  required
                />
                <select
                  name="timeStartPeriod"
                  value={form.timeStartPeriod}
                  onChange={handleChange}
                  className="rounded-md border px-2 py-1 text-sm"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            <div>
              <Label>End Time</Label>
              <div className="flex gap-2">
                <Input
                  name="timeEnd"
                  type="time"
                  value={form.timeEnd}
                  onChange={handleChange}
                  required
                />
                <select
                  name="timeEndPeriod"
                  value={form.timeEndPeriod}
                  onChange={handleChange}
                  className="rounded-md border px-2 py-1 text-sm"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Speaker */}
          <div>
            <Label htmlFor="speaker">Speaker</Label>
            <select
              id="speaker"
              name="speaker"
              value={form.speaker}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {speakerOptions.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Audience Poll Toggle */}
          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <Label htmlFor="audiencePoll" className="text-sm font-medium">
              Enable Audience Poll
            </Label>
            <Switch
              id="audiencePoll"
              checked={form.audiencePoll}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, audiencePoll: checked }))}
              className={cn('data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300')}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <Button type="submit">{editData ? 'Update Agenda' : 'Add Agenda'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
