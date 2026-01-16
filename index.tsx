
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("🚀 App System Booting...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("❌ Root element not found");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("✅ App Render Triggered");
  } catch (err) {
    console.error("💥 Mount Error:", err);
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 40px; color: #e11d48; font-family: sans-serif; text-align: center;">
          <h2 style="font-weight: 900;">App Startup Failed</h2>
          <p style="opacity: 0.7;">${err instanceof Error ? err.message : 'Unknown startup error'}</p>
        </div>
      `;
    }
  }
}
