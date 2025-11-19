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
import { Label } from '@/components/ui/label';
import type { CreateSpeakerDto, Speaker } from '@/lib/types/speaker';
import { SpeakerService } from '@/services/speaker.service';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface SpeakerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  editData?: Speaker | null;
  eventId: string
}

const DEFAULT_FORM: CreateSpeakerDto = {
  name: { firstName: '', lastName: '' },
  title: '',
  email: '',
  companyName: '',
  bio: '',
  pictureUrl: '',
  linkedInUrl: '',
};

export function SpeakerFormDialog({
  open,
  onOpenChange,
  onSuccess,
  editData,
  eventId, // ← received eventId
}: SpeakerFormDialogProps) {
  const [formData, setFormData] = useState<CreateSpeakerDto>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);

  // Prefill form on edit
  useEffect(() => {
    if (editData) {
      setFormData({
        name: {
          firstName: editData.name.firstName.trim(),
          lastName: editData.name.lastName.trim(),
        },
        title: editData.title || '',
        email: editData.email || '',
        companyName: editData.companyName || '',
        bio: editData.bio || '',
        pictureUrl: editData.pictureUrl || '',
        linkedInUrl: editData.linkedInUrl || '',
      });
    } else {
      setFormData(DEFAULT_FORM);
    }
  }, [editData]);

  const handleChange = (field: string, value: string, nested = false) => {
    setFormData((prev) =>
      nested ? { ...prev, name: { ...prev.name, [field]: value } } : { ...prev, [field]: value }
    );
  };

  const validateForm = () => {
    if (!formData.name.firstName.trim()) return 'First name is required.';
    if (!formData.name.lastName.trim()) return 'Last name is required.';
    if (!formData.email.trim()) return 'Email is required.';
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);
    try {
      const trimmedData = {
        ...formData,
        name: {
          firstName: formData.name.firstName.trim(),
          lastName: formData.name.lastName.trim(),
        },
        title: formData.title.trim(),
        email: formData.email.trim(),
        companyName: formData.companyName.trim(),
        bio: formData?.bio?.trim(),
        pictureUrl: formData?.pictureUrl?.trim(),
        linkedInUrl: formData?.linkedInUrl?.trim(),
      };

      if (editData) {
        // UPDATE
        await SpeakerService.update(eventId,editData._id, trimmedData);
        toast.success('Speaker updated successfully');
      } else {
        // CREATE (requires eventId)
        await SpeakerService.create(eventId, trimmedData);
        toast.success('Speaker added successfully');
      }

      onSuccess?.();
      onOpenChange(false);
      setFormData(DEFAULT_FORM);
    } catch (error: any) {
      console.error('Failed to save speaker:', error);

      let message = 'Something went wrong.';
      try {
        const parsed = JSON.parse(error?.message?.replace(/^Fetch error \d+: /, '') ?? '');
        message = parsed?.message?.[0] || parsed?.message || message;
      } catch {
        message = error?.message || message;
      }

      toast.error('Failed to save speaker', { description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Speaker' : 'Add Speaker'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          <div className="flex gap-3">
            <div className="flex-1">
              <Label>First Name</Label>
              <Input
                value={formData.name.firstName}
                onChange={(e) => handleChange('firstName', e.target.value, true)}
                placeholder="John"
              />
            </div>
            <div className="flex-1">
              <Label>Last Name</Label>
              <Input
                value={formData.name.lastName}
                onChange={(e) => handleChange('lastName', e.target.value, true)}
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Software Engineer"
            />
          </div>

          <div>
            <Label>Company Name</Label>
            <Input
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="TechCorp"
            />
          </div>

          <div>
            <Label>LinkedIn URL</Label>
            <Input
              value={formData.linkedInUrl}
              onChange={(e) => handleChange('linkedInUrl', e.target.value)}
              placeholder="https://linkedin.com/in/john-doe"
            />
          </div>

          <div>
            <Label>Picture URL</Label>
            <Input
              value={formData.pictureUrl}
              onChange={(e) => handleChange('pictureUrl', e.target.value)}
              placeholder="https://example.com/john.jpg"
            />
          </div>

          <div>
            <Label>Bio</Label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              rows={3}
              placeholder="Short description..."
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : editData ? 'Update' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
