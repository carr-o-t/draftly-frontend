'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Lock, Mail } from 'lucide-react';
import { useLoginOrRegister } from '../queries';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    ),
});

type SignUpValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onToggleMode: () => void;
}

export const SignUpForm = ({ onToggleMode }: SignUpFormProps) => {
  const router = useRouter();
  const { mutate: loginOrRegister, isPending: isLoading } =
    useLoginOrRegister();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: SignUpValues) => {
    loginOrRegister(data, {
      onSuccess: () => {
        // Handle success
        console.log('Account created successfully');
        router.push('/documents');
      },
      onError: (error) => {
        console.error('Registration failed:', error);
        form.setError('root', { message: error.message });
      },
    });
  };

  return (
    <div className="animate-fade-in w-full max-w-md space-y-8">
      <div className="space-y-2">
        <h2 className="text-foreground text-3xl font-bold tracking-tight">
          Create an account
        </h2>
        <p className="text-muted-foreground">
          Get started with your free account today
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
              <input
                {...form.register('email')}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="you@example.com"
                type="email"
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-destructive text-sm">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
              <input
                {...form.register('password')}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="••••••••"
                type="password"
              />
            </div>
            {form.formState.errors.password && (
              <p className="text-destructive text-sm">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
        </div>

        {form.formState.errors.root && (
          <p className="text-destructive text-center text-sm">
            {form.formState.errors.root.message}
          </p>
        )}

        <button
          className="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Create Account →
        </button>
      </form>

      <div className="text-muted-foreground text-center text-sm">
        Already have an account?{' '}
        <button
          className="text-primary font-medium hover:underline"
          onClick={onToggleMode}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};
