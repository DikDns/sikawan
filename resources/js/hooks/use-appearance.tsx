import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// const setCookie = (name: string, value: string, days = 365) => {
//     if (typeof document === 'undefined') {
//         return;
//     }

//     const maxAge = days * 24 * 60 * 60;
//     document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
// };

const applyTheme = (appearance: Appearance) => {
    const isDark =
        appearance === 'dark' || (appearance === 'system' && prefersDark());

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

// const mediaQuery = () => {
//     if (typeof window === 'undefined') {
//         return null;
//     }

//     return window.matchMedia('(prefers-color-scheme: dark)');
// };

// const handleSystemThemeChange = () => {
//     const currentAppearance = localStorage.getItem('appearance') as Appearance;
//     applyTheme(currentAppearance || 'system');
// };

export function initializeTheme() {
    // Force light mode - ignore saved preferences
    applyTheme('light');

    // Remove event listener for system theme changes since we're forcing light mode
    // mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    // Always return light mode - disable theme switching
    const [appearance] = useState<Appearance>('light');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateAppearance = useCallback((_mode: Appearance) => {
        // Do nothing - theme switching is disabled
        // Always force light mode
        applyTheme('light');
    }, []);

    useEffect(() => {
        // Always apply light theme on mount
        applyTheme('light');
    }, []);

    return { appearance, updateAppearance } as const;
}
