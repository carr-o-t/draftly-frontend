'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Lock,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  EyeIcon,
  Edit,
} from 'lucide-react';
import Link from 'next/link';
import { useRequestAccess } from '../mutations';
import { cn } from '@/lib/utils';

interface RequestAccessCardProps {
  documentId: string;
  documentTitle?: string;
}

export function RequestAccessCard({ documentId }: RequestAccessCardProps) {
  const [selectedRole, setSelectedRole] = useState<'viewer' | 'editor' | null>(
    null
  );
  const {
    mutate: requestAccess,
    isPending,
    isSuccess,
  } = useRequestAccess(documentId);

  const handleSubmit = () => {
    if (!selectedRole) return;
    requestAccess({ role: selectedRole });
  };

  if (isSuccess) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-4">
        <div className="bg-card w-full max-w-md rounded-xl border p-8 text-center shadow-sm">
          <div className="mb-6 flex justify-center">
            <div className="bg-success/10 text-success flex h-16 w-16 items-center justify-center rounded-full">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          </div>

          <h2 className="mb-2 text-xl font-semibold">Request Sent</h2>
          <p className="text-muted-foreground mb-8 text-sm">
            The document owner has been notified. You&apos;ll receive access
            once they approve your request.
          </p>

          <Button asChild variant="outline" className="w-full">
            <Link href="/documents">Back to Documents</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-xl border p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex justify-center">
          <div className="bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center rounded-full">
            <Lock className="h-6 w-6" />
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold">Request Access</h1>
          <p className="text-muted-foreground text-sm">
            You don&apos;t have permission to view this document
          </p>
        </div>

        <div className="mb-6 space-y-3">
          <label className="text-foreground text-sm font-medium">
            Request access as
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedRole('viewer')}
              className={cn(
                'hover:bg-muted/50 flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all focus:outline-none',
                selectedRole === 'viewer'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-muted bg-card text-muted-foreground hover:border-primary/50'
              )}
            >
              <div
                className={cn(
                  'mb-2 flex h-8 w-8 items-center justify-center rounded-full',
                  selectedRole === 'viewer' ? 'bg-primary/20' : 'bg-muted'
                )}
              >
                <EyeIcon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Viewer</span>
              <span className="text-[10px] opacity-70">Read only</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('editor')}
              className={cn(
                'hover:bg-muted/50 flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all focus:outline-none',
                selectedRole === 'editor'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-muted bg-card text-muted-foreground hover:border-primary/50'
              )}
            >
              <div
                className={cn(
                  'mb-2 flex h-8 w-8 items-center justify-center rounded-full',
                  selectedRole === 'editor' ? 'bg-primary/20' : 'bg-muted'
                )}
              >
                <Edit className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Editor</span>
              <span className="text-[10px] opacity-70">Can edit</span>
            </button>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selectedRole || isPending}
          className="mb-4 w-full"
          size="lg"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Request Access
        </Button>

        <div className="text-center">
          <Link
            href="/documents"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Documents
          </Link>
        </div>
      </div>
    </div>
  );
}
