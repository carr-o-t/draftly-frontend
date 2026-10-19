'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { useAppStore } from '@/stores/use-app-store';

export function Toaster(props: ToasterProps) {
  const theme = useAppStore((state) => state.theme);

  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      closeButton
      richColors
      mobileOffset={{ bottom: 88 }}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border-border group-[.toaster]:rounded-lg group-[.toaster]:shadow-lg',
          title: 'group-[.toast]:font-medium',
          description: 'group-[.toast]:text-muted-foreground',
          closeButton:
            'group-[.toast]:bg-popover group-[.toast]:text-muted-foreground group-[.toast]:border-border',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
}
