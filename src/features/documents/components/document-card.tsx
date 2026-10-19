'use client';

import {
  MoreHorizontal,
  FileText,
  Trash2,
  Edit2,
  Share2,
  FolderOpen,
  Loader2,
} from 'lucide-react';
import { Document } from '../types';
import { useState, useRef, useEffect, type ReactNode } from 'react';
import { useDeleteDocument } from '../mutations';
import { RenameDocumentModal } from './rename-document-modal';
import { ShareDocumentModal } from './share-document-modal';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { DocumentThumbnail } from './document-thumbnail';
import { cn } from '@/lib/utils';

interface DocumentCardProps {
  docData: Document;
}

type MenuAction = {
  label: string;
  icon: ReactNode;
  onSelect: () => void;
  destructive?: boolean;
  keepOpen?: boolean;
};

export function DocumentCard({ docData }: DocumentCardProps) {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const { mutate: deleteDocument, isPending: isDeleting } = useDeleteDocument();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const insideMenu = menuRef.current?.contains(target);
      const insideSheet = sheetRef.current?.contains(target);
      if (!insideMenu && !insideSheet) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const handleDelete = () => {
    deleteDocument(docData.id, {
      onSuccess: () => setIsMenuOpen(false),
    });
  };

  const handleOpenDocument = () => {
    router.push(`/documents/${docData.id}`);
  };

  const runAction = (action: MenuAction) => {
    action.onSelect();
    if (!action.keepOpen) {
      setIsMenuOpen(false);
    }
  };

  const actions: MenuAction[] = [
    {
      label: 'Open',
      icon: <FolderOpen className="h-4 w-4" />,
      onSelect: handleOpenDocument,
    },
  ];

  if (docData.role === 'owner') {
    actions.push(
      {
        label: 'Rename',
        icon: <Edit2 className="h-4 w-4" />,
        onSelect: () => setIsRenameOpen(true),
      },
      {
        label: 'Share',
        icon: <Share2 className="h-4 w-4" />,
        onSelect: () => setIsShareOpen(true),
      },
      {
        label: 'Delete',
        icon: isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        ),
        onSelect: handleDelete,
        destructive: true,
        keepOpen: true,
      }
    );
  }

  return (
    <>
      <div
        aria-label={docData.title}
        tabIndex={0}
        onClick={handleOpenDocument}
        className={cn(
          'group bg-card hover:border-primary/50 relative flex w-full cursor-pointer items-center rounded-xl border p-0 shadow-sm transition-all hover:shadow-md sm:max-w-[240px] sm:flex-col sm:items-stretch sm:justify-between',
          isMenuOpen && 'z-20'
        )}
      >
        <div className="bg-muted/10 relative hidden aspect-3/4 h-64 overflow-hidden rounded-t-xl border-b sm:block">
          <DocumentThumbnail
            content={docData.content}
            className="h-full w-full"
          />

          {docData.role !== 'owner' && (
            <Badge
              variant="default"
              className="absolute top-2 right-2 z-10 opacity-90 shadow-sm"
            >
              Shared
            </Badge>
          )}
        </div>

        <div className="flex w-full items-center justify-between gap-3 p-3 sm:w-auto">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="text-success flex h-8 w-8 shrink-0 items-center justify-center rounded">
              <FileText className="h-5 w-5" />
            </div>

            <div className="flex flex-col overflow-hidden">
              <h3
                className="text-foreground truncate text-sm font-medium"
                title={docData.title}
              >
                {docData.title}
              </h3>
              <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
                <span>Opened {formatDate(docData.updated_at)}</span>
                {docData.role !== 'owner' && (
                  <Badge
                    variant="default"
                    className="px-1.5 py-0 text-[10px] sm:hidden"
                  >
                    Shared
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="text-muted-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-full transition-colors sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {isMenuOpen && (
              <div
                className="bg-popover animate-in fade-in zoom-in-95 absolute right-0 bottom-full z-20 mb-1 hidden w-48 rounded-md border p-1 shadow-md duration-100 sm:block"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col">
                  {actions.map((action) => (
                    <div key={action.label}>
                      {action.destructive && (
                        <div className="bg-muted my-1 h-px" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          runAction(action);
                        }}
                        disabled={isDeleting}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none disabled:opacity-50',
                          action.destructive
                            ? 'text-destructive hover:bg-destructive/10 hover:text-destructive'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        {action.icon}
                        <span>{action.label}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 sm:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div
            ref={sheetRef}
            className="bg-background animate-in slide-in-from-bottom-4 absolute inset-x-0 bottom-0 rounded-t-2xl border-t p-2 pb-8 shadow-lg duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-muted mx-auto mb-3 h-1.5 w-10 rounded-full" />

            <p className="truncate px-3 pb-2 text-sm font-semibold">
              {docData.title}
            </p>

            {actions.map((action) => (
              <button
                key={action.label}
                onClick={() => runAction(action)}
                disabled={isDeleting}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-medium outline-none disabled:opacity-50',
                  action.destructive
                    ? 'text-destructive hover:bg-destructive/10'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isRenameOpen && (
        <RenameDocumentModal
          isOpen={isRenameOpen}
          onClose={() => setIsRenameOpen(false)}
          documentId={docData.id}
          currentTitle={docData.title}
        />
      )}

      {isShareOpen && (
        <ShareDocumentModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          documentId={docData.id}
          documentTitle={docData.title}
        />
      )}
    </>
  );
}
