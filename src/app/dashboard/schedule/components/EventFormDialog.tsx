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
import { closeEventForm, addEvent, updateEventInState } from '@/redux/slices/event-slice';
import { createEvent, fetchEventById, updateEvent } from '@/redux/slices/event-thunks';
import { Upload } from 'lucide-react';
import { DragEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Event } from '@/lib/types/components';
import { EventService } from '@/services/event.service';

interface FormData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  eventLogoUrl?: string;
}

const DEFAULT_FORM: FormData = {
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

  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill form when editing
  // useEffect(() => {
  //   if (editing) {
  //     setFormData({
  //       title: editing.title,
  //       date: editing.eventDate?.split('T')[0] || '',
  //       startTime: editing.schedule?.startTime?.slice(11, 16) || '',
  //       endTime: editing.schedule?.endTime?.slice(11, 16) || '',
  //       description: editing.description,
  //       eventLogoUrl: editing.eventLogoUrl || '',
  //     });
  //     setImagePreview(editing.eventLogoUrl || null);
  //     setImageFile(null);
  //   } else if (!formOpen) {
  //     setFormData(DEFAULT_FORM);
  //     setImageFile(null);
  //     setImagePreview(null);
  //   }
  // }, [editing, formOpen]);

    useEffect(() => {
    if (editing && editing._id) {
      dispatch(fetchEventById(editing._id))
        .unwrap()
        .then((event) => {
          setFormData({
            title: event.title,
            date: event.EventDate?.split('T')[0] || '',
            startTime: event.schedule?.startTime.toString()?.slice(11, 16) || '',
            endTime: event.schedule?.endTime?.toString().slice(11, 16) || '',
            description: event.eventDetails,
            eventLogoUrl: event.eventLogoUrl || '',
          });
          setImagePreview(event.eventLogoUrl || null);
          setImageFile(null);
        })
        .catch(() => toast.error('Failed to fetch event data'));
    } else if (!formOpen) {
      setFormData(DEFAULT_FORM);
      setImageFile(null);
      setImagePreview(null);
    }
  }, [editing, formOpen, dispatch]);
  const updateField = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
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

  const validate = () => {
    if (!formData.title.trim()) return 'Event title is required';
    if (!formData.date.trim()) return 'Event date is required';
    if (!formData.startTime.trim()) return 'Start time is required';
    if (!formData.endTime.trim()) return 'End time is required';
    return null;
  };

  // Upload image to S3 if a new file is selected
  const uploadImage = async () => {
    if (!imageFile) return formData.eventLogoUrl || '';
    if (!editing?._id) return formData.eventLogoUrl || '';

    const presignedRes = await EventService.getUploadUrl({
      eventId: editing?._id || 'temp-id',
      contentType: imageFile.type,
      type: 'logo',
    });

    const res = await fetch(presignedRes.data.url, {
      method: 'PUT',
      body: imageFile,
      headers: { 'Content-Type': imageFile.type },
    });

    if (!res.ok) throw new Error('Failed to upload image');
    return presignedRes.data.url.split('?')[0]; // clean URL
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) return toast.error(err);

    try {
      const startTime = new Date(`${formData.date}T${formData.startTime}:00`);
      const endTime = new Date(`${formData.date}T${formData.endTime}:00`);
      const now = new Date();

      if (startTime <= now) return toast.error('Start time must be in the future');
      if (endTime <= now) return toast.error('End time must be in the future');
      if (endTime <= startTime) return toast.error('End time must be after start time');

      const uploadedUrl = await uploadImage();

      const payload = {
        title: formData.title.trim(),
        description: formData.description,
        eventDate: formData.date,
        schedule: { startTime: startTime.toISOString(), endTime: endTime.toISOString() },
        eventLogoUrl: uploadedUrl,
      };

      let event: Event;
      if (editing) {
        event = await dispatch(updateEvent({ id: editing._id, payload, imageFile })).unwrap();
        dispatch(updateEventInState(event)); // update Redux state immediately
        toast.success('Event updated successfully');
      } else {
        event = await dispatch(createEvent({ payload, imageFile })).unwrap();
        dispatch(addEvent(event)); // add to Redux state immediately
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
              className="cursor-pointer rounded-md border-2 border-dashed p-6 text-center relative"
            >
              {!imageFile && !imagePreview ? (
                <div className="flex flex-col items-center text-sm opacity-60">
                  <Upload className="mb-2 h-6 w-6" />
                  Drag or click to upload image
                </div>
              ) : (
                <div className="relative inline-block">
                  <img
                    src={imagePreview!}
                    alt="Preview"
                    className="h-20 w-20 rounded-md border object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute -top-2 -right-2 rounded-full bg-red-600 text-white w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

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
