import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { LanguageProvider } from './contexts/LanguageContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ModernSetup from './pages/ModernSetup'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Integrations from './pages/Integrations'
import Bots from './pages/Bots'
import LiveChat from './pages/LiveChat'
import Settings from './pages/Settings'
import Help from './pages/Help'
import Stats from './pages/Stats'
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [logoUrl, setLogoUrl] = useState('')
  const [profile, setProfile] = useState({
    name: 'Example Corp',
    email: 'business@example.com',
    phone: '+1 (555) 123-4567',
    website: 'https://example.com',
    timezone: 'America/New_York',
    language: 'English',
  })
  const [showSetup, setShowSetup] = useState(false)

  // Check if user needs to complete setup
  useEffect(() => {
    const setupCompleted = localStorage.getItem('setupCompleted')
    
    if (!setupCompleted) {
      setShowSetup(true)
    }
  }, [])

  // Handle setup completion
  const handleSetupComplete = () => {
    localStorage.setItem('setupCompleted', 'true')
    setShowSetup(false)
  }

  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup onSignupSuccess={() => setShowSetup(true)} />} />
            <Route path="/setup" element={<ModernSetup onComplete={handleSetupComplete} />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route element={<Layout logoUrl={logoUrl} profile={profile} />}>
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
              <Route path="/bots" element={<ProtectedRoute><Bots /></ProtectedRoute>} />
              <Route path="/live-chat" element={<ProtectedRoute><LiveChat /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings logoUrl={logoUrl} setLogoUrl={setLogoUrl} profile={profile} setProfile={setProfile} /></ProtectedRoute>} />
              <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
              <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          
          {/* Show setup modal if needed */}
          {showSetup && (
            <div className="fixed inset-0 z-50">
              <ModernSetup onComplete={handleSetupComplete} />
            </div>
          )}
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
