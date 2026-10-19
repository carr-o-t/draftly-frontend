'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  useHandleRequest,
  useRevokeAccess,
} from '@/features/documents/mutations';
import { useAccessRequests } from '@/features/documents/queries';
import { AccessRequest } from '@/features/documents/types';
import { format } from 'date-fns';
import { Check, FileText, Loader2, RotateCcw, User, X } from 'lucide-react';
import { useMemo } from 'react';

export default function AccessRequestsPage() {
  const { data, isLoading } = useAccessRequests();

  const requests = useMemo(() => data?.data.received || [], [data]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-muted-foreground flex min-h-[50vh] flex-col items-center justify-center">
        <div className="bg-muted/20 mb-4 rounded-full p-4">
          <User className="h-10 w-10 opacity-50" />
        </div>
        <h3 className="text-foreground text-lg font-medium">
          No pending requests
        </h3>
        <p className="text-sm">You&apos;re all caught up!</p>
      </div>
    );
  }

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Access Requests
        </h1>
        <p className="text-muted-foreground text-sm">
          {pendingCount} pending requests
        </p>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <RequestItem key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: AccessRequest['status'] }) {
  if (status === 'approved') {
    return (
      <Badge
        variant="secondary"
        className="border-none bg-green-100 px-3 py-1 text-green-700 hover:bg-green-100"
      >
        Approved
      </Badge>
    );
  }
  if (status === 'rejected') {
    return (
      <Badge
        variant="secondary"
        className="border-none bg-red-100 px-3 py-1 text-red-700 hover:bg-red-100"
      >
        Rejected
      </Badge>
    );
  }
  return null; // pending has actions
}

function RequestItem({ request }: { request: AccessRequest }) {
  // We need document ID to handle request. Backend response now has it.
  const { mutate: handleRequest, isPending: isHandling } = useHandleRequest(
    request.document_id
  );
  const { mutate: revokeAccess } = useRevokeAccess(request.document_id);

  const onApprove = () => {
    handleRequest({
      requestId: request.id,
      data: {
        action: 'approved',
        role: request.role,
      },
    });
  };

  const onReject = () => {
    handleRequest({
      requestId: request.id,
      data: { action: 'rejected' },
    });
  };

  const onRevoke = () => {
    revokeAccess(request.requester_id);
  };

  const dateLabel = useMemo(() => {
    const requestDate = request.created_at?.split(' ')?.[0] || '';
    const date = new Date(requestDate);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return format(date, 'MMM d, yyyy');
  }, [request.created_at]);

  return (
    <div className="bg-card flex flex-col justify-between gap-4 rounded-xl border p-4 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-green-50 text-green-600">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h4 className="mb-1 text-base leading-none font-semibold">
            {request.doc_title || 'Unknown Document'}
          </h4>
          <p className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm">
            <User className="h-3 w-3" />
            Request from{' '}
            <span className="text-foreground font-medium">
              {request.requester_email || 'Unknown User'}
            </span>
            <span className="bg-muted-foreground/40 mx-1 h-1 w-1 rounded-full" />
            {dateLabel}
            {request.role && (
              <>
                <span className="bg-muted-foreground/40 mx-1 h-1 w-1 rounded-full" />
                <span className="bg-secondary rounded px-1.5 py-0.5 text-xs font-medium capitalize">
                  {request.role}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {request.status === 'pending' ? (
          <>
            <Button
              onClick={onApprove}
              disabled={isHandling}
              size="sm"
              className="h-9 gap-1.5 bg-green-500 text-white hover:bg-green-600"
            >
              {isHandling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Approve
            </Button>
            <Button
              onClick={onReject}
              disabled={isHandling}
              size="sm"
              variant="outline"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 h-9 gap-1.5"
            >
              <X className="h-4 w-4" />
              Reject
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <StatusBadge status={request.status} />
            {request.status === 'approved' && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/5 border-destructive/20 h-8 gap-1.5"
                onClick={onRevoke}
                // disabled
              >
                <RotateCcw className="h-3 w-3" />
                Revoke
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
