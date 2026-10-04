import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

createInertiaApp({
    resolve: async (name) => {
        const page = await resolvePageComponent(`./${name}.jsx`, import.meta.glob('./**/*.jsx'));
        
        // Return a new object with a wrapped default component
        return {
            ...page,
            default: (props) => (
                <BrowserRouter>
                    <page.default {...props} />
                </BrowserRouter>
            ),
        };
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});