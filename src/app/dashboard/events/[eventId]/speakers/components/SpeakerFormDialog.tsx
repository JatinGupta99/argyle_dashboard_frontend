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
import type { CreateSpeakerDto } from '@/lib/types/speaker';
import { SpeakerType } from '@/lib/types/types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { closeSpeakerForm } from '@/redux/slices/speaker-slice';
import { createSpeaker, fetchSpeakers, updateSpeaker, uploadSpeakerImage } from '@/redux/slices/speaker-thunks';
import { Upload } from 'lucide-react';
import { DragEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const DEFAULT_FORM: CreateSpeakerDto = {
  name: { firstName: '', lastName: '' },
  title: '',
  email: '',
  linkedInUrl: '',
  contactId: '',
  companyName: '',
  bio: '',
  pictureUrl: '',
  speakerType: SpeakerType.SPEAKER_TBD,
};

export function SpeakerFormDialog() {
  const dispatch = useAppDispatch();
  const { formOpen, editing, eventId, loading } = useAppSelector((s) => s.speakers);

  const [formData, setFormData] = useState<CreateSpeakerDto>(DEFAULT_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const photoInputRef = useRef<HTMLInputElement>(null);

  // ---------------- Prefill / Reset Form ----------------
  useEffect(() => {
    if (formOpen && editing) {
      console.log(editing,'csalnlcasknlac')
      setFormData({
        
        name: editing.name || { firstName: '', lastName: '' },
        title: editing.title ?? '',
        email: editing.email ?? '',
        linkedInUrl: editing.linkedInUrl ?? '',
        contactId: editing.contactId ?? editing.email ?? '',
        companyName: editing.companyName ?? '',
        bio: editing.bio ?? '',
        pictureUrl: editing.pictureUrl ?? '',
        speakerType: editing.speakerType ?? SpeakerType.SPEAKER_TBD,
      });

      setPhotoPreview(editing.pictureUrl ?? null);
      setPhotoFile(null);
      setErrors({});
    } else if (!formOpen) {
      setFormData(DEFAULT_FORM);
      setPhotoFile(null);
      setPhotoPreview(null);
      setErrors({});
    }
  }, [formOpen, editing]);

  // ---------------- Form Field Update ----------------
  const updateField = (key: string, value: string, nested = false) => {
    setFormData((prev) =>
      nested ? { ...prev, name: { ...prev.name, [key]: value } } : { ...prev, [key]: value }
    );

    // Clear field error on change
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  // ---------------- Photo Handlers ----------------
  const handlePhotoClick = () => photoInputRef.current?.click();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handlePhotoDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // ---------------- Validation ----------------
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.name.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.linkedInUrl.trim()) newErrors.linkedInUrl = 'LinkedIn URL is required';
    else if (!/^https:\/\/(www\.)?linkedin\.com\/(in|company)\/[\w\d_-]+\/?$/i.test(formData.linkedInUrl))
      newErrors.linkedInUrl = 'Invalid LinkedIn URL';
    if (!photoFile && !editing) newErrors.photo = 'Photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- Close ----------------
  const handleClose = () => dispatch(closeSpeakerForm());

  // ---------------- Submit ----------------
  const handleSubmit = async () => {
    if (!validate()) return;
    if (!eventId) return toast.error('Event ID not set');

    try {
      let speakerId = editing?._id;

      const payload: CreateSpeakerDto = {
        ...formData,
        contactId: formData.email.trim(),
        name: {
          firstName: formData.name.firstName.trim(),
          lastName: formData.name.lastName.trim(),
        },
      };

      // 1️⃣ Create or Update Speaker (without picture)
      if (!editing) {
        const createdSpeaker = await dispatch(createSpeaker({ data: payload })).unwrap();
        speakerId = createdSpeaker._id;
      } else {
        await dispatch(updateSpeaker({ id: speakerId!, payload })).unwrap();
      }

      // 2️⃣ Upload Photo if exists
      if (photoFile && speakerId) {
        const imageKey = await dispatch(uploadSpeakerImage({ file: photoFile, speakerId })).unwrap();

        // 3️⃣ Update Speaker with picture URL
        await dispatch(updateSpeaker({ id: speakerId, payload: { ...payload, pictureUrl: imageKey } })).unwrap();
      }

      toast.success(editing ? 'Speaker updated' : 'Speaker added');
      dispatch(fetchSpeakers({ page: 1, limit: 10 }));
      handleClose();
    } catch (error: any) {
      console.error('❌ Save Speaker Error:', error);
      toast.error(error?.message || 'Failed to save speaker');
    }
  };

  return (
    <Dialog open={formOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-h-[85vh] w-[90%] max-w-lg overflow-y-auto rounded-lg p-4">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit Speaker' : 'Add Speaker'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="flex gap-4">
            <FormField label="First Name" className="flex-1">
              <Input
                value={formData.name.firstName}
                onChange={(e) => updateField('firstName', e.target.value, true)}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
            </FormField>
            <FormField label="Last Name" className="flex-1">
              <Input
                value={formData.name.lastName}
                onChange={(e) => updateField('lastName', e.target.value, true)}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
            </FormField>
          </div>

          {/* Title */}
          <FormField label="Title in Company">
            <Input
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </FormField>

          {/* Email */}
          <FormField label="Email">
            <Input
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </FormField>

          {/* LinkedIn */}
          <FormField label="LinkedIn URL">
            <Input
              value={formData.linkedInUrl}
              onChange={(e) => updateField('linkedInUrl', e.target.value)}
              className={errors.linkedInUrl ? 'border-red-500' : ''}
            />
            {errors.linkedInUrl && <p className="mt-1 text-xs text-red-500">{errors.linkedInUrl}</p>}
          </FormField>

          {/* Speaker Type */}
          <FormField label="Speaker Type">
            <select
              className="w-full rounded-md border p-2"
              value={formData.speakerType}
              onChange={(e) => updateField('speakerType', e.target.value)}
            >
              {Object.values(SpeakerType).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </FormField>

          {/* Photo Upload */}
          <FormField label="Upload Photo">
            <div
              onClick={handlePhotoClick}
              onDrop={handlePhotoDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`cursor-pointer rounded-md border-2 border-dashed p-6 text-center ${errors.photo ? 'border-red-500' : ''}`}
            >
              {!photoFile ? (
                <div className="flex flex-col items-center text-sm opacity-60">
                  <Upload className="mb-2 h-6 w-6" />
                  Drag or click to upload photo
                </div>
              ) : <p>{photoFile.name}</p>}
            </div>

            {photoPreview && (
              <div className="relative mt-2 inline-block">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="h-20 w-20 rounded-md border object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoPreview(null);
                    if (photoInputRef.current) photoInputRef.current.value = '';
                  }}
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}

            <input
              type="file"
              ref={photoInputRef}
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />

            {errors.photo && <p className="mt-1 text-xs text-red-500">{errors.photo}</p>}
          </FormField>

          {/* Company */}
          <FormField label="Company">
            <Input
              value={formData.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
            />
          </FormField>

          {/* Bio */}
          <FormField label="Bio">
            <textarea
              value={formData.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              className="w-full rounded-md border p-2"
              rows={3}
            />
          </FormField>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving…' : editing ? 'Update' : 'Add Speaker'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
