/**
 * @fileoverview Application entry point for FocusList.
 * Mounts the root React component using React 18's createRoot API,
 * wrapped in StrictMode for development-time checks.
 * @module main
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'FocusList: Root element not found. Ensure there is a <div id="root"> in your HTML.'
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
