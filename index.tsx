
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("🚀 App Booting...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("❌ Could not find root element");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("✅ App Rendered");
} catch (err) {
  console.error("💥 Render Error:", err);
  rootElement.innerHTML = `<div style="padding: 20px; color: red; font-family: sans-serif;">
    <h2>App failed to start</h2>
    <p>${err instanceof Error ? err.message : 'Unknown error'}</p>
  </div>`;
}
