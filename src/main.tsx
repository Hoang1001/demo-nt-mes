import React from 'react'
import ReactDOM from 'react-dom/client'
import SlideView from './SlideView'
import { LanguageProvider } from './i18n'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <SlideView />
    </LanguageProvider>
  </React.StrictMode>,
)
