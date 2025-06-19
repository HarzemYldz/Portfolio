import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from './pages/admin/Login'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Skills from './pages/admin/Skills'
import About from './pages/admin/About'
import Messages from './pages/admin/Messages'
import Home from './pages/Home'
import Projects from './pages/admin/Projects'
import { ToastProvider } from './components/ToastProvider'
import { useToast } from './hooks/useToast'
import Toast from './components/Toast'

const queryClient = new QueryClient()

// Protected Route bileşeni
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />
}

function App() {
  const { toasts, showToast } = useToast()

  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-white via-[#e3eafc] to-[#f5f7fa] dark:from-[#1a223f] dark:via-[#23395d] dark:to-[#101624] transition-colors duration-500">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="skills" element={<Skills />} />
                <Route path="about" element={<About />} />
                <Route path="messages" element={<Messages />} />
                <Route path="profile" element={<div>Profil Sayfası</div>} />
              </Route>
            </Routes>
            {toasts.map((toast) => (
              <Toast
                key={toast.id}
                message={toast.message}
                type={toast.type}
                onClose={() => {}}
              />
            ))}
          </div>
        </Router>
      </QueryClientProvider>
    </ToastProvider>
  )
}

export default App 