import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './input.css';
import App from './App.jsx';
import { msalConfig } from './auth/authConfig';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';

const msalInstance = new PublicClientApplication(msalConfig);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </StrictMode>
);
