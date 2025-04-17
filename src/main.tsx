import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AppAuthProvider } from './lib/auth-provider'

createRoot(document.getElementById("root")!).render(
  <AppAuthProvider>
    <App />
  </AppAuthProvider>
);
