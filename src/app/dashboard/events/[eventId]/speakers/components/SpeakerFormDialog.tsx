'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import type { CreateSpeakerDto, Speaker } from '@/lib/types/speaker';
import { SpeakerService } from '@/services/speaker.service';

import { useEffect, useState, DragEvent } from 'react';
import { toast } from 'sonner';
import { FormField } from '@/components/form/FormField';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  editData?: Speaker | null;
  eventId: string;
}

const DEFAULT_FORM: CreateSpeakerDto = {
  name: { firstName: '', lastName: '' },
  companyName: '',
  title: '',
  email: '',
  bio: '',
  linkedInUrl: '',
  pictureUrl: '',
};

export function SpeakerFormDialog({ open, onOpenChange, onSuccess, editData, eventId }: Props) {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  /* --- Prefill on edit --- */
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        companyName: editData.companyName ?? '',
        title: editData.title ?? '',
        email: editData.email ?? '',
        bio: editData.bio ?? '',
        linkedInUrl: editData.linkedInUrl ?? '',
        pictureUrl: editData.pictureUrl ?? '',
      });
    } else {
      setFormData(DEFAULT_FORM);
      setPhotoFile(null);
    }
  }, [editData]);

  /* --- Helpers --- */
  const updateField = (key: string, value: string, nested = false) => {
    setFormData((prev) =>
      nested ? { ...prev, name: { ...prev.name, [key]: value } } : { ...prev, [key]: value }
    );
  };

  const validate = () => {
    if (!formData.name.firstName.trim()) return 'First name is required';
    if (!formData.name.lastName.trim()) return 'Last name is required';
    if (!formData.companyName.trim()) return 'Company is required';
    if (!formData.email.trim()) return 'Email is required';
    return null;
  };

  /* --- Drag & Drop --- */
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    setFormData((prev) => ({
      ...prev,
      pictureUrl: URL.createObjectURL(file),
    }));
  };

  /* --- Submit --- */
  const handleSubmit = async () => {
    const error = validate();
    if (error) return toast.error(error);

    setLoading(true);
    try {
      const payload = {
        ...formData,
        name: {
          firstName: formData.name.firstName.trim(),
          lastName: formData.name.lastName.trim(),
        },
      };

      if (editData) {
        await SpeakerService.update(eventId, editData._id, payload);
        toast.success('Speaker updated');
      } else {
        await SpeakerService.create(eventId, payload);
        toast.success('Speaker added');
      }

      onSuccess?.();
      onOpenChange(false);
      setFormData(DEFAULT_FORM);
      setPhotoFile(null);
    } catch {
      toast.error('Failed to save speaker');
    } finally {
      setLoading(false);
    }
  };

  /* --------------- UI --------------- */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-[90%] max-w-lg overflow-y-auto rounded-lg p-4">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Speaker' : 'Add Speaker'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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

          <FormField label="Upload Photo">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              className={`rounded-md border-2 border-dashed p-6 text-center transition ${
                dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              {!photoFile ? (
                <div className="text-muted-foreground flex flex-col items-center text-sm">
                  <Upload className="mb-2 h-6 w-6" />
                  Drag & Drop photo here
                </div>
              ) : (
                <p className="text-sm">{photoFile.name}</p>
              )}
            </div>

            {formData.pictureUrl && (
              <img
                src={formData.pictureUrl}
                alt="Preview"
                className="mt-2 h-20 w-20 rounded-md border object-cover"
              />
            )}
          </FormField>

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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving…' : editData ? 'Update' : 'Add Speaker'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
