'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { setupPasswordSchema, SetupPasswordFormValues } from '@/lib/validation-schemas';

export default function SetupPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { setupPassword } = useAuth();

  const form = useForm<SetupPasswordFormValues>({
    resolver: zodResolver(setupPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: SetupPasswordFormValues) => {
    if (!token) {
      toast.error('Invalid or missing token');
      return;
    }

    try {
      await setupPassword({ token, newPassword: values.newPassword });
      toast.success('Password updated successfully!');
      router.push('/auth/login');
    } catch (err: any) {
      console.error('[SetupPassword] Error:', err);
      const message = err?.message || 'Failed to update password';
      toast.error(message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-80 space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h1 className="text-center text-xl font-semibold text-gray-800">Setup Your Password</h1>

          {['newPassword', 'confirmPassword'].map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as keyof SetupPasswordFormValues}
              render={({ field: f }) => (
                <FormItem className="grid gap-1">
                  <FormLabel>
                    {field === 'newPassword' ? 'New Password' : 'Confirm Password'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        field === 'newPassword' ? 'Enter new password' : 'Confirm new password'
                      }
                      {...f}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="w-full bg-sky-400" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Set Password'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
