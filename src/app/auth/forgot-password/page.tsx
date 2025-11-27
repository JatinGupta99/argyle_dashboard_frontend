'use client'

import { useAuth } from '@/context/AuthContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { emailSchema } from '@/lib/validation-schemas'

const formSchema = z.object({
  email: emailSchema,
})

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { forgotPassword } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const isSubmitting = form.formState.isSubmitting

const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    await forgotPassword({ email: values.email })
    toast.success(
      "If an account exists with this email, a reset link has been sent."
    )
    router.push('/auth/login');
  } catch (err: any) {
    // Check if the error is 404 User not found
    const backendMessage = err?.response?.data?.message || err?.message

    if (
      backendMessage === "User not found" ||
      err?.status === 404 // fallback for fetch API 404
    ) {
      // Treat as success for security reasons
      toast.success(
        "If an account exists with this email, a reset link has been sent."
      )
    } else {
      // Other errors
      toast.error("Failed to send reset link", {
        description: backendMessage || "Something went wrong",
      })
    }
  }
}


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-[380px] shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email to receive a password reset link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="johndoe@mail.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-sky-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
