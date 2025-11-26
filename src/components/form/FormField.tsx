'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormFieldProps {
  label: string;
  children?: React.ReactNode;
  className?: string;
}

export function FormField({ label, children, className }: FormFieldProps) {
  return (
    <div className={`flex flex-col space-y-1 ${className ?? ''}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
