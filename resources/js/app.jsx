import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';



let appName =import.meta.env.VITE_APP_NAME || 'Inventory';

createInertiaApp({
    title: (title) => `${title || 'Home'} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        appName = props.initialPage.props.name || 'Inventory';        ;
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
