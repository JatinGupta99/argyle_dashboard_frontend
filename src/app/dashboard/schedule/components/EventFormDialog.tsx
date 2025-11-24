'use client';

import { FormField } from '@/components/form/FormField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { closeEventForm, CreateEventForm, UpdateEventForm } from '@/redux/slices/event-slice';
import { createEvent, updateEvent } from '@/redux/slices/event-thunks';
import { Upload } from 'lucide-react';
import { DragEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

// Define a clean EventForm type for the form

// Default form state
const DEFAULT_FORM: CreateEventForm = {
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  description: '',
  eventLogoUrl: '',
};

export function EventFormDialog() {
  const dispatch = useAppDispatch();
  const { formOpen, editing, loading } = useAppSelector((s) => s.events);

  const [formData, setFormData] = useState<CreateEventForm>(DEFAULT_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formOpen && editing) {
      setFormData({
        title: editing.title??'',
        date: editing.date ?? '',
        startTime: editing.startTime ?? '',
        endTime: editing.endTime ?? '',
        description: editing.description ?? '',
        eventLogoUrl: editing.imageUrl ?? '',
      });
      setImagePreview(editing.imageUrl ?? null);
      setImageFile(null);
    } else if (!formOpen) {
      setFormData(DEFAULT_FORM);
      setImageFile(null);
      setImagePreview(null);
    }
  }, [formOpen, editing]);

  const updateField = (key: keyof UpdateEventForm, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!formData.title.trim()) return 'Event title is required';
    if (!formData.date.trim()) return 'Event date is required';
    if (!formData.startTime.trim()) return 'Start time is required';
    if (!formData.endTime.trim()) return 'End time is required';
    return null;
  };

  const handleImageClick = () => imageInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClose = () => dispatch(closeEventForm());
const handleSubmit = async () => {
  const err = validate();
  if (err) return toast.error(err);

  // Convert date + time strings to Date objects
  const startTime = new Date(`${formData.date}T${formData.startTime}:00`);
  const endTime = new Date(`${formData.date}T${formData.endTime}:00`);
  const now = new Date();

  // Frontend validation for future dates
  if (startTime <= now) return toast.error('Start time must be in the future');
  if (endTime <= now) return toast.error('End time must be in the future');
  if (endTime <= startTime) return toast.error('End time must be after start time');

  const schedule = {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  };

  const payload: any = {
    title: formData.title.trim().replace(/\s+/g, '-').toLowerCase(),
    description: formData.description,
    schedule,
    eventDate: formData.date,
  };

  if (imageFile) payload.eventLogoUrl = formData.eventLogoUrl;

  try {
    if (editing) {
      await dispatch(
        updateEvent({
          id: editing._id,
          payload,
          imageFile,
        })
      ).unwrap();
      toast.success('Event updated successfully');
    } else {
      await dispatch(createEvent({ payload, imageFile })).unwrap();
      toast.success('Event created successfully');
    }
    handleClose();
  } catch (error: any) {
    toast.error(error?.message || 'Failed to save event');
  }
};






  return (
    <Dialog open={formOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-h-[85vh] w-[90%] max-w-lg overflow-y-auto rounded-lg p-4">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit Event' : 'Add Event'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <FormField label="Event Title">
            <Input
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="My Event"
            />
          </FormField>

          <div className="flex gap-4">
            <FormField label="Date" className="flex-1">
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
              />
            </FormField>

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
              rows={3}
            />
          </FormField>

          <FormField label="Upload Event Logo">
            <div
              onClick={handleImageClick}
              onDrop={handleImageDrop}
              onDragOver={(e) => e.preventDefault()}
              className="cursor-pointer rounded-md border-2 border-dashed p-6 text-center"
            >
              {!imageFile ? (
                <div className="flex flex-col items-center text-sm opacity-60">
                  <Upload className="mb-2 h-6 w-6" />
                  Drag or click to upload image
                </div>
              ) : (
                <p>{imageFile.name}</p>
              )}
            </div>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 h-20 w-20 rounded-md border object-cover"
              />
            )}

            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </FormField>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving…' : editing ? 'Update Event' : 'Add Event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
