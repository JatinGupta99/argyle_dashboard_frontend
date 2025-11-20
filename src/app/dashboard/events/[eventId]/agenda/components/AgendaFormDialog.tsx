'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
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

import { CreateAgendaDto } from '@/lib/types/agenda';
import { addAgenda, updateAgenda, fetchAgendaById } from '@/redux/slices/agenda-thunks';
import { closeAgendaForm } from '@/redux/slices/agenda-slice';
import { FormField } from '@/components/form/FormField';

interface SpeakerItem {
  id: string;
  name: string;
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

export function AgendaFormDialog() {
  const dispatch = useAppDispatch();

  const { formOpen, editing, eventId } = useAppSelector((s) => s.agendas);

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [selectedSpeaker, setSelectedSpeaker] = useState('');

  /* ---------------- Temporary Speaker List 👇 Replace when API ready ---------------- */
  const availableSpeakers: SpeakerItem[] = [
    { id: '67b0c7a35d12a92c9b077777', name: 'Speaker A' },
    { id: '67b0c7a35d12a92c9b078888', name: 'Speaker B' },
  ];

  /* ---------------- Load agenda from API when editing ---------------- */
  useEffect(() => {
    if (formOpen && editing && eventId) {
      dispatch(fetchAgendaById({ agendaId: editing._id }));
    }
  }, [formOpen, editing, eventId, dispatch]);

  /* ---------------- Prefill Form When Editing Data Arrives ---------------- */
  useEffect(() => {
    if (!editing) {
      setFormData(DEFAULT_FORM);
      return;
    }

    const start = editing.startDateTime ? new Date(editing.startDateTime) : null;
    const end = editing.endDateTime ? new Date(editing.endDateTime) : null;

    setFormData({
      title: editing.title ?? "",
      date: start ? start.toISOString().split("T")[0] : "",
      startTime: start ? start.toISOString().slice(11, 16) : "",
      endTime: end ? end.toISOString().slice(11, 16) : "",
      description: editing.description ?? "",
      speakers: editing.speakers ?? [],
      hasPoll: Boolean(editing.hasPoll),
    });
  }, [editing]);

  /* ---------------- Handlers ---------------- */
  const updateField = (key: keyof typeof DEFAULT_FORM, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addSpeaker = (id: string) => {
    updateField('speakers', Array.from(new Set([...formData.speakers, id])));
    setSelectedSpeaker('');
  };

  const removeSpeaker = (id: string) => {
    updateField('speakers', formData.speakers.filter((s) => s !== id));
  };

  /* ---------------- Submit ---------------- */
  const handleSave = async () => {
    if (!eventId) {
      toast.error("Missing Event ID");
      return;
    }

    const payload: CreateAgendaDto = {
      title: formData.title.trim(),
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      description: formData.description.trim(),
      speakers: formData.speakers,
      hasPoll: formData.hasPoll,
    };

    try {
      if (editing) {
        await dispatch(
          updateAgenda({
            agendaId: editing._id,
            payload,
          })
        ).unwrap();

        toast.success("Agenda updated successfully");
      } else {
        await dispatch(
          addAgenda({ payload })
        ).unwrap();

        toast.success("Agenda added successfully");
      }

      dispatch(closeAgendaForm());
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong while saving");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <Dialog open={formOpen} onOpenChange={() => dispatch(closeAgendaForm())}>
      <DialogContent className="max-h-[85vh] w-[90%] max-w-lg overflow-y-auto rounded-lg p-4">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Agenda" : "Add Agenda"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <FormField label="Title">
            <Input
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Agenda title"
            />
          </FormField>

          {/* Date */}
          <FormField label="Date">
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => updateField('date', e.target.value)}
            />
          </FormField>

          {/* Time */}
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

          {/* Description */}
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

          {/* Poll Toggle */}
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

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => dispatch(closeAgendaForm())}>
            Cancel
          </Button>

          <Button onClick={handleSave}>
            {editing ? "Save Changes" : "Add Agenda"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
