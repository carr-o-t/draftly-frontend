'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { useSignOut } from '@/features/auth/hooks/use-sign-out';
import { LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { SearchInput } from '@/components/ui/search-input';
import { useUserEmail } from '@/features/auth/hooks/use-user-email';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { signOut } = useSignOut();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const userEmail = useUserEmail();
  const profileRef = useRef<HTMLDivElement>(null);

  // editor page (/documents/:id) renders full-screen without nav chrome
  const isEditor =
    /^\/documents\/[^/]+$/.test(pathname) &&
    !['shared', 'settings', 'access-requests'].includes(
      pathname.split('/').pop() || ''
    );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isEditor) {
    return <>{children}</>;
  }

  return (
    <div className="bg-muted/40 flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-background flex h-14 items-center gap-4 border-b px-6 lg:h-[60px]">
          <div className="w-full flex-1">
            <Suspense fallback={null}>
              <SearchInput />
            </Suspense>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="bg-primary/10 text-primary hover:bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors"
              >
                {userEmail ? userEmail[0].toUpperCase() : 'U'}
              </button>

              {isProfileOpen && (
                <div className="bg-popover animate-in fade-in zoom-in-95 absolute top-10 right-0 z-10 w-56 rounded-md border p-2 shadow-md duration-100">
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
          </div>
        </header>
        <main className="flex-1 overflow-y-auto scroll-smooth p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
