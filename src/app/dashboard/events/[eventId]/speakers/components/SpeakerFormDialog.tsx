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
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  closeForm,
  createSpeaker,
  fetchSpeakers,
  updateSpeaker,
} from '@/redux/slices/speaker-slice';
import { Upload } from 'lucide-react';
import { DragEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const DEFAULT_FORM: CreateSpeakerDto = {
  name: { firstName: '', lastName: '' },
  companyName: '',
  title: '',
  email: '',
  bio: '',
  linkedInUrl: '',
  pictureUrl: '',
};

export function SpeakerFormDialog() {
  const dispatch = useAppDispatch();
  const { formOpen, editItem, eventId, loading } = useAppSelector((s) => s.speakers);

  const [formData, setFormData] = useState<CreateSpeakerDto>(DEFAULT_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formOpen && editItem) {
      setFormData({
        name: editItem.name,
        companyName: editItem.companyName ?? '',
        title: editItem.title ?? '',
        email: editItem.email ?? '',
        bio: editItem.bio ?? '',
        linkedInUrl: editItem.linkedInUrl ?? '',
        pictureUrl: editItem.pictureUrl ?? '',
      });
      setPhotoPreview(editItem.pictureUrl ?? null);
      setPhotoFile(null);
    } else if (!formOpen) {
      setFormData(DEFAULT_FORM);
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  }, [formOpen, editItem]);

  const updateField = (key: string, value: string, nested = false) => {
    setFormData((prev) =>
      nested ? { ...prev, name: { ...prev.name, [key]: value } } : { ...prev, [key]: value },
    );
  };

  const validate = () => {
    if (!formData.name.firstName.trim()) return 'First name is required';
    if (!formData.name.lastName.trim()) return 'Last name is required';
    if (!formData.companyName.trim()) return 'Company is required';
    if (!formData.email.trim()) return 'Email is required';
    return null;
  };

  /* PHOTO UPLOAD */
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

  const handleClose = () => dispatch(closeForm());

  const handleSubmit = async () => {
    const err = validate();
    if (err) return toast.error(err);

    if (!eventId) return toast.error('Event ID not set');

    try {
      if (editItem) {
        await dispatch(
          updateSpeaker({
            id: editItem._id,
            payload: {
              ...formData,
              name: {
                firstName: formData.name.firstName.trim(),
                lastName: formData.name.lastName.trim(),
              },
            },
            photoFile,
          }),
        ).unwrap();
        toast.success('Speaker updated');
      } else {
        await dispatch(
          createSpeaker({
            payload: {
              ...formData,
              name: {
                firstName: formData.name.firstName.trim(),
                lastName: formData.name.lastName.trim(),
              },
            },
            photoFile,
          }),
        ).unwrap();
        toast.success('Speaker added');
      }

      // refresh current page
      dispatch(fetchSpeakers({ page: 1, limit: 10 }));
      handleClose();
    } catch {
      toast.error('Failed to save speaker');
    }
  };

  return (
    <Dialog open={formOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-h-[85vh] w-[90%] max-w-lg overflow-y-auto rounded-lg p-4">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Speaker' : 'Add Speaker'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="flex gap-4">
            <FormField label="First Name" className="flex-1">
              <Input
                value={formData.name.firstName}
                onChange={(e) => updateField('firstName', e.target.value, true)}
                placeholder="John"
              />
            </FormField>

            <FormField label="Last Name" className="flex-1">
              <Input
                value={formData.name.lastName}
                onChange={(e) => updateField('lastName', e.target.value, true)}
                placeholder="Doe"
              />
            </FormField>
          </div>

          {/* Company & Title */}
          <div className="flex gap-4">
            <FormField label="Company" className="flex-1">
              <Input
                value={formData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                placeholder="Google"
              />
            </FormField>

            <FormField label="Title in Company" className="flex-1">
              <Input
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Senior Engineer"
              />
            </FormField>
          </div>

          {/* Email & LinkedIn */}
          <FormField label="Email">
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="john@example.com"
            />
          </FormField>

          <FormField label="LinkedIn Link">
            <Input
              value={formData.linkedInUrl}
              onChange={(e) => updateField('linkedInUrl', e.target.value)}
              placeholder="https://linkedin.com/in/john"
            />
          </FormField>

          {/* PHOTO UPLOAD */}
          <FormField label="Upload Photo">
            <div
              onClick={handlePhotoClick}
              onDrop={handlePhotoDrop}
              onDragOver={(e) => e.preventDefault()}
              className="cursor-pointer rounded-md border-2 border-dashed p-6 text-center"
            >
              {!photoFile ? (
                <div className="flex flex-col items-center text-sm opacity-60">
                  <Upload className="mb-2 h-6 w-6" />
                  Drag or click to upload photo
                </div>
              ) : (
                <p>{photoFile.name}</p>
              )}
            </div>

            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="mt-2 h-20 w-20 rounded-md border object-cover"
              />
            )}

            <input
              type="file"
              ref={photoInputRef}
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
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
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving…' : editItem ? 'Update' : 'Add Speaker'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
