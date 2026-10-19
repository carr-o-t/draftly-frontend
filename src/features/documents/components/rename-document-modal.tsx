'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { useUpdateDocument } from '@/features/documents/mutations';
import { Loader2 } from 'lucide-react';

interface RenameDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  currentTitle: string;
}

export function RenameDocumentModal({
  isOpen,
  onClose,
  documentId,
  currentTitle,
}: RenameDocumentModalProps) {
  const [title, setTitle] = useState(currentTitle);
  const { mutate: updateDocument, isPending } = useUpdateDocument(documentId);

  const handleSave = () => {
    if (!title.trim()) return;

    // Optimistic check: if no change, just close
    if (title === currentTitle) {
      onClose();
      return;
    }

    updateDocument(
      { title },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rename Document">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="title"
            className="text-foreground text-sm font-medium"
          >
            Document title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-primary focus:border-primary flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md border px-4 py-2 text-sm font-medium transition-colors"
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            disabled={isPending}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
