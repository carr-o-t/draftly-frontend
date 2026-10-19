'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useSignOut } from '@/features/auth/hooks/use-sign-out';
import { useUserEmail } from '@/features/auth/hooks/use-user-email';
import { cn } from '@/lib/utils';

interface ProfileMenuProps {
  openUp?: boolean;
  renderTrigger: (args: {
    onClick: () => void;
    isOpen: boolean;
    userEmail: string | null;
  }) => ReactNode;
}

export function ProfileMenu({
  openUp = false,
  renderTrigger,
}: ProfileMenuProps) {
  const { signOut } = useSignOut();
  const userEmail = useUserEmail();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {renderTrigger({
        onClick: () => setIsOpen((prev) => !prev),
        isOpen,
        userEmail,
      })}

      {isOpen && (
        <div
          className={cn(
            'bg-popover animate-in fade-in zoom-in-95 absolute right-0 z-50 w-56 rounded-md border p-2 shadow-md duration-100',
            openUp ? 'bottom-full mb-2' : 'top-10'
          )}
        >
          <div className="px-2 py-1.5 text-sm">
            <p className="font-semibold">My Account</p>
            <p className="text-muted-foreground truncate text-xs">
              {userEmail || 'user@example.com'}
            </p>
          </div>
          <div className="bg-muted my-1 h-px" />
          <button
            onClick={signOut}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}
