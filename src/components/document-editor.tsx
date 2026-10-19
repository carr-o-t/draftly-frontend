'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Share2,
  FileText,
  Loader2,
  Eye,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { RenameDocumentModal } from '@/features/documents/components/rename-document-modal';
import { ShareDocumentModal } from '@/features/documents/components/share-document-modal';
import { ApiError, useDocument } from '@/features/documents/queries';
import { useRequestAccess } from '@/features/documents/mutations';
import { RequestAccessCard } from '@/features/documents/components/request-access-card';
import { useCollaboration } from '@/features/collaboration/use-collaboration';
import { TiptapEditor } from './tiptap-editor';

const DocumentEditor = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useDocument(id);
  const { provider, ydoc, userColor, connected } = useCollaboration(id);

  const title = useMemo(
    () => (!error && data?.data.title) || 'Untitled Document',
    [data, error]
  );

  // viewers can only read; owner/editor can edit
  const readOnly = data?.data.role === 'viewer';

  const {
    mutate: requestEditAccess,
    isPending: isRequesting,
    isSuccess: requestSent,
  } = useRequestAccess(id);

  const [renameOpen, setRenameOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.replace('/documents');
    }
  };

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (error instanceof ApiError && error.status === 403) {
    return <RequestAccessCard documentId={id} />;
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="border-border bg-background/80 sticky top-0 z-20 border-b backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="iconSm"
              onClick={handleBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <FileText className="text-primary h-5 w-5 shrink-0" />
              <button
                onClick={() => !readOnly && setRenameOpen(true)}
                disabled={readOnly}
                className="text-foreground hover:text-primary disabled:hover:text-foreground max-w-[200px] truncate text-left text-base font-medium transition-colors disabled:cursor-default sm:max-w-[400px] sm:text-lg"
              >
                {title}
              </button>
              {readOnly && (
                <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium">
                  <Eye className="h-3 w-3" />
                  Read only
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {readOnly ? (
              requestSent ? (
                <span className="text-success inline-flex items-center gap-1.5 text-xs font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Request sent
                </span>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => requestEditAccess({ role: 'editor' })}
                  disabled={isRequesting}
                  className="gap-2"
                >
                  {isRequesting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  Request Edit Access
                </Button>
              )
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShareOpen(true)}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* editor, yjs is the source of truth and updates go over the websocket */}
      {provider && ydoc && connected ? (
        <TiptapEditor
          documentId={id}
          provider={provider}
          ydoc={ydoc}
          userColor={userColor}
          readOnly={readOnly}
          initialContent={data?.data.content}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="text-muted-foreground animate-spin" />
          <span className="text-muted-foreground ml-2">Connecting...</span>
        </div>
      )}

      {renameOpen && (
        <RenameDocumentModal
          documentId={id || ''}
          currentTitle={title}
          isOpen={renameOpen}
          onClose={() => setRenameOpen(false)}
        />
      )}

      {shareOpen && (
        <ShareDocumentModal
          documentId={id || ''}
          documentTitle={title}
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
};

export { DocumentEditor };
