'use client';

import { useAppDispatch } from '@/redux/hooks';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { toast } from 'sonner';

import { Agenda, CreateAgendaDto } from '@/lib/types/agenda';
import { addAgenda, updateAgenda } from '@/redux/slices/agenda-thunks';
import { FormField } from '@/components/form/FormField';

interface SpeakerItem {
  id: string;
  name: string;
}

interface AgendaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: Agenda | null;
  eventId: string;
  onSuccess: () => void; // <-- matches AgendaPage
}

const DEFAULT_FORM = {
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  description: '',
  speakers: [] as string[],
  hasPoll: false,
};

export function AgendaFormDialog({
  open,
  onOpenChange,
  editData,
  eventId,
  onSuccess,
}: AgendaFormDialogProps) {
  const dispatch = useAppDispatch();

  // Temporary hardcoded speakers
  const availableSpeakers: SpeakerItem[] = [
    { id: '67b0c7a35d12a92c9b077777', name: 'Speaker A' },
    { id: '67b0c7a35d12a92c9b078888', name: 'Speaker B' },
  ];

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [selectedSpeaker, setSelectedSpeaker] = useState('');

  /* ---------------------------- Prefill on Edit ---------------------------- */
  useEffect(() => {
    if (!editData) {
      setFormData(DEFAULT_FORM);
      return;
    }

    const start = editData.startDateTime ? new Date(editData.startDateTime) : null;
    const end = editData.endDateTime ? new Date(editData.endDateTime) : null;

    setFormData({
      title: editData.title ?? '',
      date: start ? start.toISOString().split('T')[0] : '',
      startTime: start ? start.toISOString().slice(11, 16) : '',
      endTime: end ? end.toISOString().slice(11, 16) : '',
      description: editData.description ?? '',
      speakers: Array.from(new Set(editData.speakers ?? [])),
      hasPoll: Boolean(editData.hasPoll),
    });
  }, [editData]);

  /* ---------------------------- Helpers ---------------------------- */
  const updateField = (key: keyof typeof DEFAULT_FORM, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addSpeaker = (id: string) => {
    updateField('speakers', Array.from(new Set([...formData.speakers, id])));
    setSelectedSpeaker('');
  };

  const removeSpeaker = (id: string) => {
    updateField(
      'speakers',
      formData.speakers.filter((s) => s !== id),
    );
  };

  /* ---------------------------- Submit Logic ---------------------------- */
  const handleSave = async () => {
    const payload: CreateAgendaDto = {
      title: formData.title,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      description: formData.description,
      speakers: formData.speakers,
      hasPoll: formData.hasPoll,
    };

    try {
      if (editData) {
        await dispatch(
          updateAgenda({
            eventId,
            agendaId: editData._id,
            payload,
          }),
        ).unwrap();

        toast.success('Agenda updated successfully');
      } else {
        await dispatch(addAgenda({ eventId, payload })).unwrap();
        toast.success('Agenda added successfully');
      }

      onSuccess(); // <-- triggers parent reload
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  /* ---------------------------- UI ---------------------------- */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-[90%] max-w-lg overflow-y-auto rounded-lg p-4">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Agenda' : 'Add Agenda'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <FormField label="Title">
            <Input
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Agenda title"
            />
          </FormField>

          <FormField label="Date">
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => updateField('date', e.target.value)}
            />
          </FormField>

          <div className="flex gap-4">
            <FormField label="Start Time" className="flex-1">
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => updateField('startTime', e.target.value)}
              />
            </FormField>

            <FormField label="End Time" className="flex-1">
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => updateField('endTime', e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Description">
            <Textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </FormField>

          {/* Speakers */}
          <FormField label="Speakers">
            <Select
              value={selectedSpeaker}
              onValueChange={(v) => {
                setSelectedSpeaker(v);
                addSpeaker(v);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Add a speaker" />
              </SelectTrigger>

              <SelectContent>
                {availableSpeakers.map((sp) => (
                  <SelectItem key={sp.id} value={sp.id}>
                    {sp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-3 space-y-2">
              {formData.speakers.map((id) => {
                const speaker = availableSpeakers.find((s) => s.id === id);
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between rounded bg-gray-100 px-3 py-2"
                  >
                    <span>{speaker?.name ?? id}</span>
                    <Button variant="ghost" onClick={() => removeSpeaker(id)}>
                      Remove
                    </Button>
                  </div>
                );
              })}
            </div>
          </FormField>

          {/* Poll checkbox */}
          <FormField label="Enable Poll">
            <div className="flex items-center gap-2">
              <input
                id="poll-checkbox"
                type="checkbox"
                checked={formData.hasPoll}
                onChange={(e) => updateField('hasPoll', e.target.checked)}
              />
              <Label htmlFor="poll-checkbox">Enable Poll</Label>
            </div>
          </FormField>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{editData ? 'Save Changes' : 'Add Agenda'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
