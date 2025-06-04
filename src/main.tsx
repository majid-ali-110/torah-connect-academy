
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize i18n before rendering the app
import './i18n/config.ts'

createRoot(document.getElementById("root")!).render(<App />);
