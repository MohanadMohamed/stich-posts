import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { HeroUIProvider } from '@heroui/react'
import { router } from './routing/AppRouting.jsx'
import AuthProvider from './context/AuthContext.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <HeroUIProvider>
        <RouterProvider router={router} />

      </HeroUIProvider>
    </AuthProvider>
  </StrictMode>

)