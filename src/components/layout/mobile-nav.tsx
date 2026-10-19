'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Users, Inbox, Plus, Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCreateDocument } from '@/features/documents/mutations';
import { ProfileMenu } from '@/components/layout/profile-menu';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const documentsItem: NavItem = {
  title: 'Documents',
  href: '/documents',
  icon: FileText,
};

const sharedItem: NavItem = {
  title: 'Shared',
  href: '/documents/shared',
  icon: Users,
};

const requestsItem: NavItem = {
  title: 'Requests',
  href: '/documents/access-requests',
  icon: Inbox,
};

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={cn(
        'flex flex-col items-center gap-1 px-2 py-1 text-[11px] font-medium transition-colors',
        isActive ? 'text-primary' : 'text-muted-foreground'
      )}
    >
      <item.icon className="h-5 w-5" />
      {item.title}
    </Link>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const { mutate: createDocument, isPending } = useCreateDocument();

  const handleCreateDocument = () => {
    createDocument({ title: 'Untitled Document' });
  };

  return (
    <nav className="bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-sm md:hidden">
      <div className="relative">
        <div className="grid h-16 grid-cols-2">
          <div className="flex items-center justify-evenly pr-6">
            <NavLink item={documentsItem} pathname={pathname} />
            <NavLink item={sharedItem} pathname={pathname} />
          </div>

          <div className="flex items-center justify-evenly pl-6">
            <NavLink item={requestsItem} pathname={pathname} />
            <ProfileMenu
              openUp
              renderTrigger={({ onClick, userEmail }) => (
                <button
                  onClick={onClick}
                  className="text-muted-foreground flex flex-col items-center gap-1 px-2 py-1 text-[11px] font-medium transition-colors"
                >
                  <span className="bg-primary/10 text-primary flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium">
                    {userEmail ? userEmail[0].toUpperCase() : 'U'}
                  </span>
                  Account
                </button>
              )}
            />
          </div>
        </div>

        <button
          onClick={handleCreateDocument}
          disabled={isPending}
          aria-label="Create document"
          className="bg-primary text-primary-foreground hover:bg-primary/90 absolute -top-5 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full shadow-lg transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </button>
      </div>
    </nav>
  );
}
