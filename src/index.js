import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

// Register service worker for PWA functionality
// Enable for production deployments
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    console.log('🔄 New version available!');
    // Dispatch event for UpdatePrompt component
    window.dispatchEvent(new CustomEvent('appUpdateAvailable', {
      detail: { registration }
    }));
  },
  onSuccess: (registration) => {
    console.log('✅ App is ready for offline use');
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
