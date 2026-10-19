import { ReactNode, useState, useEffect, useRef } from 'react';
import { Sidebar } from './sidebar';
import { Search, LogOut } from 'lucide-react';
import { useSignOut } from '@/features/auth/hooks/use-sign-out';
import { useUserEmail } from '@/features/auth/hooks/use-user-email';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { signOut } = useSignOut();
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const userEmail = useUserEmail();
  const profileRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="bg-muted/40 flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-background flex h-14 items-center gap-4 border-b px-6 lg:h-[60px]">
          <div className="w-full flex-1">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <input
                  type="search"
                  placeholder="Search documents..."
                  className="bg-background focus:ring-primary h-9 w-full rounded-md border px-3 pl-8 text-sm focus:ring-1 focus:outline-none md:w-2/3 lg:w-1/3"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
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
