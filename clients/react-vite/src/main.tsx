import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'highlight.js/styles/github-dark-dimmed.min.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/contexts/ThemeContext"
import AuthProvider from "@/contexts/AuthContext"
import AppProvider from "@/contexts/AppContext"
import ChatProvider from "@/contexts/ChatContext"
import Home from './pages/Home'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound.tsx'

function Router() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <ChatProvider>
              <Routes>
                <Route path="/" element={<App />}>
                  <Route index element={<Home />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/chat/:id" element={<Chat />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </ChatProvider>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)
