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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Role, User } from '@/lib/types/user';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { closeUserForm } from '@/redux/slices/user-slice';
import { createUser, updateUser } from '@/redux/slices/user-thunks';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

const DEFAULT_FORM: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'ADMIN',
};

export function UserFormDialog() {
  const dispatch = useAppDispatch();
  const { formOpen, editing, formLoading } = useAppSelector((s) => s.users);

  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);

  // Prefill when editing, reset when opening for create
  useEffect(() => {
    if (!formOpen) {
      setFormData(DEFAULT_FORM);
    } else if (editing) {
      const fullName = editing.name || '';
      const parts = fullName.trim().split(' ');
      const firstName = parts[0];
      const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
      setFormData({
        firstName: firstName || '',
        lastName: lastName || '',
        email: editing.email || '',
        role: editing.role || 'ADMIN',
      });
    }
  }, [formOpen, editing]);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function handleClose() {
    dispatch(closeUserForm());
    setFormData(DEFAULT_FORM);
  }

  function validate(): string | null {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.role) return 'Role is required';
    return null;
  }

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    try {
      if (editing?._id) {
        // Update existing user
        await dispatch(updateUser({ id: editing._id, payload: formData })).unwrap();
        toast.success('User updated successfully');
      } else {
        // Add new user
        await dispatch(createUser(formData)).unwrap();
        toast.success('User created successfully');
      }
      handleClose();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save user');
    }
  };

  return (
    <Dialog
      open={formOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-md space-y-4 p-6">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit User' : 'Add User'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4">
            <FormField label="First Name" className="flex-1">
              <Input
                value={formData.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder="First Name"
              />
            </FormField>

            <FormField label="Last Name" className="flex-1">
              <Input
                value={formData.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                placeholder="Last Name"
              />
            </FormField>
          </div>

          <FormField label="Email">
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Email"
            />
          </FormField>

          <FormField label="Role">
            <Select value={formData.role} onValueChange={(v) => updateField('role', v as Role)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={formLoading}>
            {formLoading ? 'Saving…' : editing ? 'Update User' : 'Add User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
