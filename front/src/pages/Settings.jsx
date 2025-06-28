import { useState, useRef, useEffect } from 'react'
import { 
  UserIcon, 
  UsersIcon, 
  BellIcon, 
  PlusIcon, 
  CheckCircleIcon, 
  Cog6ToothIcon,
  ShieldCheckIcon,
  KeyIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ChatBubbleLeftRightIcon,
  PuzzlePieceIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import axios from 'axios'

const initialTeam = [
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', avatar: 'https://randomuser.me/api/portraits/women/65.jpg', status: 'Active' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Manager', avatar: 'https://randomuser.me/api/portraits/men/43.jpg', status: 'Active' },
  { name: 'Carol Davis', email: 'carol@example.com', role: 'Agent', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', status: 'Pending' },
]

const tabs = [
  { name: 'Profile', icon: UserIcon },
  { name: 'Team', icon: UsersIcon },
  { name: 'Bots', icon: ChatBubbleLeftRightIcon },
  { name: 'Integrations', icon: PuzzlePieceIcon },
  { name: 'Notifications', icon: BellIcon },
  { name: 'Security', icon: ShieldCheckIcon },
  { name: 'API', icon: KeyIcon },
  { name: 'Billing', icon: CurrencyDollarIcon },
]

export default function Settings({ logoUrl, setLogoUrl, profile, setProfile }) {
  const [active, setActive] = useState('Profile')
  const [profileErrors, setProfileErrors] = useState({})
  const [saved, setSaved] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [showToast, setShowToast] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [logo, setLogo] = useState(null)
  const fileInputRef = useRef()
  const [team, setTeam] = useState(initialTeam)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Agent' })
  const [inviteErrors, setInviteErrors] = useState({})
  const [inviteLoading, setInviteLoading] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'Agent', idx: null })
  const [editErrors, setEditErrors] = useState({})
  const [editLoading, setEditLoading] = useState(false)
  const [showRemove, setShowRemove] = useState(false)
  const [removeIdx, setRemoveIdx] = useState(null)
  // Bot settings state
  const [botConfig, setBotConfig] = useState({
    responseTime: 'Immediate',
    autoResponse: 'Enabled',
    languageDetection: 'Automatic',
    conversationHistory: '30 days',
  })
  const [botConfigLoading, setBotConfigLoading] = useState(false)
  const [showBotToast, setShowBotToast] = useState('')
  // AI Training modals
  const [showUpload, setShowUpload] = useState(false)
  const [uploadFiles, setUploadFiles] = useState([])
  const [uploadLoading, setUploadLoading] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const [exampleForm, setExampleForm] = useState({ user: '', bot: '' })
  const [exampleErrors, setExampleErrors] = useState({})
  const [examples, setExamples] = useState([])
  const [exampleLoading, setExampleLoading] = useState(false)
  // Security state
  const [pwLoading, setPwLoading] = useState(false)
  const [pwToast, setPwToast] = useState('')
  const [pwErrors, setPwErrors] = useState({})
  // 2FA state
  const [showSms2fa, setShowSms2fa] = useState(false)
  const [smsNumber, setSmsNumber] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [smsStep, setSmsStep] = useState(1)
  const [smsLoading, setSmsLoading] = useState(false)
  const [smsToast, setSmsToast] = useState('')
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [showAuth2fa, setShowAuth2fa] = useState(false)
  const [authCode, setAuthCode] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authToast, setAuthToast] = useState('')
  const [authEnabled, setAuthEnabled] = useState(false)
  // Sessions
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome on Windows', location: 'New York, NY', time: 'Active now' },
    { id: 2, device: 'Safari on iPhone', location: 'Los Angeles, CA', time: '2 hours ago' },
  ])
  const [showTerminate, setShowTerminate] = useState(false)
  const [terminateIdx, setTerminateIdx] = useState(null)
  const [terminateLoading, setTerminateLoading] = useState(false)
  const [terminateToast, setTerminateToast] = useState('')
  // API state
  const [apiKeys, setApiKeys] = useState({
    production: 'sk_live_...abc123',
    test: 'sk_test_...xyz789',
  })
  const [apiToast, setApiToast] = useState('')
  const [regenModal, setRegenModal] = useState({ open: false, type: '' })
  const [regenLoading, setRegenLoading] = useState(false)
  // Billing state
  const [billing, setBilling] = useState({
    plan: 'Pro',
    price: 49,
    renewal: '2024-08-01',
    features: ['Unlimited bots', '10,000 conversations/mo', 'Priority support'],
    paymentMethods: [
      { id: 1, brand: 'Visa', last4: '4242', exp: '12/26', primary: true },
      { id: 2, brand: 'Mastercard', last4: '4444', exp: '09/25', primary: false },
    ],
    invoices: [
      { id: 1, date: '2024-06-01', amount: 49, status: 'Paid' },
      { id: 2, date: '2024-05-01', amount: 49, status: 'Paid' },
    ],
  })
  const [billingToast, setBillingToast] = useState('')
  const [billingLoading, setBillingLoading] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showAddCard, setShowAddCard] = useState(false)
  const [cardForm, setCardForm] = useState({ brand: '', number: '', exp: '', cvc: '' })
  const [cardErrors, setCardErrors] = useState({})
  const [cardLoading, setCardLoading] = useState(false)
  const [removeCardId, setRemoveCardId] = useState(null)
  const [profileData, setProfileData] = useState(null)

  // Fetch profile on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    setProfileLoading(true)
    axios.get('/api/businesses/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => setProfileData(res.data))
      .catch(() => setProfileData(null))
      .finally(() => setProfileLoading(false))
  }, [])

  function validateProfile() {
    const errs = {}
    if (!profileData?.name) errs.name = 'Business name is required.'
    if (!profileData?.email) errs.email = 'Email is required.'
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(profileData.email)) errs.email = 'Invalid email.'
    return errs
  }

  function handleProfileChange(e) {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  function handleSave(e) {
    e.preventDefault()
    const errs = validateProfile()
    setProfileErrors(errs)
    if (Object.keys(errs).length > 0) return
    setProfileLoading(true)
    const token = localStorage.getItem('token')
    axios.put('/api/businesses/me', profileData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(() => {
        setSaved(true)
        setShowToast('Profile updated!')
        setTimeout(() => setSaved(false), 2000)
        setTimeout(() => setShowToast(''), 2000)
      })
      .catch(() => setShowToast('Failed to update profile'))
      .finally(() => setProfileLoading(false))
  }

  function handleChooseFile() {
    fileInputRef.current?.click()
  }

  function handleLogoChange(e) {
    const file = e.target.files[0]
    if (file) {
      setLogo(file)
      setLogoUrl(URL.createObjectURL(file))
      setShowToast('Logo uploaded!')
      setTimeout(() => setShowToast(''), 2000)
    }
  }

  function validateInvite(form) {
    const errs = {}
    if (!form.name) errs.name = 'Name is required.'
    if (!form.email) errs.email = 'Email is required.'
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email.'
    return errs
  }

  function handleInviteSubmit(e) {
    e.preventDefault()
    const errs = validateInvite(inviteForm)
    setInviteErrors(errs)
    if (Object.keys(errs).length > 0) return
    setInviteLoading(true)
    setTimeout(() => {
      setInviteLoading(false)
      setShowInvite(false)
      setTeam(prev => [
        ...prev,
        {
          ...inviteForm,
          avatar: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random()*10)}.jpg`,
          status: 'Pending',
        },
      ])
      setInviteForm({ name: '', email: '', role: 'Agent' })
      setShowToast('Invitation sent!')
      setTimeout(() => setShowToast(''), 2000)
    }, 1200)
  }

  function handleEditClick(idx) {
    setEditForm({ ...team[idx], idx })
    setShowEdit(true)
    setEditErrors({})
  }

  function handleEditSubmit(e) {
    e.preventDefault()
    const errs = validateInvite(editForm)
    setEditErrors(errs)
    if (Object.keys(errs).length > 0) return
    setEditLoading(true)
    setTimeout(() => {
      setEditLoading(false)
      setShowEdit(false)
      setTeam(prev => prev.map((m, i) => i === editForm.idx ? { ...m, ...editForm } : m))
      setShowToast('Member updated!')
      setTimeout(() => setShowToast(''), 2000)
    }, 1200)
  }

  function handleRemoveClick(idx) {
    setRemoveIdx(idx)
    setShowRemove(true)
  }

  function handleRemoveConfirm() {
    setShowRemove(false)
    setTeam(prev => prev.filter((_, i) => i !== removeIdx))
    setShowToast('Member removed!')
    setTimeout(() => setShowToast(''), 2000)
  }

  function handleBotConfigChange(e) {
    setBotConfig({ ...botConfig, [e.target.name]: e.target.value })
  }
  function handleBotConfigSave() {
    setBotConfigLoading(true)
    setTimeout(() => {
      setBotConfigLoading(false)
      setShowBotToast('Bot settings saved!')
      setTimeout(() => setShowBotToast(''), 2000)
    }, 1200)
  }
  function handleUploadFiles(e) {
    setUploadFiles(Array.from(e.target.files))
  }
  function handleUploadSubmit(e) {
    e.preventDefault()
    setUploadLoading(true)
    setTimeout(() => {
      setUploadLoading(false)
      setShowUpload(false)
      setShowBotToast('Files uploaded!')
      setTimeout(() => setShowBotToast(''), 2000)
      setUploadFiles([])
    }, 1200)
  }
  function handleExampleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!exampleForm.user) errs.user = 'User message required.'
    if (!exampleForm.bot) errs.bot = 'Bot reply required.'
    setExampleErrors(errs)
    if (Object.keys(errs).length > 0) return
    setExampleLoading(true)
    setTimeout(() => {
      setExampleLoading(false)
      setShowExamples(false)
      setExamples(prev => [...prev, { ...exampleForm }])
      setShowBotToast('Example added!')
      setTimeout(() => setShowBotToast(''), 2000)
      setExampleForm({ user: '', bot: '' })
    }, 1200)
  }

  function validatePassword() {
    const errs = {}
    if (!password) errs.password = 'Current password required.'
    if (!newPassword) errs.newPassword = 'New password required.'
    else if (newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters.'
    if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match.'
    return errs
  }
  function handlePasswordChange(e) {
    e.preventDefault()
    const errs = validatePassword()
    setPwErrors(errs)
    if (Object.keys(errs).length > 0) return
    setPwLoading(true)
    setTimeout(() => {
      setPwLoading(false)
      setPwToast('Password updated!')
      setTimeout(() => setPwToast(''), 2000)
      setPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }, 1200)
  }
  // SMS 2FA
  function handleSms2faStart() {
    setShowSms2fa(true)
    setSmsStep(1)
    setSmsNumber('')
    setSmsCode('')
  }
  function handleSms2faSubmit(e) {
    e.preventDefault()
    setSmsLoading(true)
    setTimeout(() => {
      if (smsStep === 1) {
        setSmsStep(2)
        setSmsLoading(false)
      } else {
        setSmsLoading(false)
        setShowSms2fa(false)
        setSmsEnabled(true)
        setSmsToast('SMS 2FA enabled!')
        setTimeout(() => setSmsToast(''), 2000)
      }
    }, 1200)
  }
  // Authenticator 2FA
  function handleAuth2faStart() {
    setShowAuth2fa(true)
    setAuthCode('')
  }
  function handleAuth2faSubmit(e) {
    e.preventDefault()
    setAuthLoading(true)
    setTimeout(() => {
      setAuthLoading(false)
      setShowAuth2fa(false)
      setAuthEnabled(true)
      setAuthToast('Authenticator 2FA enabled!')
      setTimeout(() => setAuthToast(''), 2000)
    }, 1200)
  }
  // Terminate session
  function handleTerminate(idx) {
    setTerminateIdx(idx)
    setShowTerminate(true)
  }
  function handleTerminateConfirm() {
    setTerminateLoading(true)
    setTimeout(() => {
      setSessions(prev => prev.filter((_, i) => i !== terminateIdx))
      setShowTerminate(false)
      setTerminateLoading(false)
      setTerminateToast('Session terminated!')
      setTimeout(() => setTerminateToast(''), 2000)
    }, 1000)
  }

  function handleCopyKey(type) {
    navigator.clipboard.writeText(apiKeys[type])
    setApiToast(`${type === 'production' ? 'Production' : 'Test'} API key copied!`)
    setTimeout(() => setApiToast(''), 2000)
  }
  function handleRegenClick(type) {
    setRegenModal({ open: true, type })
  }
  function handleRegenConfirm() {
    setRegenLoading(true)
    setTimeout(() => {
      setApiKeys(prev => ({
        ...prev,
        [regenModal.type]: `${regenModal.type === 'production' ? 'sk_live_' : 'sk_test_'}...${Math.random().toString(36).slice(-6)}`,
      }))
      setRegenLoading(false)
      setRegenModal({ open: false, type: '' })
      setApiToast(`${regenModal.type === 'production' ? 'Production' : 'Test'} API key regenerated!`)
      setTimeout(() => setApiToast(''), 2000)
    }, 1200)
  }

  function handleUpgradeDowngrade() {
    setShowPlanModal(true)
  }
  function handlePlanChange(newPlan) {
    setBillingLoading(true)
    setTimeout(() => {
      setBilling(b => ({ ...b, plan: newPlan, price: newPlan === 'Pro' ? 49 : 19, features: newPlan === 'Pro' ? ['Unlimited bots', '10,000 conversations/mo', 'Priority support'] : ['3 bots', '1,000 conversations/mo', 'Standard support'] }))
      setBillingLoading(false)
      setShowPlanModal(false)
      setBillingToast(`Plan changed to ${newPlan}!`)
      setTimeout(() => setBillingToast(''), 2000)
    }, 1200)
  }
  function handleCancelSub() {
    setBillingLoading(true)
    setTimeout(() => {
      setBillingLoading(false)
      setShowCancelModal(false)
      setBillingToast('Subscription cancelled.')
      setTimeout(() => setBillingToast(''), 2000)
    }, 1200)
  }
  function handleAddCard(e) {
    e.preventDefault()
    const errs = {}
    if (!cardForm.brand) errs.brand = 'Brand required.'
    if (!/^\d{16}$/.test(cardForm.number)) errs.number = '16-digit card number.'
    if (!/^\d{2}\/\d{2}$/.test(cardForm.exp)) errs.exp = 'MM/YY.'
    if (!/^\d{3,4}$/.test(cardForm.cvc)) errs.cvc = '3-4 digit CVC.'
    setCardErrors(errs)
    if (Object.keys(errs).length > 0) return
    setCardLoading(true)
    setTimeout(() => {
      setBilling(b => ({ ...b, paymentMethods: [...b.paymentMethods, { id: Date.now(), brand: cardForm.brand, last4: cardForm.number.slice(-4), exp: cardForm.exp, primary: false }] }))
      setCardForm({ brand: '', number: '', exp: '', cvc: '' })
      setCardLoading(false)
      setShowAddCard(false)
      setBillingToast('Card added!')
      setTimeout(() => setBillingToast(''), 2000)
    }, 1200)
  }
  function handleRemoveCard(id) {
    setRemoveCardId(id)
    setCardLoading(true)
    setTimeout(() => {
      setBilling(b => ({ ...b, paymentMethods: b.paymentMethods.filter(c => c.id !== id) }))
      setRemoveCardId(null)
      setCardLoading(false)
      setBillingToast('Card removed!')
      setTimeout(() => setBillingToast(''), 2000)
    }, 1000)
  }
  function handleDownloadInvoice(id) {
    setBillingToast('Invoice downloaded!')
    setTimeout(() => setBillingToast(''), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto animate-fadein">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
      {showToast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{showToast}</div>
      )}
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(tab => (
          <button 
            key={tab.name} 
            onClick={() => setActive(tab.name)} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              active === tab.name 
                ? 'bg-purple-600 text-white shadow' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
            }`}
            aria-label={`Go to ${tab.name} settings`}
          >
            <tab.icon className="h-5 w-5" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Profile Settings */}
      {active === 'Profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleSave} className="bg-gray-800 rounded-xl shadow p-6 space-y-4 border border-gray-700" aria-label="Business profile form">
            <div className="font-bold text-lg mb-4 text-white">Business Profile</div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Business Name</label>
              <input 
                type="text" 
                value={profileData?.name} 
                onChange={e => handleProfileChange({ ...profileData, name: e.target.value })} 
                className={`w-full px-4 py-2 bg-gray-700 border ${profileErrors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`} 
                aria-label="Business name"
              />
              {profileErrors.name && <div className="text-red-400 text-xs mt-1" role="alert">{profileErrors.name}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input 
                type="email" 
                value={profileData?.email} 
                onChange={e => handleProfileChange({ ...profileData, email: e.target.value })} 
                className={`w-full px-4 py-2 bg-gray-700 border ${profileErrors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`} 
                aria-label="Email address"
              />
              {profileErrors.email && <div className="text-red-400 text-xs mt-1" role="alert">{profileErrors.email}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
              <input 
                type="tel" 
                value={profileData?.phone} 
                onChange={e => handleProfileChange({ ...profileData, phone: e.target.value })} 
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                aria-label="Phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Website</label>
              <input 
                type="url" 
                value={profileData?.website} 
                onChange={e => handleProfileChange({ ...profileData, website: e.target.value })} 
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                aria-label="Website"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Timezone</label>
                <select 
                  value={profileData?.timezone} 
                  onChange={e => handleProfileChange({ ...profileData, timezone: e.target.value })} 
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  aria-label="Timezone"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Language</label>
                <select 
                  value={profileData?.language} 
                  onChange={e => handleProfileChange({ ...profileData, language: e.target.value })} 
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  aria-label="Language"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Portuguese">Portuguese</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2" disabled={profileLoading} aria-busy={profileLoading}>
              {profileLoading && (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
              )}
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && <div className="flex items-center gap-2 text-green-400 mt-2"><CheckCircleIcon className="h-5 w-5" />Changes saved!</div>}
          </form>

          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">Business Logo</div>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt="Business logo preview" className="w-24 h-24 object-cover rounded-full" />
                ) : (
                  <UserIcon className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <p className="text-gray-400 mb-2">Upload your business logo</p>
              <button
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition border border-gray-600"
                onClick={handleChooseFile}
                type="button"
                aria-label="Choose logo file"
              >
                Choose File
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleLogoChange}
                className="hidden"
                aria-label="Upload logo"
              />
            </div>
          </div>
        </div>
      )}

      {/* Team Settings */}
      {active === 'Team' && (
        <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
          <div className="font-bold text-lg mb-4 flex items-center justify-between text-white">
            Team Members 
            <button
              className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              onClick={() => setShowInvite(true)}
              aria-label="Invite team member"
            >
              <PlusIcon className="h-4 w-4" />Invite Member
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">Member</th>
                  <th className="text-left py-3 px-4 text-gray-300">Role</th>
                  <th className="text-left py-3 px-4 text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.map((member, idx) => (
                  <tr key={member.email} className="border-b border-gray-700">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full" />
                        <div>
                          <div className="font-semibold text-white">{member.name}</div>
                          <div className="text-sm text-gray-400">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.role === 'Admin' ? 'bg-red-900/30 text-red-400' :
                        member.role === 'Manager' ? 'bg-purple-900/30 text-purple-400' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === 'Active' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          className="p-1 text-purple-400 hover:bg-gray-700 rounded"
                          onClick={() => handleEditClick(idx)}
                          aria-label={`Edit ${member.name}`}
                        >Edit</button>
                        <button
                          className="p-1 text-red-400 hover:bg-red-900/20 rounded"
                          onClick={() => handleRemoveClick(idx)}
                          aria-label={`Remove ${member.name}`}
                        >Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Invite Member Modal */}
          {showInvite && (
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadein">
              <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
                <button
                  onClick={() => setShowInvite(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
                  aria-label="Close invite modal"
                >&times;</button>
                <h2 className="text-xl font-bold text-white mb-6">Invite Team Member</h2>
                <form onSubmit={handleInviteSubmit} className="space-y-4" aria-label="Invite member form">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={inviteForm.name}
                      onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })}
                      className={`w-full px-4 py-2 bg-gray-700 border ${inviteErrors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                      placeholder="Full name"
                      aria-label="Name"
                    />
                    {inviteErrors.name && <div className="text-red-400 text-xs mt-1" role="alert">{inviteErrors.name}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={inviteForm.email}
                      onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })}
                      className={`w-full px-4 py-2 bg-gray-700 border ${inviteErrors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                      placeholder="you@email.com"
                      aria-label="Email"
                    />
                    {inviteErrors.email && <div className="text-red-400 text-xs mt-1" role="alert">{inviteErrors.email}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                    <select
                      value={inviteForm.role}
                      onChange={e => setInviteForm({ ...inviteForm, role: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      aria-label="Role"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Agent">Agent</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowInvite(false)}
                      className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                    >Cancel</button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                      disabled={inviteLoading}
                      aria-busy={inviteLoading}
                    >
                      {inviteLoading && (
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                      )}
                      {inviteLoading ? 'Inviting...' : 'Invite'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Edit Member Modal */}
          {showEdit && (
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadein">
              <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
                <button
                  onClick={() => setShowEdit(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
                  aria-label="Close edit modal"
                >&times;</button>
                <h2 className="text-xl font-bold text-white mb-6">Edit Team Member</h2>
                <form onSubmit={handleEditSubmit} className="space-y-4" aria-label="Edit member form">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className={`w-full px-4 py-2 bg-gray-700 border ${editErrors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                      placeholder="Full name"
                      aria-label="Name"
                    />
                    {editErrors.name && <div className="text-red-400 text-xs mt-1" role="alert">{editErrors.name}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      className={`w-full px-4 py-2 bg-gray-700 border ${editErrors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                      placeholder="you@email.com"
                      aria-label="Email"
                    />
                    {editErrors.email && <div className="text-red-400 text-xs mt-1" role="alert">{editErrors.email}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                    <select
                      value={editForm.role}
                      onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      aria-label="Role"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Agent">Agent</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEdit(false)}
                      className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                    >Cancel</button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                      disabled={editLoading}
                      aria-busy={editLoading}
                    >
                      {editLoading && (
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                      )}
                      {editLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Remove Member Modal */}
          {showRemove && (
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadein">
              <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
                <button
                  onClick={() => setShowRemove(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
                  aria-label="Close remove modal"
                >&times;</button>
                <h2 className="text-xl font-bold text-white mb-6">Remove Team Member</h2>
                <p className="text-gray-300 mb-6">Are you sure you want to remove <span className="font-semibold text-white">{team[removeIdx]?.name}</span> from the team?</p>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRemove(false)}
                    className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                  >Cancel</button>
                  <button
                    type="button"
                    onClick={handleRemoveConfirm}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >Remove</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bot Settings */}
      {active === 'Bots' && (
        <div className="space-y-6">
          {showBotToast && (
            <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{showBotToast}</div>
          )}
          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">Bot Configuration</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Default Response Time</label>
                <select
                  name="responseTime"
                  value={botConfig.responseTime}
                  onChange={handleBotConfigChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  aria-label="Default response time"
                >
                  <option>Immediate</option>
                  <option>5 seconds</option>
                  <option>10 seconds</option>
                  <option>30 seconds</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Auto-Response Mode</label>
                <select
                  name="autoResponse"
                  value={botConfig.autoResponse}
                  onChange={handleBotConfigChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  aria-label="Auto-response mode"
                >
                  <option>Enabled</option>
                  <option>Disabled</option>
                  <option>Business Hours Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Language Detection</label>
                <select
                  name="languageDetection"
                  value={botConfig.languageDetection}
                  onChange={handleBotConfigChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  aria-label="Language detection"
                >
                  <option>Automatic</option>
                  <option>Manual</option>
                  <option>Disabled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Conversation History</label>
                <select
                  name="conversationHistory"
                  value={botConfig.conversationHistory}
                  onChange={handleBotConfigChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  aria-label="Conversation history"
                >
                  <option>30 days</option>
                  <option>60 days</option>
                  <option>90 days</option>
                  <option>Unlimited</option>
                </select>
              </div>
            </div>
            <button
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2 justify-center"
              onClick={handleBotConfigSave}
              disabled={botConfigLoading}
              aria-busy={botConfigLoading}
            >
              {botConfigLoading && (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
              )}
              {botConfigLoading ? 'Saving...' : 'Save Bot Settings'}
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">AI Training</div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-white">Knowledge Base</div>
                  <div className="text-sm text-gray-400">Upload documents to train your bot</div>
                </div>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  onClick={() => setShowUpload(true)}
                  aria-label="Upload files"
                >
                  Upload Files
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-white">Conversation Examples</div>
                  <div className="text-sm text-gray-400">Add sample conversations for better responses</div>
                </div>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  onClick={() => setShowExamples(true)}
                  aria-label="Add examples"
                >
                  Add Examples
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Settings */}
      {active === 'Integrations' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">Connected Platforms</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-white">WhatsApp</div>
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">Connected</span>
                </div>
                <div className="text-sm text-gray-400 mb-3">Business API</div>
                <button className="text-red-400 hover:text-red-300 text-sm">Disconnect</button>
              </div>
              <div className="border border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-white">Facebook Messenger</div>
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">Connected</span>
                </div>
                <div className="text-sm text-gray-400 mb-3">Page: Example Corp</div>
                <button className="text-red-400 hover:text-red-300 text-sm">Disconnect</button>
              </div>
              <div className="border border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-white">Instagram</div>
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">Not Connected</span>
                </div>
                <div className="text-sm text-gray-400 mb-3">Direct Messages</div>
                <button className="text-purple-400 hover:text-purple-300 text-sm">Connect</button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">Webhook Configuration</div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Webhook URL</label>
                <input 
                  type="url" 
                  placeholder="https://your-domain.com/webhook" 
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Secret Key</label>
                <div className="flex gap-2">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 text-gray-300"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
                Save Webhook
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {active === 'Notifications' && (
        <div className="bg-gray-800 rounded-xl shadow p-6 max-w-2xl border border-gray-700">
          <div className="font-bold text-lg mb-6 text-white">Notification Preferences</div>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3 text-white">Email Notifications</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">New messages</span>
                  <input type="checkbox" className="accent-purple-600" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Bot status changes</span>
                  <input type="checkbox" className="accent-purple-600" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Weekly reports</span>
                  <input type="checkbox" className="accent-purple-600" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">System updates</span>
                  <input type="checkbox" className="accent-purple-600" defaultChecked />
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 text-white">Push Notifications</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Urgent messages</span>
                  <input type="checkbox" className="accent-purple-600" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Bot offline alerts</span>
                  <input type="checkbox" className="accent-purple-600" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">New integrations</span>
                  <input type="checkbox" className="accent-purple-600" />
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-white">SMS Notifications</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Critical system alerts</span>
                  <input type="checkbox" className="accent-purple-600" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">High volume alerts</span>
                  <input type="checkbox" className="accent-purple-600" />
                </label>
              </div>
            </div>

            <button className="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
              Save Notification Settings
            </button>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {active === 'Security' && (
        <div className="space-y-6 animate-fadein">
          {pwToast && (
            <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{pwToast}</div>
          )}
          {smsToast && (
            <div className="fixed top-20 right-6 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{smsToast}</div>
          )}
          {authToast && (
            <div className="fixed top-32 right-6 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{authToast}</div>
          )}
          {terminateToast && (
            <div className="fixed top-44 right-6 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{terminateToast}</div>
          )}
          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">Change Password</div>
            <form className="space-y-4" onSubmit={handlePasswordChange} aria-label="Change password form">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700 border ${pwErrors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                  aria-label="Current password"
                />
                {pwErrors.password && <div className="text-red-400 text-xs mt-1" role="alert">{pwErrors.password}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700 border ${pwErrors.newPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                  aria-label="New password"
                />
                {pwErrors.newPassword && <div className="text-red-400 text-xs mt-1" role="alert">{pwErrors.newPassword}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700 border ${pwErrors.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                  aria-label="Confirm new password"
                />
                {pwErrors.confirmPassword && <div className="text-red-400 text-xs mt-1" role="alert">{pwErrors.confirmPassword}</div>}
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                disabled={pwLoading}
                aria-busy={pwLoading}
              >
                {pwLoading && (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                )}
                {pwLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">Two-Factor Authentication</div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-white">SMS Authentication {smsEnabled && <span className='ml-2 px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full text-xs'>Enabled</span>}</div>
                  <div className="text-sm text-gray-400">Receive codes via SMS</div>
                </div>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  onClick={handleSms2faStart}
                  disabled={smsEnabled}
                >
                  {smsEnabled ? 'Enabled' : 'Enable'}
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-white">Authenticator App {authEnabled && <span className='ml-2 px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full text-xs'>Enabled</span>}</div>
                  <div className="text-sm text-gray-400">Use Google Authenticator or similar</div>
                </div>
                <button
                  className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 transition"
                  onClick={handleAuth2faStart}
                  disabled={authEnabled}
                >
                  {authEnabled ? 'Enabled' : 'Setup'}
                </button>
              </div>
              {/* SMS 2FA Modal */}
              {showSms2fa && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadein">
                  <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
                    <button
                      onClick={() => setShowSms2fa(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
                      aria-label="Close SMS 2FA modal"
                    >&times;</button>
                    <h2 className="text-xl font-bold text-white mb-6">Enable SMS Authentication</h2>
                    <form onSubmit={handleSms2faSubmit} className="space-y-4" aria-label="Enable SMS 2FA form">
                      {smsStep === 1 ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            value={smsNumber}
                            onChange={e => setSmsNumber(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                            placeholder="e.g. +1 555 123 4567"
                            aria-label="Phone number"
                            required
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Enter Code</label>
                          <input
                            type="text"
                            value={smsCode}
                            onChange={e => setSmsCode(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                            placeholder="Enter the code sent to your phone"
                            aria-label="SMS code"
                            required
                          />
                        </div>
                      )}
                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowSms2fa(false)}
                          className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                        >Cancel</button>
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                          disabled={smsLoading}
                          aria-busy={smsLoading}
                        >
                          {smsLoading && (
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                          )}
                          {smsLoading ? (smsStep === 1 ? 'Sending...' : 'Verifying...') : (smsStep === 1 ? 'Send Code' : 'Verify')}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {/* Authenticator 2FA Modal */}
              {showAuth2fa && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadein">
                  <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
                    <button
                      onClick={() => setShowAuth2fa(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
                      aria-label="Close Authenticator 2FA modal"
                    >&times;</button>
                    <h2 className="text-xl font-bold text-white mb-6">Setup Authenticator App</h2>
                    <div className="mb-4 flex flex-col items-center">
                      <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-gray-400">[QR Code]</span>
                      </div>
                      <div className="text-gray-400 text-sm text-center">Scan this QR code with your authenticator app, then enter the code below.</div>
                    </div>
                    <form onSubmit={handleAuth2faSubmit} className="space-y-4" aria-label="Setup Authenticator 2FA form">
                      <input
                        type="text"
                        value={authCode}
                        onChange={e => setAuthCode(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        placeholder="Enter code from app"
                        aria-label="Authenticator code"
                        required
                      />
                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowAuth2fa(false)}
                          className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                        >Cancel</button>
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                          disabled={authLoading}
                          aria-busy={authLoading}
                        >
                          {authLoading && (
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                          )}
                          {authLoading ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">Active Sessions</div>
            <div className="space-y-3">
              {sessions.map((session, idx) => (
                <div key={session.id} className="flex items-center justify-between p-3 border border-gray-600 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{session.device}</div>
                    <div className="text-sm text-gray-400">{session.location} • {session.time}</div>
                  </div>
                  <button
                    className="text-red-400 hover:text-red-300 text-sm"
                    onClick={() => handleTerminate(idx)}
                  >Terminate</button>
                </div>
              ))}
              {/* Terminate Session Modal */}
              {showTerminate && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadein">
                  <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
                    <button
                      onClick={() => setShowTerminate(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
                      aria-label="Close terminate session modal"
                    >&times;</button>
                    <h2 className="text-xl font-bold text-white mb-6">Terminate Session</h2>
                    <p className="text-gray-300 mb-6">Are you sure you want to terminate the session for <span className="font-semibold text-white">{sessions[terminateIdx]?.device}</span>?</p>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowTerminate(false)}
                        className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                      >Cancel</button>
                      <button
                        type="button"
                        onClick={handleTerminateConfirm}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                        disabled={terminateLoading}
                        aria-busy={terminateLoading}
                      >
                        {terminateLoading && (
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                        )}
                        {terminateLoading ? 'Terminating...' : 'Terminate'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* API Settings */}
      {active === 'API' && (
        <div className="space-y-6 animate-fadein">
          {apiToast && (
            <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{apiToast}</div>
          )}
          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">API Keys</div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-white">Production API Key</div>
                  <div className="text-sm text-gray-400">{apiKeys.production}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 text-purple-400 hover:bg-gray-600 rounded text-sm"
                    onClick={() => handleCopyKey('production')}
                    aria-label="Copy production API key"
                  >Copy</button>
                  <button
                    className="px-3 py-1 text-red-400 hover:bg-red-900/20 rounded text-sm"
                    onClick={() => handleRegenClick('production')}
                    aria-label="Regenerate production API key"
                  >Regenerate</button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-white">Test API Key</div>
                  <div className="text-sm text-gray-400">{apiKeys.test}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 text-purple-400 hover:bg-gray-600 rounded text-sm"
                    onClick={() => handleCopyKey('test')}
                    aria-label="Copy test API key"
                  >Copy</button>
                  <button
                    className="px-3 py-1 text-red-400 hover:bg-red-900/20 rounded text-sm"
                    onClick={() => handleRegenClick('test')}
                    aria-label="Regenerate test API key"
                  >Regenerate</button>
                </div>
              </div>
              {/* Regenerate Modal */}
              {regenModal.open && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadein">
                  <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
                    <button
                      onClick={() => setRegenModal({ open: false, type: '' })}
                      className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
                      aria-label="Close regenerate modal"
                    >&times;</button>
                    <h2 className="text-xl font-bold text-white mb-6">Regenerate API Key</h2>
                    <p className="text-gray-300 mb-6">Are you sure you want to regenerate the <span className="font-semibold text-white">{regenModal.type === 'production' ? 'Production' : 'Test'}</span> API key? This will invalidate the old key.</p>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setRegenModal({ open: false, type: '' })}
                        className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                      >Cancel</button>
                      <button
                        type="button"
                        onClick={handleRegenConfirm}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                        disabled={regenLoading}
                        aria-busy={regenLoading}
                      >
                        {regenLoading && (
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                        )}
                        {regenLoading ? 'Regenerating...' : 'Regenerate'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">Rate Limits</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-600 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">1,000</div>
                <div className="text-sm text-gray-400">Requests per minute</div>
              </div>
              <div className="p-4 border border-gray-600 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">50,000</div>
                <div className="text-sm text-gray-400">Requests per day</div>
              </div>
              <div className="p-4 border border-gray-600 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">100</div>
                <div className="text-sm text-gray-400">Concurrent connections</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">API Documentation</div>
            <div className="space-y-3">
              <a href="#" className="flex items-center justify-between p-3 border border-gray-600 rounded-lg hover:bg-gray-700" aria-label="REST API Reference">
                <div>
                  <div className="font-medium text-white">REST API Reference</div>
                  <div className="text-sm text-gray-400">Complete API documentation</div>
                </div>
                <DocumentTextIcon className="h-5 w-5 text-purple-400" />
              </a>
              <a href="#" className="flex items-center justify-between p-3 border border-gray-600 rounded-lg hover:bg-gray-700" aria-label="SDK Downloads">
                <div>
                  <div className="font-medium text-white">SDK Downloads</div>
                  <div className="text-sm text-gray-400">JavaScript, Python, Node.js</div>
                </div>
                <DocumentTextIcon className="h-5 w-5 text-purple-400" />
              </a>
              <a href="#" className="flex items-center justify-between p-3 border border-gray-600 rounded-lg hover:bg-gray-700" aria-label="Webhook Guide">
                <div>
                  <div className="font-medium text-white">Webhook Guide</div>
                  <div className="text-sm text-gray-400">Setting up webhooks</div>
                </div>
                <DocumentTextIcon className="h-5 w-5 text-purple-400" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Billing Settings */}
      {active === 'Billing' && (
        <div className="space-y-6 animate-fadein">
          {billingToast && (
            <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{billingToast}</div>
          )}
          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">Current Plan</div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-2xl font-bold text-purple-400">{billing.plan} Plan</div>
                <div className="text-gray-300 text-lg">${billing.price}/mo</div>
                <div className="text-gray-400 text-sm">Renews on {billing.renewal}</div>
                <ul className="mt-2 text-gray-400 text-sm list-disc list-inside">
                  {billing.features.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>
              <div className="flex flex-col gap-2 min-w-[180px]">
                <button
                  className="py-2 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                  onClick={handleUpgradeDowngrade}
                  disabled={billingLoading}
                  aria-busy={billingLoading}
                  aria-label="Upgrade or downgrade plan"
                >{billingLoading ? 'Processing...' : 'Upgrade/Downgrade'}</button>
                <button
                  className="py-2 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                  onClick={() => setShowCancelModal(true)}
                  disabled={billingLoading}
                  aria-busy={billingLoading}
                  aria-label="Cancel subscription"
                >Cancel Subscription</button>
              </div>
            </div>
            {/* Plan Modal */}
            {showPlanModal && (
              <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadein">
                <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
                  <button
                    onClick={() => setShowPlanModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
                    aria-label="Close plan modal"
                  >&times;</button>
                  <h2 className="text-xl font-bold text-white mb-6">Change Plan</h2>
                  <div className="space-y-4">
                    <button
                      className={`w-full py-3 rounded-lg font-semibold border transition ${billing.plan === 'Pro' ? 'bg-purple-600 text-white border-purple-700' : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-purple-700 hover:text-white'}`}
                      onClick={() => handlePlanChange('Pro')}
                      disabled={billingLoading || billing.plan === 'Pro'}
                      aria-busy={billingLoading}
                    >Pro — $49/mo</button>
                    <button
                      className={`w-full py-3 rounded-lg font-semibold border transition ${billing.plan === 'Starter' ? 'bg-purple-600 text-white border-purple-700' : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-purple-700 hover:text-white'}`}
                      onClick={() => handlePlanChange('Starter')}
                      disabled={billingLoading || billing.plan === 'Starter'}
                      aria-busy={billingLoading}
                    >Starter — $19/mo</button>
                  </div>
                </div>
              </div>
            )}
            {/* Cancel Modal */}
            {showCancelModal && (
              <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadein">
                <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
                    aria-label="Close cancel modal"
                  >&times;</button>
                  <h2 className="text-xl font-bold text-white mb-6">Cancel Subscription</h2>
                  <p className="text-gray-300 mb-6">Are you sure you want to cancel your subscription? You will retain access until the end of your billing period.</p>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(false)}
                      className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                    >Keep Subscription</button>
                    <button
                      type="button"
                      onClick={handleCancelSub}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                      disabled={billingLoading}
                      aria-busy={billingLoading}
                    >
                      {billingLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                      ) : 'Cancel Subscription'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">Payment Methods</div>
            <div className="space-y-3">
              {billing.paymentMethods.map(card => (
                <div key={card.id} className="flex items-center justify-between p-3 border border-gray-600 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{card.brand} •••• {card.last4} {card.primary && <span className='ml-2 px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full text-xs'>Primary</span>}</div>
                    <div className="text-sm text-gray-400">Exp {card.exp}</div>
                  </div>
                  <button
                    className="text-red-400 hover:text-red-300 text-sm"
                    onClick={() => handleRemoveCard(card.id)}
                    disabled={cardLoading && removeCardId === card.id}
                    aria-busy={cardLoading && removeCardId === card.id}
                    aria-label={`Remove ${card.brand} card ending in ${card.last4}`}
                  >{cardLoading && removeCardId === card.id ? 'Removing...' : 'Remove'}</button>
                </div>
              ))}
              <button
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                onClick={() => setShowAddCard(true)}
                aria-label="Add payment method"
              >Add Card</button>
              {/* Add Card Modal */}
              {showAddCard && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadein">
                  <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
                    <button
                      onClick={() => setShowAddCard(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
                      aria-label="Close add card modal"
                    >&times;</button>
                    <h2 className="text-xl font-bold text-white mb-6">Add Payment Method</h2>
                    <form onSubmit={handleAddCard} className="space-y-4" aria-label="Add card form">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Card Brand</label>
                        <input
                          type="text"
                          value={cardForm.brand}
                          onChange={e => setCardForm({ ...cardForm, brand: e.target.value })}
                          className={`w-full px-4 py-2 bg-gray-700 border ${cardErrors.brand ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                          placeholder="e.g. Visa, Mastercard"
                          aria-label="Card brand"
                          required
                        />
                        {cardErrors.brand && <div className="text-red-400 text-xs mt-1" role="alert">{cardErrors.brand}</div>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardForm.number}
                          onChange={e => setCardForm({ ...cardForm, number: e.target.value })}
                          className={`w-full px-4 py-2 bg-gray-700 border ${cardErrors.number ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                          placeholder="1234123412341234"
                          aria-label="Card number"
                          required
                        />
                        {cardErrors.number && <div className="text-red-400 text-xs mt-1" role="alert">{cardErrors.number}</div>}
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-300 mb-1">Exp</label>
                          <input
                            type="text"
                            value={cardForm.exp}
                            onChange={e => setCardForm({ ...cardForm, exp: e.target.value })}
                            className={`w-full px-4 py-2 bg-gray-700 border ${cardErrors.exp ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                            placeholder="MM/YY"
                            aria-label="Expiration date"
                            required
                          />
                          {cardErrors.exp && <div className="text-red-400 text-xs mt-1" role="alert">{cardErrors.exp}</div>}
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-300 mb-1">CVC</label>
                          <input
                            type="text"
                            value={cardForm.cvc}
                            onChange={e => setCardForm({ ...cardForm, cvc: e.target.value })}
                            className={`w-full px-4 py-2 bg-gray-700 border ${cardErrors.cvc ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                            placeholder="123"
                            aria-label="CVC"
                            required
                          />
                          {cardErrors.cvc && <div className="text-red-400 text-xs mt-1" role="alert">{cardErrors.cvc}</div>}
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowAddCard(false)}
                          className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                        >Cancel</button>
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                          disabled={cardLoading}
                          aria-busy={cardLoading}
                        >
                          {cardLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                          ) : 'Add Card'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">Invoices</div>
            <div className="space-y-3">
              {billing.invoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-3 border border-gray-600 rounded-lg">
                  <div>
                    <div className="font-medium text-white">Invoice #{inv.id}</div>
                    <div className="text-sm text-gray-400">{inv.date} • ${inv.amount} • {inv.status}</div>
                  </div>
                  <button
                    className="text-purple-400 hover:text-purple-300 text-sm"
                    onClick={() => handleDownloadInvoice(inv.id)}
                    aria-label={`Download invoice #${inv.id}`}
                  >Download</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 