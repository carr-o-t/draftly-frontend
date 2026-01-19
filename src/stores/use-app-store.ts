import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppState {
    isSidebarOpen: boolean;
    theme: 'light' | 'dark';
    toggleSidebar: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>()(
    devtools(
        persist(
            (set) => ({
                isSidebarOpen: true,
                theme: 'light',
                toggleSidebar: () =>
                    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
                setTheme: (theme) => set({ theme }),
            }),
            {
                name: 'app-storage',
            }
        )
    )
);
