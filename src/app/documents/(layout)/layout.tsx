"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { SearchInput } from "@/components/ui/search-input";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const { signOut } = useSignOut();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // editor page (/documents/:id) renders full-screen without nav chrome
    const isEditor = /^\/documents\/[^/]+$/.test(pathname) &&
        !["shared", "settings", "access-requests"].includes(pathname.split("/").pop() || "");

    useEffect(() => {
        // cookie parser to find user_email
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };
        const email = getCookie("user_email");
        if (email) setUserEmail(decodeURIComponent(email)); // basic decode if needed

        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // editor page needs no sidebar/header
    if (isEditor) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen w-full bg-muted/40">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex h-14 items-center gap-4 border-b bg-background px-6 lg:h-[60px]">
                    <div className="w-full flex-1">
                        <Suspense fallback={null}>
                            <SearchInput />
                        </Suspense>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                            >
                                {userEmail ? userEmail[0].toUpperCase() : "U"}
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 top-10 z-10 w-56 rounded-md border bg-popover p-2 shadow-md animate-in fade-in zoom-in-95 duration-100">
                                    <div className="px-2 py-1.5 text-sm">
                                        <p className="font-semibold">My Account</p>
                                        <p className="text-xs text-muted-foreground truncate">{userEmail || "user@example.com"}</p>
                                    </div>
                                    <div className="h-px bg-muted my-1" />
                                    <button
                                        onClick={signOut}
                                        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Sign out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
}