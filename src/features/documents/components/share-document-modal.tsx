'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import {
  useInviteUsers,
  useRevokeAccess,
} from '@/features/documents/mutations';
import { useDocumentPermissions } from '@/features/documents/queries';
import { Loader2, Trash2, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
}

export function ShareDocumentModal({
  isOpen,
  onClose,
  documentId,
  documentTitle,
}: ShareDocumentModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor'>('viewer');

  const { mutate: inviteUsers, isPending: isInviting } =
    useInviteUsers(documentId);
  const { mutate: revokeAccess, isPending: isRevoking } =
    useRevokeAccess(documentId);
  const { data: permissionsData, isLoading: isLoadingPerms } =
    useDocumentPermissions(documentId);

  const permissions = permissionsData?.data || [];

  const handleInvite = () => {
    if (!email.trim()) return;

    inviteUsers([{ email, role }], {
      onSuccess: () => {
        setEmail('');
      },
    });
  };

  const handleRevoke = (userId: string) => {
    revokeAccess(userId);
  };

  const sortedPermissions = [...permissions].sort((a, b) => {
    if (a.role === 'owner') return -1;
    if (b.role === 'owner') return 1;
    return 0;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Share "${documentTitle}"`}
      className="max-w-xl"
    >
      <div className="space-y-6">
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <input
              type="email"
              placeholder="Add people by email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-primary focus:border-primary flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'viewer' | 'editor')}
              className="border-input bg-background ring-offset-background focus:ring-primary focus:border-primary flex h-10 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          <button
            onClick={handleInvite}
            disabled={isInviting || !email.trim()}
            className="border-input hover:bg-accent hover:text-accent-foreground h-10 rounded-md border bg-transparent px-3 py-2 transition-colors"
            title="Send Invite"
          >
            {isInviting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <UserPlus className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="space-y-3">
          <h3 className="text-foreground text-sm font-medium">
            People with access
          </h3>
          <div className="max-h-60 space-y-3 overflow-y-auto pr-1">
            {isLoadingPerms ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
              </div>
            ) : (
              sortedPermissions.map((perm) => (
                <div
                  key={perm.user_id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium uppercase">
                      {perm.name
                        ? perm.name[0]
                        : perm.email
                          ? perm.email[0]
                          : 'U'}
                    </div>
                    <div className="text-sm">
                      <p className="leading-none font-medium">
                        {perm.name ||
                          perm.email.split('@')[0] ||
                          'Unknown User'}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {perm.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'focus:ring-ring inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none',
                        perm.role === 'owner'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      )}
                    >
                      {perm.role.charAt(0).toUpperCase() + perm.role.slice(1)}
                    </span>

                    {perm.role !== 'owner' && (
                      <button
                        onClick={() => handleRevoke(perm.user_id)}
                        disabled={isRevoking}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex h-8 w-8 items-center justify-center rounded-md transition-colors"
                        title="Remove Access"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
