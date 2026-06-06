import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"

import App from './App.jsx'
import { AuthProvider } from './app/providers/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <Notifications />
      <AuthProvider>
        <App />
      </AuthProvider>
    </MantineProvider>
  </StrictMode>
)
