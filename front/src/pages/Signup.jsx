import { useState } from 'react'
import { EyeIcon, EyeSlashIcon, SparklesIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

const googleSvg = (
  <svg className="h-5 w-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.39 30.77 0 24 0 14.82 0 6.71 5.1 2.69 12.44l7.98 6.2C12.13 13.09 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.02l7.18 5.59C43.98 37.13 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.65c-1.01-2.99-1.01-6.21 0-9.2l-7.98-6.2C.7 17.1 0 20.46 0 24c0 3.54.7 6.9 1.97 10.1l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.14 15.9-5.82l-7.18-5.59c-2.01 1.35-4.6 2.15-8.72 2.15-6.38 0-11.87-3.59-14.33-8.74l-7.98 6.2C6.71 42.9 14.82 48 24 48z"/></g></svg>
)
const microsoftSvg = (
  <svg className="h-5 w-5" viewBox="0 0 24 24"><g><rect fill="#F35325" x="1" y="1" width="10" height="10"/><rect fill="#81BC06" x="13" y="1" width="10" height="10"/><rect fill="#05A6F0" x="1" y="13" width="10" height="10"/><rect fill="#FFBA08" x="13" y="13" width="10" height="10"/></g></svg>
)
const githubSvg = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.652 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.38.202 2.399.1 2.652.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .267.18.577.688.48C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
)

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

