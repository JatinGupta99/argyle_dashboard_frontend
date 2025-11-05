'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SpeakerService } from '@/services/speaker.service';
import type { CreateSpeakerDto, Speaker } from '@/lib/types/speaker';
import { setExportClick, setExportLabel } from '@/redux/slices/toolbar-slice';

interface SpeakerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  editData?: Speaker | null; // Optional — used for editing
}

export function SpeakerFormDialog({
  open,
  onOpenChange,
  onSuccess,
  editData,
}: SpeakerFormDialogProps) {
  const [formData, setFormData] = useState<CreateSpeakerDto>({
    name: { firstName: '', lastName: '' },
    title: '',
    email: '',
    companyName: '',
    bio: '',
    pictureUrl: '',
    linkedInUrl: '',
  });

  const [loading, setLoading] = useState(false);

  // Prefill form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        name: {
          firstName: editData.name.firstName,
          lastName: editData.name.lastName,
        },
        title: editData.title,
        email: editData.email,
        companyName: editData.companyName,
        bio: editData.bio || '',
        pictureUrl: editData.pictureUrl || '',
        linkedInUrl: editData.linkedInUrl || '',
      });
    } else {
      setFormData({
        name: { firstName: '', lastName: '' },
        title: '',
        email: '',
        companyName: '',
        bio: '',
        pictureUrl: '',
        linkedInUrl: '',
      });
    }
  }, [editData]);

  const handleChange = (field: string, value: string, nested = false) => {
    if (nested) {
      setFormData((prev) => ({
        ...prev,
        name: { ...prev.name, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editData) {
        await SpeakerService.update(editData._id, formData);
      } else {
        await SpeakerService.create(formData);
      }
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to save speaker:', error);
      alert(error.message || 'Something went wrong.');
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
