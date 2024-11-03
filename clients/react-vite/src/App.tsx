import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/contexts/ThemeContext"
import AuthProvider from "@/contexts/AuthContext"
import AppProvider from "@/contexts/AppContext"
import ChatProvider from "@/contexts/ChatContext"
import Home from './pages/Home'
import Chat from './pages/Chat'
// import './App.css'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <ChatProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/chat/:id" element={<Chat />} />
              </Routes>
            </ChatProvider>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