export default function Signup({ onSignupSuccess }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [toast, setToast] = useState('')
  const [modal, setModal] = useState({ open: false, type: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showTermsTooltip, setShowTermsTooltip] = useState(false)
  const [socialToast, setSocialToast] = useState('')
  const navigate = useNavigate()

  function validate() {
    const errs = {}
    if (!formData.firstName) errs.firstName = 'First name is required.'
    if (!formData.lastName) errs.lastName = 'Last name is required.'
    if (!formData.email) errs.email = 'Email is required.'
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) errs.email = 'Invalid email address.'
    if (!formData.password) errs.password = 'Password is required.'
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters.'
    if (!formData.confirmPassword) errs.confirmPassword = 'Please confirm your password.'
    else if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match.'
    if (!formData.agreeToTerms) errs.agreeToTerms = 'You must agree to the terms.'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setLoading(true)
    fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        password: formData.password
      })
    })
      .then(async (res) => {
        const data = await res.json()
        setLoading(false)
        if (!res.ok) {
          setToast(data.error || 'Signup failed')
          setTimeout(() => setToast(''), 2000)
          return
        }
        
        // Store token and trigger setup flow
        localStorage.setItem('token', data.token)
        setToast('Account created! Setting up your chatbot...')
        
        // Call the success callback to trigger setup
        if (onSignupSuccess) {
          onSignupSuccess()
        }
        
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          agreeToTerms: false
        })
      })
      .catch(() => {
        setLoading(false)
        setToast('Server error')
        setTimeout(() => setToast(''), 2000)
      })
  }

  function handleSocialSignup(provider) {
    setSocialToast(`${provider} signup coming soon!`)
    setTimeout(() => setSocialToast(''), 2000)
  }

  function handleDemoSignup() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setToast('Signed up as demo user!')
      setTimeout(() => setToast(''), 2000)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
      })
    }, 1000)
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const passwordStrengthText = ['Too weak', 'Weak', 'Medium', 'Strong', 'Very strong'][passwordStrength]
  const passwordStrengthColor = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500', 'bg-green-600'][passwordStrength]

  function openModal(type) { setModal({ open: true, type }) }
  function closeModal() { setModal({ open: false, type: '' }) }
  function getModalContent() {
    switch (modal.type) {
      case 'terms':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Terms of Service</h2>
            <p className="text-gray-300">Please read our terms of service. (This is a placeholder for the terms of service.)</p>
          </div>
        )
      case 'privacy':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Privacy Policy</h2>
            <p className="text-gray-300">Your privacy is important to us. (This is a placeholder for the privacy policy.)</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900">
      {/* Left: Illustration and branding */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-purple-700 via-indigo-700 to-gray-900 p-12 relative">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <span className="bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 p-3 rounded-2xl shadow-lg">
            <SparklesIcon className="h-8 w-8 text-white drop-shadow" />
          </span>
          <span className="text-2xl font-extrabold text-white tracking-tight">ChatBot Platform</span>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
          <ChatbotSVG />
          <h2 className="text-3xl font-bold text-white mt-8 mb-2 text-center">Join ChatBot Platform</h2>
          <p className="text-lg text-indigo-100 text-center max-w-xs">AI-powered chatbots for modern business. Automate, engage, and grow with ease.</p>
        </div>
      </div>
      {/* Right: Signup card */}
      <div className="flex-1 flex items-center justify-center py-8 px-2 sm:px-4 lg:px-8 relative bg-gray-900">
        <div className="max-w-md w-full space-y-8 relative z-10 animate-fadein">
          <div className="md:hidden flex flex-col items-center gap-2 mb-2">
            <span className="bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 p-3 rounded-2xl shadow-lg">
              <SparklesIcon className="h-8 w-8 text-white drop-shadow" />
            </span>
            <span className="text-2xl font-extrabold text-white tracking-tight">ChatBot Platform</span>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Create your account</h2>
            <p className="mt-2 text-gray-400">Sign up to start building amazing chatbots</p>
          </div>
          {toast && (
            <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{toast}</div>
          )}
          {socialToast && (
            <div className="fixed top-20 right-6 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{socialToast}</div>
          )}
          <form className="mt-4 space-y-4" onSubmit={handleSubmit} aria-label="Signup form">
            <div className="bg-gray-800/90 rounded-2xl shadow-2xl p-6 border border-gray-700 max-h-[85vh] overflow-y-auto flex flex-col justify-between">
              {/* Social signup options */}
              <div className="flex flex-col gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => handleSocialSignup('Google')}
                  className="w-full py-2 px-4 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2 border border-gray-300 shadow"
                  aria-label="Sign up with Google"
                >
                  {googleSvg} Sign up with Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialSignup('Microsoft')}
                  className="w-full py-2 px-4 bg-[#f3f3f3] text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2 border border-gray-300 shadow"
                  aria-label="Sign up with Microsoft"
                >
                  {microsoftSvg} Sign up with Microsoft
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialSignup('GitHub')}
                  className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2 border border-gray-700 shadow"
                  aria-label="Sign up with GitHub"
                >
                  {githubSvg} Sign up with GitHub
                </button>
              </div>
              <div className="flex items-center my-2">
                <div className="flex-grow border-t border-gray-700" />
                <span className="mx-2 text-gray-400 text-xs">or</span>
                <div className="flex-grow border-t border-gray-700" />
              </div>
              {/* Main form fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-medium text-gray-300 mb-1">First Name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      className={`w-full px-3 py-2 bg-gray-700 border ${errors.firstName ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 text-sm`}
                      placeholder="John"
                    />
                    {errors.firstName && <div className="text-red-400 text-xs mt-1" role="alert">{errors.firstName}</div>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-medium text-gray-300 mb-1">Last Name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      className={`w-full px-3 py-2 bg-gray-700 border ${errors.lastName ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 text-sm`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <div className="text-red-400 text-xs mt-1" role="alert">{errors.lastName}</div>}
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3 py-2 bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 text-sm`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <div className="text-red-400 text-xs mt-1" role="alert">{errors.email}</div>}
                </div>
                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full px-3 py-2 bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 pr-10 text-sm`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-1 flex items-center gap-2">
                      <div className={`h-2 rounded transition-all duration-300 ${passwordStrengthColor}`} style={{ width: `${(passwordStrength + 1) * 20}%`, minWidth: 32 }} />
                      <span className="text-xs text-gray-400">{passwordStrengthText}</span>
                    </div>
                  )}
                  {errors.password && <div className="text-red-400 text-xs mt-1" role="alert">{errors.password}</div>}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full px-3 py-2 bg-gray-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 pr-10 text-sm`}
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <div className="text-red-400 text-xs mt-1" role="alert">{errors.confirmPassword}</div>}
                </div>
                <div className="flex items-start relative group">
                  <input
                    id="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={e => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-700 mt-1"
                    aria-label="Agree to terms"
                    onMouseEnter={() => setShowTermsTooltip(true)}
                    onMouseLeave={() => setShowTermsTooltip(false)}
                    onFocus={() => setShowTermsTooltip(true)}
                    onBlur={() => setShowTermsTooltip(false)}
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 text-xs text-gray-300">
                    I agree to the{' '}
                    <button type="button" onClick={() => openModal('terms')} className="text-purple-400 hover:text-purple-300 underline">
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button type="button" onClick={() => openModal('privacy')} className="text-purple-400 hover:text-purple-300 underline">
                      Privacy Policy
                    </button>
                  </label>
                  {showTermsTooltip && (
                    <span className="absolute left-0 top-8 bg-gray-800 text-gray-200 text-xs rounded px-2 py-1 shadow border border-gray-700 z-20 flex items-center gap-1 animate-fadein" role="tooltip">
                      <InformationCircleIcon className="h-4 w-4 text-purple-400" />
                      You must agree to continue
                    </span>
                  )}
                  {errors.agreeToTerms && <div className="text-red-400 text-xs mt-1 ml-2" role="alert">{errors.agreeToTerms}</div>}
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition text-base shadow-lg flex items-center justify-center gap-2"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  ) : null}
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
                <button
                  type="button"
                  onClick={handleDemoSignup}
                  className="w-full py-2 px-4 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition flex items-center justify-center gap-2 mt-1 text-base"
                  aria-label="Sign up as demo user"
                  disabled={loading}
                >
                  <span className="text-lg">✨</span> Sign up as demo user
                </button>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <a href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                  Log in
                </a>
              </p>
            </div>
          </form>
          {/* Modal for Terms and Privacy */}
          {modal.open && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
                >
                  &times;
                </button>
                {getModalContent()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 