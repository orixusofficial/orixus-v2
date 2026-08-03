import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import posthog from 'posthog-js';
import Clarity from "@microsoft/clarity";
import './styles/tokens.css';
import './styles/reset.css';
import { AuthProvider } from './contexts/AuthContext';
import App from './App.jsx';

posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  person_profiles: 'identified_only',
});

Clarity.init("xwnc99uvv3");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
