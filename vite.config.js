import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
/**
 * Vite configuration for FocusList.
 * React is split into its own chunk and modern browsers are targeted
 * to keep the main bundle small and cache-friendly.
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
    plugins: [react()],
    build: {
        sourcemap: false,
        target: 'es2020',
        cssMinify: true,
        reportCompressedSize: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom'],
                },
            },
        },
    },
});
