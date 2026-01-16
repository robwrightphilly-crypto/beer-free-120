import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Immediately notify the window that we've started executing the main bundle
(window as any).appLoaded = true;
console.log("🚀 Application Module Started Successfully");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("React Mounting Error:", error);
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; color: #e11d48; font-family: sans-serif;">
        <h2 style="font-weight: 900;">Mounting Failed</h2>
        <p style="font-size: 14px;">${error instanceof Error ? error.message : String(error)}</p>
      </div>
    `;
  }
} else {
  console.error("Root container not found");
}