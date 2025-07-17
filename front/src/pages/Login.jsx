import { useState } from 'react'
import { EyeIcon, EyeSlashIcon, SparklesIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { authAPI } from '../utils/api'
import { Link } from 'react-router-dom'
// Remove: import { useTranslation } from 'react-i18next'

const googleSvg = (
  <svg className="h-5 w-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.39 30.77 0 24 0 14.82 0 6.71 5.1 2.69 12.44l7.98 6.2C12.13 13.09 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.02l7.18 5.59C43.98 37.13 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.65c-1.01-2.99-1.01-6.21 0-9.2l-7.98-6.2C.7 17.1 0 20.46 0 24c0 3.54.7 6.9 1.97 10.1l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.14 15.9-5.82l-7.18-5.59c-2.01 1.35-4.6 2.15-8.72 2.15-6.38 0-11.87-3.59-14.33-8.74l-7.98 6.2C6.71 42.9 14.82 48 24 48z"/></g></svg>
)
const microsoftSvg = (
  <svg className="h-5 w-5" viewBox="0 0 24 24"><g><rect fill="#F35325" x="1" y="1" width="10" height="10"/><rect fill="#81BC06" x="13" y="1" width="10" height="10"/><rect fill="#05A6F0" x="1" y="13" width="10" height="10"/><rect fill="#FFBA08" x="13" y="13" width="10" height="10"/></g></svg>
)
const githubSvg = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.652 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.38.202 2.399.1 2.652.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .267.18.577.688.48C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
)

// Simple chatbot SVG illustration
const ChatbotSVG = () => (
  <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-72 h-72 mx-auto md:mx-0">
    <ellipse cx="160" cy="270" rx="120" ry="30" fill="#8B5CF6" fillOpacity="0.10" />
    <rect x="60" y="60" width="200" height="140" rx="40" fill="#fff" />
    <ellipse cx="110" cy="130" rx="16" ry="16" fill="#8B5CF6" />
    <ellipse cx="210" cy="130" rx="16" ry="16" fill="#8B5CF6" />
    <rect x="120" y="170" width="80" height="16" rx="8" fill="#E5E7EB" />
    <rect x="140" y="200" width="40" height="10" rx="5" fill="#E5E7EB" />
    <rect x="150" y="40" width="20" height="30" rx="10" fill="#8B5CF6" />
    <rect x="90" y="220" width="140" height="20" rx="10" fill="#8B5CF6" fillOpacity="0.15" />
  </svg>
)

