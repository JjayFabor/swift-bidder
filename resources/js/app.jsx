import "../css/app.css";
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import axios from 'axios';

// Axios interceptor to handle session expiration
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            router.visit('/login'); // Redirect to login if session expires
        }
        return Promise.reject(error);
    }
);

createInertiaApp({
    resolve: name => {
      const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
      return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
      createRoot(el).render(
        <ThemeProvider>
          <App {...props} />
        </ThemeProvider>
      );
    },
  });
