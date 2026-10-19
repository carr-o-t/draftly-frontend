'use client';

import { useAppStore } from '@/stores/use-app-store';
import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useAppStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
