
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Signal to the watchdog that we've started executing code
(window as any).appLoaded = true;

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Mount Error:", err);
    rootElement.innerHTML = `<div style="padding:40px;text-align:center;color:red;">Failed to start app: ${err}</div>`;
  }
}
