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
import { DragEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { closeForm, createSponsor, updateSponsor } from '@/redux/slices/sponsor-slice';

import { FormField } from '@/components/form/FormField';
import { CreateSponsorDto } from '@/lib/types/sponsor';

/* Default form with null values (backend friendly) */
const DEFAULT_FORM: CreateSponsorDto = {
  name: '',
  logoKey: '',
  websiteUrl: null,
  facebookUrl: null,
  twitterUrl: null,
  instagramUrl: null,
  linkedInUrl: null,
  description: '',
};

export function SponsorFormDialog() {
  const dispatch = useAppDispatch();
  const { formOpen, editing, eventId } = useAppSelector((s) => s.sponsors);

  const [formData, setFormData] = useState<CreateSponsorDto>(DEFAULT_FORM);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  /* Load editing data with null-safe URL fields */
  useEffect(() => {
    if (editing) {
      setFormData({
        ...editing,
        websiteUrl: editing.websiteUrl ?? null,
        facebookUrl: editing.facebookUrl ?? null,
        twitterUrl: editing.twitterUrl ?? null,
        instagramUrl: editing.instagramUrl ?? null,
        linkedInUrl: editing.linkedInUrl ?? null,
      });
      setLogoPreview(editing.logoKey || null);
    } else {
      setFormData(DEFAULT_FORM);
      setLogoFile(null);
      setDocumentFile(null);
      setLogoPreview(null);
    }
  }, [editing]);

  /* Convert "" to null before saving */
  const normalizeUrl = (v: string) => (v.trim() === '' ? null : v.trim());

  const updateField = (key: keyof CreateSponsorDto, value: string) => {
    if (
      key === 'websiteUrl' ||
      key === 'facebookUrl' ||
      key === 'twitterUrl' ||
      key === 'instagramUrl' ||
      key === 'linkedInUrl'
    ) {
      return setFormData((p) => ({ ...p, [key]: normalizeUrl(value) }));
    }

    setFormData((p) => ({ ...p, [key]: value }));
  };

  const validate = () => {
    if (!formData.name.trim()) return 'Sponsor name is required';
    return null;
  };

  /* DOCUMENT UPLOAD */
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

  /* LOGO UPLOAD */
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

  /* Remove empty/null URL fields before sending to backend */
const cleanPayload = (data: CreateSponsorDto) => {
  const copy: any = { ...data };

  const optionalUrls = [
    "websiteUrl",
    "facebookUrl",
    "twitterUrl",
    "instagramUrl",
    "linkedInUrl",
  ];

  optionalUrls.forEach((key) => {
    if (!copy[key] || copy[key]?.trim() === "") {
      delete copy[key]; // ⬅ remove from payload
    }
  });

  return copy;
};

  /* SUBMIT */
  const handleSubmit = async () => {
    const error = validate();
    if (error) return toast.error(error);

    if (!eventId) return toast.error('Event ID not set');

    try {
      setLoading(true);
 const cleanedData = cleanPayload(formData);
      if (editing) {
        await dispatch(
          updateSponsor({
            eventId,
            sponsorId: editing._id,
            data: cleanedData,
            logoFile,        // optional
            documentFile,    // optional
          })
        ).unwrap();
        toast.success('Sponsor updated');
      } else {
        await dispatch(
          createSponsor({
            eventId,
            data: cleanedData,
            logoFile,        // optional
            documentFile,    // optional
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
        </DialogHeader>

        <div className="space-y-4">

          {/* DOCUMENT UPLOAD (optional) */}
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
              ) : (
                <p>{documentFile.name}</p>
              )}
            </div>

            <input
              type="file"
              ref={documentInputRef}
              className="hidden"
              onChange={handleDocumentChange}
            />
          </FormField>

          {/* TEXT FIELDS */}
          <FormField label="Name">
            <Input
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
          </FormField>

          <FormField label="Website (optional)">
            <Input
              value={formData.websiteUrl || ''}
              onChange={(e) => updateField('websiteUrl', e.target.value)}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Facebook (optional)">
              <Input
                value={formData.facebookUrl || ''}
                onChange={(e) => updateField('facebookUrl', e.target.value)}
              />
            </FormField>

            <FormField label="Twitter (optional)">
              <Input
                value={formData.twitterUrl || ''}
                onChange={(e) => updateField('twitterUrl', e.target.value)}
              />
            </FormField>

            <FormField label="Instagram (optional)">
              <Input
                value={formData.instagramUrl || ''}
                onChange={(e) => updateField('instagramUrl', e.target.value)}
              />
            </FormField>

            <FormField label="LinkedIn (optional)">
              <Input
                value={formData.linkedInUrl || ''}
                onChange={(e) => updateField('linkedInUrl', e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              className="w-full rounded-md border p-2"
            />
          </FormField>

          {/* LOGO UPLOAD (optional) */}
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
              ) : (
                <p>{logoFile.name}</p>
              )}
            </div>

            {logoPreview && (
              <img
                src={logoPreview}
                className="mt-2 h-20 w-20 rounded-md border object-cover"
              />
            )}

            <input
              type="file"
              ref={logoInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
          </FormField>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => dispatch(closeForm())}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving…' : editing ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
