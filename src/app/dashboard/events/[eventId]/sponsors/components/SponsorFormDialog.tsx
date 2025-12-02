'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { DragEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { FormField } from '@/components/form/FormField';
import { CreateSponsorDto } from '@/lib/types/sponsor';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { closeForm, createSponsor, updateSponsor } from '@/redux/slices/sponsor-slice';

const DEFAULT_FORM: CreateSponsorDto = {
  name: '',
  logoKey: '',
  websiteUrl: '',
  facebookUrl: null,
  twitterUrl: null,
  instagramUrl: null,
  linkedInUrl: null,
  description: '',
  youtubeUrl: '',
  email: '',
};

export function SponsorFormDialog() {
  const dispatch = useAppDispatch();
  const { formOpen, editing, eventId } = useAppSelector((s) => s.sponsors);

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const logoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // ---------------- Prefill / Reset Form ----------------
  useEffect(() => {
    if (editing) {
      setFormData({
        ...editing,
        description:editing.description,
        websiteUrl: editing.websiteUrl,
        facebookUrl: editing.facebookUrl ?? null,
        twitterUrl: editing.twitterUrl ?? null,
        instagramUrl: editing.instagramUrl ?? null,
        linkedInUrl: editing.linkedInUrl ?? null,
        youtubeUrl: editing.youtubeUrl ?? '',
        email: editing.email ?? '',
      });
      setLogoPreview(editing.logoKey || null);
    } else {
      setFormData(DEFAULT_FORM);
      setLogoFile(null);
      setDocumentFile(null);
      setLogoPreview(null);
    }
    setErrors({});
  }, [editing]);

  // ---------------- Helpers ----------------
  const normalizeUrl = (v: string) => (v.trim() === '' ? null : v.trim());

  const updateField = (
    key: keyof CreateSponsorDto | 'youtubeUrl' | 'email',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]:
        ['websiteUrl', 'facebookUrl', 'twitterUrl', 'instagramUrl', 'linkedInUrl', 'youtubeUrl'].includes(key)
          ? normalizeUrl(value)
          : value,
    }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  // ---------------- Validation ----------------
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'Sponsor name is required';

    if (!formData.websiteUrl.trim()) newErrors.name = 'Website Url is required';

     if (!formData.youtubeUrl.trim()) newErrors.name = 'Website Url is required';

    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';

    const urlFields: (keyof CreateSponsorDto | 'youtubeUrl')[] = [
      'websiteUrl',
      'facebookUrl',
      'twitterUrl',
      'instagramUrl',
      'linkedInUrl',
    ];

    urlFields.forEach((field) => {
      if (formData[field] && !/^https?:\/\/.+$/.test(formData[field]!)) {
        newErrors[field] = 'Invalid URL';
      }
    });

    if (formData.youtubeUrl && !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(formData.youtubeUrl)) {
      newErrors.youtubeUrl = 'Invalid YouTube URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- File Handlers ----------------
  const handleLogoClick = () => logoInputRef.current?.click();
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };
  const handleLogoDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleDocumentClick = () => documentInputRef.current?.click();
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setDocumentFile(file);
  };
  const handleDocumentDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setDocumentFile(file);
  };

  // ---------------- Clean Payload ----------------
  const cleanPayload = (data: CreateSponsorDto & { youtubeUrl?: string }) => {
    const copy: any = { ...data };
    ['websiteUrl', 'facebookUrl', 'twitterUrl', 'instagramUrl', 'linkedInUrl', 'youtubeUrl'].forEach(
      (key) => {
        if (!copy[key] || copy[key]?.trim() === '') delete copy[key];
      }
    );
    ['_id', 'eventId', 'createdBy', 'createdAt', 'updatedAt'].forEach((key) => delete copy[key]);
    return copy;
  };

  // ---------------- Submit ----------------
  const handleSubmit = async () => {
    if (!validate()) return;
    if (!eventId) return toast.error('Event ID not set');

    try {
      setLoading(true);
      const cleanedData = cleanPayload(formData);

      if (editing) {
        await dispatch(
          updateSponsor({
            sponsorId: editing._id,
            data: cleanedData,
            logoFile,
            documentFile,
          })
        ).unwrap();
        toast.success('Sponsor updated');
      } else {
        await dispatch(
          createSponsor({
            data: cleanedData,
            logoFile,
            documentFile,
          })
        ).unwrap();
        toast.success('Sponsor created');
      }

      dispatch(closeForm());
    } catch {
      toast.error('Failed to save sponsor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={formOpen} onOpenChange={() => dispatch(closeForm())}>
      <DialogContent className="max-h-[85vh] w-[90%] max-w-lg overflow-y-auto rounded-lg p-4">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit Sponsor' : 'Add Sponsor'}</DialogTitle>
          <DialogDescription>
            Fill out the form to {editing ? 'update' : 'create'} a sponsor, including email and YouTube URL if available.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Document */}
          <FormField label="Upload Document (optional)">
            <div
              onClick={handleDocumentClick}
              onDrop={handleDocumentDrop}
              onDragOver={(e) => e.preventDefault()}
              className="cursor-pointer rounded-md border-2 border-dashed p-6 text-center"
            >
              {!documentFile ? (
                <div className="flex flex-col items-center text-sm opacity-60">
                  <Upload className="mb-2 h-6 w-6" />
                  Drag or click to upload document
                </div>
              ) : <p>{documentFile.name}</p>}
            </div>
            <input type="file" ref={documentInputRef} className="hidden" onChange={handleDocumentChange} />
          </FormField>

          {/* Name */}
          <FormField label="Name">
            <Input value={formData.name} onChange={(e) => updateField('name', e.target.value)} />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </FormField>

          {/* Email */}
          <FormField label="Email">
            <Input
              value={formData.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </FormField>

          {/* YouTube */}
          <FormField label="YouTube">
            <Input
              value={formData.youtubeUrl || ''}
              onChange={(e) => updateField('youtubeUrl', e.target.value)}
              placeholder="https://youtu.be/your-video-id"
            />
            {errors.youtubeUrl && <p className="mt-1 text-xs text-red-500">{errors.youtubeUrl}</p>}
          </FormField>

          {/* Website */}
          <FormField label="Website">
            <Input
              value={formData.websiteUrl || ''}
              onChange={(e) => updateField('websiteUrl', e.target.value)}
            />
            {errors.websiteUrl && <p className="mt-1 text-xs text-red-500">{errors.websiteUrl}</p>}
          </FormField>

          {/* Socials */}
          <div className="grid grid-cols-2 gap-4">
            {(['facebookUrl', 'twitterUrl', 'instagramUrl', 'linkedInUrl'] as const).map((field) => (
              <FormField key={field} label={field.replace('Url', '')}>
                <Input
                  value={formData[field] || ''}
                  onChange={(e) => updateField(field, e.target.value)}
                />
                {errors[field] && <p className="mt-1 text-xs text-red-500">{errors[field]}</p>}
              </FormField>
            ))}
          </div>

          {/* Description */}
          <FormField label="Description">
            <textarea
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              className="w-full rounded-md border p-2"
            />
          </FormField>

          {/* Logo */}
          <FormField label="Logo (optional)">
            <div
              onClick={handleLogoClick}
              onDrop={handleLogoDrop}
              onDragOver={(e) => e.preventDefault()}
              className="cursor-pointer rounded-md border-2 border-dashed p-6 text-center"
            >
              {!logoFile ? (
                <div className="flex flex-col items-center text-sm opacity-60">
                  <Upload className="mb-2 h-6 w-6" />
                  Drag or click to upload logo
                </div>
              ) : <p>{logoFile.name}</p>}
            </div>
            {logoPreview && (
              <img src={logoPreview} className="mt-2 h-20 w-20 rounded-md border object-cover" />
            )}
            <input type="file" ref={logoInputRef} accept="image/*" className="hidden" onChange={handleLogoChange} />
          </FormField>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => dispatch(closeForm())}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving…' : editing ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
