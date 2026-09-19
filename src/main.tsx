/**
 * @fileoverview Application entry point for FocusList.
 * Mounts the root React component into the DOM using React 18's createRoot API.
 * Wraps the application in React.StrictMode for development-time checks.
 * @module main
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * The root DOM element where the React application is mounted.
 * Throws an error if the element is not found to prevent silent failures.
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'FocusList: Root element not found. Ensure there is a <div id="root"> in your HTML.'
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
