// Immediately scroll to top and strip hash BEFORE React renders
if (window.location.hash) {
  // Scroll to top instantly
  window.scrollTo(0, 0);

  // Remove hash from the URL (without reloading)
  history.replaceState(null, '', window.location.pathname + window.location.search);
}


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
