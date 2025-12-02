'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { FormField } from '@/components/form/FormField';
import { toast } from 'sonner';

import { CreateAgendaDto } from '@/lib/types/agenda';
import { addAgenda, updateAgenda, fetchAgendaById } from '@/redux/slices/agenda-thunks';
import { closeAgendaForm } from '@/redux/slices/agenda-slice';
import { SpeakerService } from '@/services/speaker.service';
interface SpeakerItem {
  _id: string;
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableSpeakers, setAvailableSpeakers] = useState<SpeakerItem[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [loadingSpeakers, setLoadingSpeakers] = useState(false);

  /* ---------------- Fetch Speakers ---------------- */
  useEffect(() => {
    if (!formOpen || !eventId) return;

    const loadSpeakers = async () => {
      setLoadingSpeakers(true);
      try {
        const res = await SpeakerService.getAll(eventId, { page: 1, limit: 100 });
        setAvailableSpeakers(res.data || []);
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to load speakers');
      } finally {
        setLoadingSpeakers(false);
      }
    };

    loadSpeakers();
  }, [formOpen, eventId]);

  /* ---------------- Prefill Form ---------------- */
  useEffect(() => {
    if (!editing) {
      setFormData(DEFAULT_FORM);
      setErrors({});
      return;
    }

    setFormData({
      title: editing.title ?? '',
      date: editing.date ?? '',
      startTime: editing.startTime ?? '',
      endTime: editing.endTime ?? '',
      description: editing.description ?? '',
      speakers: editing.speakers ?? [],
      hasPoll: Boolean(editing.hasPoll),
    });

    setErrors({});
  }, [editing]);

  /* ---------------- Handlers ---------------- */
  const updateField = (key: keyof typeof DEFAULT_FORM, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const addSpeaker = (id: string) => {
    if (!id) return;
    updateField('speakers', Array.from(new Set([...formData.speakers, id])));
    setSelectedSpeaker('');
  };

  const removeSpeaker = (id: string) => {
    updateField('speakers', formData.speakers.filter((s) => s !== id));
  };

  /* ---------------- Validation ---------------- */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.speakers.length === 0) newErrors.speakers = 'Please add at least one speaker';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- Submit ---------------- */
  const handleSave = async () => {
    if (!eventId) {
      toast.error('Missing Event ID');
      return;
    }

    if (!validate()) return;

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
        await dispatch(updateAgenda({ agendaId: editing._id, payload })).unwrap();
        toast.success('Agenda updated successfully');
      } else {
        await dispatch(addAgenda({ payload })).unwrap();
        toast.success('Agenda added successfully');
      }

      dispatch(closeAgendaForm());
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong while saving');
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <Dialog open={formOpen} onOpenChange={() => dispatch(closeAgendaForm())}>
      <DialogContent className="max-h-[85vh] w-[90%] max-w-lg overflow-y-auto rounded-lg p-4">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit Agenda' : 'Add Agenda'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <FormField label="Title">
            <Input
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Agenda title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </FormField>

          {/* Date */}
          <FormField label="Date">
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => updateField('date', e.target.value)}
              className={errors.date ? 'border-red-500' : ''}
            />
            {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
          </FormField>

          {/* Start & End Time */}
          <div className="flex gap-4">
            <FormField label="Start Time" className="flex-1">
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => updateField('startTime', e.target.value)}
                className={errors.startTime ? 'border-red-500' : ''}
              />
              {errors.startTime && <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>}
            </FormField>

            <FormField label="End Time" className="flex-1">
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => updateField('endTime', e.target.value)}
                className={errors.endTime ? 'border-red-500' : ''}
              />
              {errors.endTime && <p className="mt-1 text-xs text-red-500">{errors.endTime}</p>}
            </FormField>
          </div>

          {/* Description */}
          <FormField label="Description">
            <Textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
          </FormField>

          {/* Speakers */}
          <FormField label="Speakers">
            {loadingSpeakers ? (
              <p>Loading speakers…</p>
            ) : availableSpeakers.length === 0 ? (
              <p>No speakers available. Please add speakers first.</p>
            ) : (
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
                    <SelectItem key={sp._id} value={sp._id}>
                      {sp.name.firstName} {sp.name.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.speakers && <p className="mt-1 text-xs text-red-500">{errors.speakers}</p>}

      <div className="mt-3 space-y-2">
  {formData.speakers.map((id) => {
    const speaker = availableSpeakers.find((s) => s._id === id);
    return (
      <div
        key={id}
        className="flex items-center justify-between rounded bg-gray-100 px-3 py-2"
      >
        <span>
          {speaker ? `${speaker.name.firstName} ${speaker.name.lastName}` : id}
        </span>
        <Button variant="ghost" onClick={() => removeSpeaker(id)}>
          Remove
        </Button>
      </div>
    );
  })}
</div>

          </FormField>

          {/* Enable Poll */}
          <FormField>
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

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => dispatch(closeAgendaForm())}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editing ? 'Save Changes' : 'Add Agenda'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
