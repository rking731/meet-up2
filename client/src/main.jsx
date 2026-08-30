import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'

const PublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if(!PublishableKey) {
  throw new Error('Missing Publishable Key. Please set the VITE_CLERK_PUBLISHABLE_KEY environment variable.')
}

createRoot(document.getElementById('root')).render(
    <ClerkProvider publishableKey={PublishableKey} afterSignOutUrl="/login">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>,
)
