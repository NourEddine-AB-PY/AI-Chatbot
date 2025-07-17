import React, { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { HomeIcon, UserGroupIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon, QuestionMarkCircleIcon, ArrowRightOnRectangleIcon, PuzzlePieceIcon, BellIcon, ChevronDownIcon, SparklesIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { authAPI } from '../utils/api'

const navItems = [
  { name: 'dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'stats', to: '/stats', icon: ChartBarIcon },
  { name: 'integrations', to: '/integrations', icon: PuzzlePieceIcon },
  { name: 'bots', to: '/bots', icon: UserGroupIcon },
  { name: 'liveChat', to: '/live-chat', icon: ChatBubbleLeftRightIcon },
  { name: 'settings', to: '/settings', icon: Cog6ToothIcon },
  { name: 'help', to: '/help', icon: QuestionMarkCircleIcon },
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
  const { t, language, changeLanguage, isRTL } = useLanguage()
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
        if (confirm(isRTL ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to logout?')) {
          // ✅ SECURE: Call logout endpoint to clear cookie
          authAPI.logout().finally(() => {
            // Clear localStorage
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('setupCompleted')
            // Redirect to login
            navigate('/login')
          })
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
    <div className={`relative min-h-screen bg-gray-900 flex ${isRTL ? 'flex-row-reverse' : ''}`}>
      {/* Floating blurred shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600 opacity-10 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600 opacity-10 rounded-full blur-2xl z-0 animate-pulse delay-1000" />
      {/* Sidebar */}
      <motion.aside
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        className={`z-20 w-80 bg-gray-800 border-r border-gray-700 flex flex-col py-8 px-6 min-h-screen shadow-2xl fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full`}
        style={{ maxHeight: '100vh' }}
      >
        {/* Logo */}
        <div className="mb-10 flex items-center gap-3 justify-center">
          <span className="bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 p-3 rounded-2xl shadow-lg">
            <SparklesIcon className="h-8 w-8 text-white drop-shadow" />
          </span>
          <span className="text-2xl font-extrabold text-white tracking-tight">ChatBot</span>
        </div>
        
        {/* Language Switcher */}
        <div className="mb-6 flex justify-center">
          <div className="bg-gray-700 rounded-lg p-1 flex">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                language === 'en' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('ar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                language === 'ar' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              العربية
            </button>
          </div>
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
                  <span className="relative z-10 ml-3">{t(name)}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="my-8 border-t border-gray-700" />
        <div className="text-sm text-gray-400 text-center">&copy; {new Date().getFullYear()} ChatBot Platform</div>
      </motion.aside>
      {/* Main content */}
      <div className={`flex-1 ${isRTL ? 'mr-0 md:mr-80' : 'ml-0 md:ml-80'} min-h-screen flex flex-col`}>
        <motion.header
          initial="hidden"
          animate="visible"
          variants={topbarVariants}
          className="relative h-18 bg-gray-800 shadow-lg border border-gray-700 mx-4 mt-4 flex items-center px-8 justify-between z-20 rounded-xl"
        >
          {/* Welcome and search */}
          <div className="flex items-center gap-6">
            <div className="text-xl font-extrabold text-white tracking-tight drop-shadow">{t('welcomeBack')}</div>
            <div className="hidden md:flex items-center bg-gray-700 border border-gray-600 rounded-xl px-3 py-1.5 shadow-inner ml-2 focus-within:ring-2 focus-within:ring-purple-500 transition">
              <input 
                type="text" 
                placeholder={t('search')} 
                className="bg-transparent outline-none text-white placeholder:text-gray-400 w-36"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    alert(`${isRTL ? 'البحث عن:' : 'Searching for:'} ${e.target.value}`)
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
                aria-label={t('notifications')}
              >
                <BellIcon className="h-6 w-6 text-gray-300 hover:text-purple-400 transition" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 shadow border-2 border-gray-800">3</span>
              </button>
              {notificationOpen && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-12 bg-gray-800 shadow-xl rounded-xl py-2 px-4 min-w-[280px] border border-gray-700 z-50`}>
                  <div className="font-semibold text-white mb-2">{t('notifications')}</div>
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleNotificationAction({ type: 'message', title: t('newMessage') })}
                      className="w-full text-left py-2 px-2 text-gray-200 hover:bg-gray-700 rounded-lg cursor-pointer border-b border-gray-700"
                    >
                      <div className="font-medium">{t('newMessage')}</div>
                      <div className="text-sm text-gray-400">{isRTL ? 'منذ دقيقتين' : '2 minutes ago'}</div>
                    </button>
                    <button 
                      onClick={() => handleNotificationAction({ type: 'bot', title: t('botUpdate') })}
                      className="w-full text-left py-2 px-2 text-gray-200 hover:bg-gray-700 rounded-lg cursor-pointer border-b border-gray-700"
                    >
                      <div className="font-medium">{t('botUpdate')}</div>
                      <div className="text-sm text-gray-400">{isRTL ? 'منذ 5 دقائق' : '5 minutes ago'}</div>
                    </button>
                    <button 
                      onClick={() => handleNotificationAction({ type: 'integration', title: t('integrationConnected') })}
                      className="w-full text-left py-2 px-2 text-gray-200 hover:bg-gray-700 rounded-lg cursor-pointer"
                    >
                      <div className="font-medium">{t('integrationConnected')}</div>
                      <div className="text-sm text-gray-400">{isRTL ? 'منذ 10 دقائق' : '10 minutes ago'}</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 rounded-xl px-3 py-2 transition-colors"
              >
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{profile.name.charAt(0)}</span>
                </div>
                <span className="text-white font-medium hidden md:block">{profile.name}</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-300" />
              </button>
              {dropdownOpen && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-12 bg-gray-800 shadow-xl rounded-xl py-2 min-w-[200px] border border-gray-700 z-50`}>
                  <button 
                    onClick={() => handleUserMenuAction('profile')}
                    className="w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    {t('profile')}
                  </button>
                  <button 
                    onClick={() => handleUserMenuAction('settings')}
                    className="w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    {t('settings')}
                  </button>
                  <button 
                    onClick={() => handleUserMenuAction('stats')}
                    className="w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    {t('stats')}
                  </button>
                  <div className="border-t border-gray-700 my-1" />
                  <button 
                    onClick={() => handleUserMenuAction('logout')}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors"
                  >
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 