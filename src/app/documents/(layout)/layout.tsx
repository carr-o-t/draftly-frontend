'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { MobileFooter } from '@/components/layout/mobile-footer';
import { ProfileMenu } from '@/components/layout/profile-menu';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { SearchInput } from '@/components/ui/search-input';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // editor page (/documents/:id) renders full-screen without nav chrome
  const isEditor =
    /^\/documents\/[^/]+$/.test(pathname) &&
    !['shared', 'settings', 'access-requests'].includes(
      pathname.split('/').pop() || ''
    );

  if (isEditor) {
    return <>{children}</>;
  }

  return (
    <div className="bg-background flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-background flex h-14 items-center gap-4 border-b px-6 lg:h-[60px]">
          <div className="w-full flex-1">
            <Suspense fallback={null}>
              <SearchInput />
            </Suspense>
          </div>
          <div className="flex items-center gap-4">
            <ProfileMenu
              renderTrigger={({ onClick, userEmail }) => (
                <button
                  onClick={onClick}
                  className="bg-primary/10 text-primary hover:bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors"
                >
                  {userEmail ? userEmail[0].toUpperCase() : 'U'}
                </button>
              )}
            />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto scroll-smooth p-6 pb-24 md:pb-6">
          {children}
          <MobileFooter />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
