import '../css/app.css';

import { Toaster } from '@/components/ui/sonner';
import { Inertia } from '@inertiajs/inertia';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { registerCsrfSync } from './lib/csrf';

const appName = import.meta.env.VITE_APP_NAME || 'SIHUMA';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
                <Toaster />
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// Force light mode on load (theme switching disabled)...
initializeTheme();
registerCsrfSync();
Inertia.on('finish', () => {
    registerCsrfSync();
});
