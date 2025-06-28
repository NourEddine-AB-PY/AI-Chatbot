import React, { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { HomeIcon, UserGroupIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon, QuestionMarkCircleIcon, ArrowRightOnRectangleIcon, PuzzlePieceIcon, BellIcon, ChevronDownIcon, SparklesIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'Stats', to: '/stats', icon: ChartBarIcon },
  { name: 'Integrations', to: '/integrations', icon: PuzzlePieceIcon },
  { name: 'Bots', to: '/bots', icon: UserGroupIcon },
  { name: 'Live Chat', to: '/live-chat', icon: ChatBubbleLeftRightIcon },
  { name: 'Settings', to: '/settings', icon: Cog6ToothIcon },
  { name: 'Help', to: '/help', icon: QuestionMarkCircleIcon },
]

const sidebarVariants = {
  hidden: { x: -80, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 80, damping: 18 } },
}
const topbarVariants = {
  hidden: { y: -40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80, damping: 18, delay: 0.2 } },
}

export default function Layout({ logoUrl, profile }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown on outside click
  function handleClick(e) {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false)
    }
  }
  
  // Handle notification click
  function handleNotificationClick() {
    setNotificationOpen(!notificationOpen)
  }

  // Handle user menu actions
  function handleUserMenuAction(action) {
    setDropdownOpen(false)
    switch (action) {
      case 'profile':
        setShowProfile(true)
        break
      case 'settings':
        navigate('/settings')
        break
      case 'stats':
        navigate('/stats')
        break
      case 'logout':
        if (confirm('Are you sure you want to logout?')) {
          alert('Logging out...')
          navigate('/login')
        }
        break
      default:
        break
    }
  }

  // Handle notification actions
  function handleNotificationAction(notification) {
    setNotificationOpen(false)
    switch (notification.type) {
      case 'message':
        navigate('/live-chat')
        break
      case 'bot':
        navigate('/bots')
        break
      case 'integration':
        navigate('/integrations')
        break
      default:
        alert(`Handling notification: ${notification.title}`)
    }
  }
  
  // Attach/detach event listener
  React.useEffect(() => {
    if (dropdownOpen) document.addEventListener('mousedown', handleClick)
    else document.removeEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownOpen])

  // Close profile modal on Esc
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') setShowProfile(false)
    }
    if (showProfile) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showProfile])

  return (
    <div className="relative min-h-screen bg-gray-900 flex">
      {/* Floating blurred shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600 opacity-10 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600 opacity-10 rounded-full blur-2xl z-0 animate-pulse delay-1000" />
      {/* Sidebar */}
      <motion.aside
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        className="z-20 w-80 bg-gray-800 border-r border-gray-700 flex flex-col py-8 px-6 min-h-screen shadow-2xl fixed top-0 left-0 h-full"
        style={{ maxHeight: '100vh' }}
      >
        {/* Logo */}
        <div className="mb-10 flex items-center gap-3 justify-center">
          <span className="bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 p-3 rounded-2xl shadow-lg">
            <SparklesIcon className="h-8 w-8 text-white drop-shadow" />
          </span>
          <span className="text-2xl font-extrabold text-white tracking-tight">ChatBot</span>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map(({ name, to, icon: Icon }) => (
            <NavLink
              key={name}
              to={to}
              className={({ isActive }) =>
                `group flex items-center gap-4 px-4 py-3 my-1 rounded-xl font-medium text-lg transition-all duration-200 relative overflow-hidden ` +
                (isActive
                  ? 'text-white font-bold bg-purple-600 shadow-md scale-105'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white')
              }
              style={{ minHeight: 52 }}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-pill"
                      className="absolute left-0 top-0 h-full w-full bg-purple-600 rounded-xl z-0 shadow-lg"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center">
                    <Icon className="h-6 w-6 transition-transform duration-200 group-hover:scale-125 group-hover:text-purple-400" />
                  </span>
                  <span className="relative z-10 ml-3">{name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="my-8 border-t border-gray-700" />
        <div className="text-sm text-gray-400 text-center">&copy; {new Date().getFullYear()} ChatBot Platform</div>
      </motion.aside>
      {/* Main content */}
      <div className="flex-1 ml-0 md:ml-80 min-h-screen flex flex-col">
        <motion.header
          initial="hidden"
          animate="visible"
          variants={topbarVariants}
          className="relative h-18 bg-gray-800 shadow-lg border border-gray-700 mx-4 mt-4 flex items-center px-8 justify-between z-20 rounded-xl"
        >
          {/* Welcome and search */}
          <div className="flex items-center gap-6">
            <div className="text-xl font-extrabold text-white tracking-tight drop-shadow">Welcome to ChatBot Platform</div>
            <div className="hidden md:flex items-center bg-gray-700 border border-gray-600 rounded-xl px-3 py-1.5 shadow-inner ml-2 focus-within:ring-2 focus-within:ring-purple-500 transition">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent outline-none text-white placeholder:text-gray-400 w-36"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    alert(`Searching for: ${e.target.value}`)
                  }
                }}
              />
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="relative"
                aria-label="Notifications"
              >
                <BellIcon className="h-6 w-6 text-gray-300 hover:text-purple-400 transition" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 shadow border-2 border-gray-800">3</span>
              </button>
              {notificationOpen && (
                <div className="absolute right-0 top-12 bg-gray-800 shadow-xl rounded-xl py-2 px-4 min-w-[280px] border border-gray-700 z-50">
                  <div className="font-semibold text-white mb-2">Notifications</div>
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleNotificationAction({ type: 'message', title: 'New message from John Doe' })}
                      className="w-full text-left py-2 px-2 text-gray-200 hover:bg-gray-700 rounded-lg cursor-pointer border-b border-gray-700"
                    >
                      <div className="font-medium">New message from John Doe</div>
                      <div className="text-sm text-gray-400">2 minutes ago</div>
                    </button>
                    <button 
                      onClick={() => handleNotificationAction({ type: 'bot', title: 'Bot SupportBot is now active' })}
                      className="w-full text-left py-2 px-2 text-gray-200 hover:bg-gray-700 rounded-lg cursor-pointer border-b border-gray-700"
                    >
                      <div className="font-medium">Bot 'SupportBot' is now active</div>
                      <div className="text-sm text-gray-400">10 minutes ago</div>
                    </button>
                    <button 
                      onClick={() => handleNotificationAction({ type: 'integration', title: 'New integration connected' })}
                      className="w-full text-left py-2 px-2 text-gray-200 hover:bg-gray-700 rounded-lg cursor-pointer"
                    >
                      <div className="font-medium">New integration connected</div>
                      <div className="text-sm text-gray-400">1 hour ago</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 cursor-pointer group transition-all"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-label="User menu"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Profile avatar"
                    className="w-9 h-9 rounded-full object-cover shadow border-2 border-gray-700"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 via-purple-400 to-indigo-400 flex items-center justify-center font-bold text-white shadow border-2 border-gray-700">B</div>
                )}
                <span className="font-semibold text-white">Business</span>
                <ChevronDownIcon className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition" />
              </motion.button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 bg-gray-800 shadow-xl rounded-xl py-2 px-4 min-w-[180px] border border-gray-700 z-50"
                  >
                    <button 
                      onClick={() => handleUserMenuAction('profile')}
                      className="w-full text-left py-2 px-2 text-gray-200 hover:bg-gray-700 rounded-lg cursor-pointer"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={() => handleUserMenuAction('settings')}
                      className="w-full text-left py-2 px-2 text-gray-200 hover:bg-gray-700 rounded-lg cursor-pointer"
                    >
                      Settings
                    </button>
                    <button 
                      onClick={() => handleUserMenuAction('stats')}
                      className="w-full text-left py-2 px-2 text-gray-200 hover:bg-gray-700 rounded-lg cursor-pointer"
                    >
                      Stats
                    </button>
                    <button 
                      onClick={() => handleUserMenuAction('logout')}
                      className="w-full text-left py-2 px-2 text-red-400 hover:bg-red-900/20 rounded-lg cursor-pointer"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Profile Modal */}
              {showProfile && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadein">
                  <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
                    <button
                      onClick={() => setShowProfile(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
                      aria-label="Close profile modal"
                    >&times;</button>
                    <div className="flex flex-col items-center mb-6">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Profile avatar" className="w-20 h-20 rounded-full object-cover shadow mb-2 border-2 border-purple-500" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 via-purple-400 to-indigo-400 flex items-center justify-center font-bold text-white shadow mb-2 border-2 border-purple-500 text-3xl">B</div>
                      )}
                      <div className="text-xl font-bold text-white mb-1">{profile.name}</div>
                      <div className="text-gray-400 text-sm">{profile.email}</div>
                    </div>
                    <div className="space-y-2 text-gray-300 mb-6">
                      <div><span className="font-semibold text-white">Phone:</span> {profile.phone}</div>
                      <div><span className="font-semibold text-white">Website:</span> <a href={profile.website} className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">{profile.website}</a></div>
                      <div><span className="font-semibold text-white">Timezone:</span> {profile.timezone}</div>
                      <div><span className="font-semibold text-white">Language:</span> {profile.language}</div>
                    </div>
                    <button
                      onClick={() => { setShowProfile(false); navigate('/settings'); }}
                      className="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.header>
        <motion.main
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 p-8 md:p-12"
        >
          <Outlet />
        </motion.main>
        <footer className="bg-gray-800 border-t border-gray-700 text-center py-4 text-gray-400 text-sm">ChatBot Platform &mdash; Empowering your business &copy; {new Date().getFullYear()}</footer>
      </div>
    </div>
  )
} 