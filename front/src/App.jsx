import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
    const token = localStorage.getItem('token')
    const setupCompleted = localStorage.getItem('setupCompleted')
    
    if (token && !setupCompleted) {
      setShowSetup(true)
    }
  }, [])

  // Handle setup completion
  const handleSetupComplete = () => {
    localStorage.setItem('setupCompleted', 'true')
    setShowSetup(false)
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup onSignupSuccess={() => setShowSetup(true)} />} />
        <Route path="/setup" element={<ModernSetup onComplete={handleSetupComplete} />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route element={<Layout logoUrl={logoUrl} profile={profile} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/bots" element={<Bots />} />
          <Route path="/live-chat" element={<LiveChat />} />
          <Route path="/settings" element={<Settings logoUrl={logoUrl} setLogoUrl={setLogoUrl} profile={profile} setProfile={setProfile} />} />
          <Route path="/help" element={<Help />} />
          <Route path="/stats" element={<Stats />} />
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
  )
}

export default App
