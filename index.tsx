
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("🚀 App System Booting...");

const startApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error("❌ Critical: Root element not found in DOM");
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("✅ Application mounted successfully");
  } catch (err) {
    console.error("💥 Critical Render Error:", err);
    rootElement.innerHTML = `
      <div style="padding: 40px; color: #e11d48; font-family: system-ui, sans-serif; background: #fff1f2; min-h: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
        <h2 style="font-weight: 900; font-size: 24px; margin-bottom: 10px;">Tracker Failed to Start</h2>
        <p style="opacity: 0.7; font-weight: 500; max-width: 400px;">${err instanceof Error ? err.message : 'A connection error occurred while loading dependencies.'}</p>
        <button onclick="window.location.reload()" style="margin-top: 24px; padding: 12px 24px; background: #e11d48; color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer;">Try Again</button>
      </div>
    `;
  }
};

// Ensure DOM is fully ready before mounting
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  startApp();
} else {
  document.addEventListener('DOMContentLoaded', startApp);
}
