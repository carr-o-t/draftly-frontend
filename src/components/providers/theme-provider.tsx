'use client';

import { useAppStore } from '@/stores/use-app-store';
import { useEffect, useState } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useAppStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    // Prevent hydration mismatch
    if (!mounted) {
        return <>{children}</>;
    }

    return <>{children}</>;
}
