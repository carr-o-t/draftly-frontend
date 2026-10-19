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
import { useState, useRef, useEffect } from 'react';
import { useDeleteDocument } from '../mutations';
import { RenameDocumentModal } from './rename-document-modal';
import { ShareDocumentModal } from './share-document-modal';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { DocumentThumbnail } from './document-thumbnail';

interface DocumentCardProps {
  docData: Document;
}

export function DocumentCard({ docData }: DocumentCardProps) {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const { mutate: deleteDocument, isPending: isDeleting } = useDeleteDocument();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
    if (confirm(`Are you sure you want to delete "${docData.title}"?`)) {
      deleteDocument(docData.id);
    }
    setIsMenuOpen(false);
  };

  const handleOpenDocument = () => {
    router.push(`/documents/${docData.id}`);
  };

  return (
    <>
      <div
        aria-label={docData.title}
        tabIndex={0}
        onClick={handleOpenDocument}
        className="group bg-card hover:border-primary/50 relative flex max-w-[240px] cursor-pointer flex-col justify-between overflow-hidden rounded-xl border p-0 shadow-sm transition-all hover:shadow-md"
      >
        <div className="bg-muted/10 relative aspect-3/4 h-64 border-b">
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

        <div className="flex items-center justify-between gap-3 p-3">
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
              <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
                <span>Opened {formatDate(docData.updated_at)}</span>
              </div>
            </div>
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="text-muted-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-full opacity-0 transition-colors group-hover:opacity-100 focus:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {isMenuOpen && (
              <div
                className="bg-popover animate-in fade-in zoom-in-95 absolute right-0 bottom-full z-20 mb-1 w-48 rounded-md border p-1 shadow-md duration-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDocument();
                    }}
                    className="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none"
                  >
                    <FolderOpen className="h-4 w-4" />
                    <span>Open</span>
                  </button>
                  {docData.role === 'owner' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsRenameOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span>Rename</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsShareOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                      <div className="bg-muted my-1 h-px" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete();
                        }}
                        disabled={isDeleting}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
