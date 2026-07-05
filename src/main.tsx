import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.tsx'
import { RatesProvider } from './hooks/useRates'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RatesProvider>
      <App />
    </RatesProvider>
  </StrictMode>,
)
