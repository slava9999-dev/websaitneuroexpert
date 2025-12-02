import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import "@/index.css";
import App from "@/App";
import { validateEnv } from "@/config/validateEnv";
import { initWebVitals, logPerformanceSummary } from "@/utils/webVitals";

// Validate environment variables before app starts
try {
  validateEnv();
} catch (error) {
  // Show error to user if critical env vars are missing
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-center; min-height: 100vh; padding: 20px; font-family: system-ui, -apple-system, sans-serif;">
      <div style="max-width: 600px; padding: 40px; background: #fee; border: 2px solid #c00; border-radius: 8px;">
        <h1 style="color: #c00; margin: 0 0 16px 0;">⚠️ Configuration Error</h1>
        <pre style="white-space: pre-wrap; font-size: 14px; line-height: 1.5;">${error.message}</pre>
      </div>
    </div>
  `;
  throw error;
}

// Initialize Sentry for error monitoring in production
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
    release: "neuroexpert@3.0.0",
  });
}

// Initialize Web Vitals monitoring
initWebVitals();

// Log performance summary after page load (development only)
if (import.meta.env.MODE === 'development') {
  window.addEventListener('load', () => {
    setTimeout(logPerformanceSummary, 1000);
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
