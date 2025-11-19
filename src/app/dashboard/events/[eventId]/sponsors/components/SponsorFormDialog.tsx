'use client';

import { useEffect, useState, DragEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

import type { CreateSponsorDto, Sponsor } from '@/lib/types/sponsor';
import { FormField } from '@/components/form/FormField';
import { SponsorService } from '@/services/sponsors.service';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  editData?: Sponsor | null;
  eventId: string;
}

const DEFAULT_FORM: CreateSponsorDto = {
  name: '',
  logoKey: '',
  websiteUrl: '',
  facebookUrl: '',
  twitterUrl: '',
  instagramUrl: '',
  linkedInUrl: '',
  description: '',
};

export function SponsorFormDialog({ open, onOpenChange, onSuccess, editData, eventId }: Props) {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const [draggingLogo, setDraggingLogo] = useState(false);
  const [draggingDoc, setDraggingDoc] = useState(false);

  /* --- Prefill values when editing --- */
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        logoKey: editData.logoKey,
        websiteUrl: editData.websiteUrl ?? '',
        facebookUrl: editData.facebookUrl ?? '',
        twitterUrl: editData.twitterUrl ?? '',
        instagramUrl: editData.instagramUrl ?? '',
        linkedInUrl: editData.linkedInUrl ?? '',
        description: editData.description ?? '',
      });
      setLogoPreview(editData.logoKey);
    } else {
      setFormData(DEFAULT_FORM);
      setLogoFile(null);
      setLogoPreview(null);
      setDocumentFile(null);
    }
  }, [editData]);

  /* --- Helpers --- */
  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!formData.name.trim()) return 'Sponsor name is required';
    return null;
  };

  /* --- Logo Drag & Drop --- */
  const handleLogoDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingLogo(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  /* --- Document Drag & Drop --- */
  const handleDocDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingDoc(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setDocumentFile(file);
  };

  /* --- Upload Helpers (future S3) --- */
  const uploadLogo = async () => {
    if (!logoFile) return formData.logoKey;

    const presign = await SponsorService.getUploadUrl({
      eventId,
      sponsorId: editData?._id ?? 'new',
      contentType: logoFile.type,
    });

    await fetch(presign.data.url, {
      method: 'PUT',
      body: logoFile,
    });

    return presign.data.key;
  };

  /* --- Submit Handler --- */
  const handleSubmit = async () => {
    const error = validate();
    if (error) return toast.error(error);

    setLoading(true);

    try {
      const uploadedLogoKey = await uploadLogo();
      const payload = { ...formData, logoKey: uploadedLogoKey };

      if (editData) {
        await SponsorService.update(eventId, editData._id, payload);
        toast.success('Sponsor updated');
      } else {
        await SponsorService.create(eventId, payload);
        toast.success('Sponsor added');
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      toast.error('Failed to save sponsor');
    } finally {
      setLoading(false);
    }
  };

  /* ------------ UI -------------- */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-[90%] max-w-lg overflow-y-auto rounded-lg p-4">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Sponsor' : 'Add Sponsor'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Document Upload */}
          <FormField label="Upload Document (PDF, DOC, PNG, JPEG)">
            <div
              onDrop={handleDocDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDraggingDoc(true);
              }}
              onDragLeave={() => setDraggingDoc(false)}
              className={`rounded-md border-2 border-dashed p-6 text-center transition ${
                draggingDoc ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              {!documentFile ? (
                <div className="text-muted-foreground flex flex-col items-center text-sm">
                  <Upload className="mb-2 h-6 w-6" />
                  Click to upload or drag document here
                </div>
              ) : (
                <p className="text-sm">{documentFile.name}</p>
              )}
            </div>
          </FormField>
          <FormField label="Name">
            <Input
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Company Name"
            />
          </FormField>

          <FormField label="Website">
            <Input
              value={formData.websiteUrl ?? ''}
              onChange={(e) => updateField('websiteUrl', e.target.value)}
              placeholder="URL"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Facebook">
              <Input
                value={formData.facebookUrl ?? ''}
                onChange={(e) => updateField('facebookUrl', e.target.value)}
                placeholder="URL"
              />
            </FormField>

            <FormField label="Twitter">
              <Input
                value={formData.twitterUrl ?? ''}
                onChange={(e) => updateField('twitterUrl', e.target.value)}
                placeholder="URL"
              />
            </FormField>

            <FormField label="Instagram">
              <Input
                value={formData.instagramUrl ?? ''}
                onChange={(e) => updateField('instagramUrl', e.target.value)}
                placeholder="URL"
              />
            </FormField>

            <FormField label="LinkedIn">
              <Input
                value={formData.linkedInUrl ?? ''}
                onChange={(e) => updateField('linkedInUrl', e.target.value)}
                placeholder="URL"
              />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea
              value={formData.description ?? ''}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full rounded-md border p-2"
              rows={3}
              placeholder="Type your description..."
            />
          </FormField>

          {/* Logo Upload */}
          <FormField label="Logo">
            <div
              onDrop={handleLogoDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDraggingLogo(true);
              }}
              onDragLeave={() => setDraggingLogo(false)}
              className={`rounded-md border-2 border-dashed p-6 text-center transition ${
                draggingLogo ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              {!logoFile ? (
                <div className="text-muted-foreground flex flex-col items-center text-sm">
                  <Upload className="mb-2 h-6 w-6" />
                  Click to upload logo or drag here
                </div>
              ) : (
                <p className="text-sm">{logoFile.name}</p>
              )}
            </div>

            {logoPreview && (
              <img
                src={logoPreview}
                className="mt-2 h-20 w-20 rounded-md border object-cover"
                alt="Logo preview"
              />
            )}
          </FormField>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving…' : editData ? 'Update' : 'Add Sponsor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
