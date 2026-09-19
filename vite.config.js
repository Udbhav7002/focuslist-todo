import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
/**
 * Vite configuration for FocusList.
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
    plugins: [react()],
    build: {
        /** Generate source maps for debugging. */
        sourcemap: false,
        /** Target modern browsers for smaller bundles. */
        target: 'es2020',
        /** Optimize chunk splitting. */
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom'],
                },
            },
        },
    },
});
