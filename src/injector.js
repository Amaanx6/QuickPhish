import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Create container for React app
const appContainer = document.createElement('div')
appContainer.id = 'quickphish-root'
document.body.appendChild(appContainer)

// Mount React app
const root = createRoot(appContainer)
root.render(<App />)

// Inject styles
const style = document.createElement('style')
style.textContent = `
  #quickphish-root {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 999999;
    pointer-events: none;
  }
`
document.head.appendChild(style)