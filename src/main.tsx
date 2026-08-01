import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeApp } from './app/di/composition-root';
import { App } from './app/App';
import './app/styles/globals.css';

// ── Bootstrap the application (wires all DI) ──
initializeApp();

const rootElement = document.getElementById('root');
if (rootElement === null) throw new Error('Root element #root not found in index.html');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
