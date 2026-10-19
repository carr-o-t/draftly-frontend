'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APP_NAME, DEVELOPER_NAME, SOCIAL_LINKS } from '@/constants';
import { useCreateDocument } from '@/features/documents/mutations';
import {
  LayoutDashboard,
  FileText,
  Users,
  Plus,
  Github,
  Linkedin,
  Mail,
  Loader2,
  Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  {
    title: 'My Documents',
    href: '/documents',
    icon: FileText,
  },
  {
    title: 'Shared with Me',
    href: '/documents/shared',
    icon: Users,
  },
  {
    title: 'Access Requests',
    href: '/documents/access-requests',
    icon: Inbox,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { mutate: createDocument, isPending } = useCreateDocument();

  const handleCreateDocument = () => {
    createDocument({ title: 'Untitled Document' });
  };

  return (
    <aside className="bg-muted hidden h-screen w-64 flex-col border-r md:flex">
      <div className="flex h-14 items-center border-b px-6 lg:h-[60px]">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <LayoutDashboard className="h-6 w-6" />
          <span>{APP_NAME}</span>
        </Link>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <button
          onClick={handleCreateDocument}
          disabled={isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          New Document
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-4 text-sm font-medium">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
              pathname === item.href
                ? 'bg-muted text-primary'
                : 'text-muted-foreground'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-4 border-t p-4">
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-semibold">
            Connect with me
          </p>
          <div className="flex gap-2">
            <Link
              href={SOCIAL_LINKS.GITHUB}
              target="_blank"
              className="hover:bg-muted rounded-md p-2 transition-colors"
            >
              <Github className="text-foreground h-4 w-4" />
            </Link>
            <Link
              href={SOCIAL_LINKS.LINKEDIN}
              target="_blank"
              className="hover:bg-muted rounded-md p-2 transition-colors"
            >
              <Linkedin className="text-foreground h-4 w-4" />
            </Link>
            <Link
              href={`mailto:${SOCIAL_LINKS.MAIL}`}
              target="_blank"
              className="hover:bg-muted rounded-md p-2 transition-colors"
            >
              <Mail className="text-foreground h-4 w-4" />
            </Link>
          </div>
          <p className="text-muted-foreground text-xs">
            A project by{' '}
            <span className="text-primary font-semibold">{DEVELOPER_NAME}</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