function getPasswordStrength(password) {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })
  const [toast, setToast] = useState('')
  const [modal, setModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [socialToast, setSocialToast] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showRememberTooltip, setShowRememberTooltip] = useState(false)
  const navigate = useNavigate()
  // Fix destructuring: get t as well
  const { t, language, changeLanguage } = useLanguage()
  // Remove: const { t } = useTranslation()

  // Validation
  const validate = () => {
    const errs = {}
    if (!formData.email) errs.email = t('emailRequired')
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) errs.email = t('invalidEmail')
    if (!formData.password) errs.password = t('passwordRequired')
    else if (formData.password.length < 6) errs.password = t('passwordMinLength')
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setLoading(true)
    try {
      const data = await authAPI.login({
          email: formData.email,
          password: formData.password
      })
      setLoading(false)
      
      // ✅ SECURE: Store only user info (no token in localStorage)
      localStorage.setItem('user', JSON.stringify(data.user))
      console.log('✅ Login successful, user data:', data.user)
      setToast(t('loginSuccess'))
      setTimeout(() => setToast(''), 2000)
      setFormData({ email: '', password: '', remember: false })
      console.log('🔄 Redirecting to dashboard...')
      
      // Force redirect with a small delay to ensure state updates
      setTimeout(() => {
        console.log('🚀 Executing navigation...')
        if (data.user && data.user.role === 'admin') {
          navigate('/admin-dashboard', { replace: true })
        } else {
          navigate('/dashboard', { replace: true })
        }
      }, 100)
    } catch (err) {
      setLoading(false)
      setToast(err.message || t('loginFailed'))
      setTimeout(() => setToast(''), 2000)
    }
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    setModal(true)
    setResetEmail('')
    setResetSent(false)
  }

  const handleResetSubmit = (e) => {
    e.preventDefault()
    setResetSent(true)
    setTimeout(() => setModal(false), 2000)
  }

  const handleSocialLogin = (provider) => {
    setSocialToast(`${provider} ${t('loginComingSoon')}`);
    setTimeout(() => setSocialToast(''), 2000)
  }

  const handleDemoLogin = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setToast(t('demoLoginSuccess'))
      setTimeout(() => setToast(''), 2000)
      setFormData({ email: '', password: '', remember: false })
    }, 1000)
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const passwordStrengthText = [t('passwordTooWeak'), t('passwordWeak'), t('passwordMedium'), t('passwordStrong'), t('passwordVeryStrong')][passwordStrength]
  const passwordStrengthColor = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500', 'bg-green-600'][passwordStrength]

  // Language Switcher component
  const LanguageSwitcher = () => (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded-lg font-semibold transition border border-gray-600 bg-gray-800 text-white hover:bg-purple-600 ${language === 'en' ? 'bg-purple-600 border-purple-700' : ''}`}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage('ar')}
        className={`px-3 py-1 rounded-lg font-semibold transition border border-gray-600 bg-gray-800 text-white hover:bg-purple-600 ${language === 'ar' ? 'bg-purple-600 border-purple-700' : ''}`}
      >
        العربية
      </button>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900">
      <LanguageSwitcher />
      {/* Left: Illustration and branding */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-purple-700 via-indigo-700 to-gray-900 p-12 relative">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <span className="bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 p-3 rounded-2xl shadow-lg">
            <SparklesIcon className="h-8 w-8 text-white drop-shadow" />
          </span>
          <span className="text-2xl font-extrabold text-white tracking-tight">{t('chatbotPlatform')}</span>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
          <ChatbotSVG />
          <h2 className="text-3xl font-bold text-white mt-8 mb-2 text-center">{t('welcomeChatbotPlatform')}</h2>
          <p className="text-lg text-indigo-100 text-center max-w-xs">{t('aiPoweredChatbots')}</p>
        </div>
      </div>
      {/* Right: Login card */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-gray-900">
        <div className="max-w-md w-full space-y-8 relative z-10 animate-fadein">
          <div className="md:hidden flex flex-col items-center gap-2 mb-2">
            <span className="bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 p-3 rounded-2xl shadow-lg">
              <SparklesIcon className="h-8 w-8 text-white drop-shadow" />
            </span>
            <span className="text-2xl font-extrabold text-white tracking-tight">{t('chatbotPlatform')}</span>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">{t('signInAccount')}</h2>
            <p className="mt-2 text-gray-400">{t('enterCredentials')}</p>
          </div>
          {toast && (
            <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{toast}</div>
          )}
          {socialToast && (
            <div className="fixed top-20 right-6 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{socialToast}</div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} aria-label="Login form">
            <div className="bg-gray-800/90 rounded-2xl shadow-2xl p-10 border border-gray-700">
              <div className="flex flex-col gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="w-full py-3 px-4 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2 border border-gray-300 shadow"
                  aria-label="Sign in with Google"
                >
                  {googleSvg} {t('signInGoogle')}
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Microsoft')}
                  className="w-full py-3 px-4 bg-[#f3f3f3] text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2 border border-gray-300 shadow"
                  aria-label="Sign in with Microsoft"
                >
                  {microsoftSvg} {t('signInMicrosoft')}
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('GitHub')}
                  className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2 border border-gray-700 shadow"
                  aria-label="Sign in with GitHub"
                >
                  {githubSvg} {t('signInGitHub')}
                </button>
              </div>
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-700" />
                <span className="mx-4 text-gray-400 text-sm">{t('or')}</span>
                <div className="flex-grow border-t border-gray-700" />
              </div>
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">{t('emailAddress')}</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoFocus
                    aria-label="Email address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full px-4 py-3 bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400`}
                    placeholder={t('enterEmail')}
                  />
                  {errors.email && <div className="text-red-400 text-xs mt-1" role="alert">{errors.email}</div>}
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">{t('password')}</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      aria-label="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className={`w-full px-4 py-3 bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 pr-12`}
                      placeholder={t('enterPassword')}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                      title={showPassword ? t('hidePassword') : t('showPassword')}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && <div className="text-red-400 text-xs mt-1" role="alert">{errors.password}</div>}
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center relative group">
                    <input
                      type="checkbox"
                      checked={formData.remember}
                      onChange={(e) => setFormData({...formData, remember: e.target.checked})}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-700"
                      aria-label="Remember me"
                      onMouseEnter={() => setShowRememberTooltip(true)}
                      onMouseLeave={() => setShowRememberTooltip(false)}
                      onFocus={() => setShowRememberTooltip(true)}
                      onBlur={() => setShowRememberTooltip(false)}
                    />
                    <span className="ml-2 text-sm text-gray-300">{t('rememberMe')}</span>
                    {showRememberTooltip && (
                      <span className="absolute left-0 top-8 bg-gray-800 text-gray-200 text-xs rounded px-2 py-1 shadow border border-gray-700 z-20 flex items-center gap-1 animate-fadein" role="tooltip">
                        <InformationCircleIcon className="h-4 w-4 text-purple-400" />
                        {t('keepSignedIn')}
                      </span>
                    )}
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-purple-400 hover:text-purple-300 underline"
                  >
                    {t('forgotPassword')}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition text-lg shadow-lg flex items-center justify-center gap-2"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  ) : null}
                  {loading ? t('loggingIn') : t('login')}
                </button>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-3 px-4 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition flex items-center justify-center gap-2 mt-2"
                  aria-label="Sign in as demo user"
                  disabled={loading}
                >
                  <span className="text-lg">✨</span> {t('signInDemoUser')}
                </button>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-gray-400">
                {t('noAccount')} <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-medium">{t('signup')}</Link>
              </p>
            </div>
          </form>
        </div>
        {/* Modal for Forgot Password */}
        {modal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
              <button
                onClick={() => setModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-white mb-4">{t('resetPassword')}</h2>
              {!resetSent ? (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-300 mb-2">{t('emailAddress')}</label>
                    <input
                      id="resetEmail"
                      type="email"
                      required
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                      placeholder={t('enterEmail')}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    {t('sendResetLink')}
                  </button>
                </form>
              ) : (
                <div className="text-green-400 text-center font-semibold">{t('resetLinkSent')}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Fade-in animation
// Add this to your global CSS (e.g., index.css):
// .animate-fadein { animation: fadein 0.7s cubic-bezier(0.4,0,0.2,1) both; }
// @keyframes fadein { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: none; } } 