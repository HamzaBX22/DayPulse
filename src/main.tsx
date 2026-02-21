import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { PulseProvider } from './store/PulseContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PulseProvider>
      <App />
    </PulseProvider>
  </StrictMode>,
)
