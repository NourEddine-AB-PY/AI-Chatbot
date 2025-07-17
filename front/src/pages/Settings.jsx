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
  ChartBarIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  PauseIcon
} from '@heroicons/react/24/outline'
import axios from 'axios'
import { useLanguage } from '../contexts/LanguageContext'
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import { userAPI } from '../utils/api'

const initialTeam = [
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', avatar: 'https://randomuser.me/api/portraits/women/65.jpg', status: 'Active' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Manager', avatar: 'https://randomuser.me/api/portraits/men/43.jpg', status: 'Active' },
  { name: 'Carol Davis', email: 'carol@example.com', role: 'Agent', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', status: 'Pending' },
]

const tabs = [
  { name: 'profile', icon: UserIcon },
  { name: 'security', icon: ShieldCheckIcon },
]

export default function Settings({ logoUrl, setLogoUrl, profile, setProfile }) {
  const { t, isRTL } = useLanguage()
  const [active, setActive] = useState('profile')
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
  const [sessions, setSessions] = useState([]);
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
  const [profileData, setProfileData] = useState({
    business_name: '',
    business_email: '',
    business_logo_url: '',
    language: 'en',
    phone: '',
    website: '',
    timezone: '',
  });
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  // Define notificationOptions here so t is available
  const notificationOptions = [
    {
      key: "email",
      label: t('emailNotifications'),
      description: t('receiveImportantUpdatesAndAlertsViaEmail'),
    },
    {
      key: "sms",
      label: t('smsNotifications'),
      description: t('getInstantNotificationsOnYourMobileDevice'),
    },
    {
      key: "push",
      label: t('pushNotifications'),
      description: t('allowBrowserPushNotificationsForRealTimeUpdates'),
    },
  ];

  // Fetch user settings on mount
  useEffect(() => {
    setProfileLoading(true);
    
    // Using the API utility for user settings
    userAPI.getSettings()
      .then(data => {
        const settings = {
          business_name: data?.business_name || '',
          business_email: data?.business_email || '',
          business_logo_url: data?.business_logo_url || '',
          language: data?.language || 'en',
          phone: data?.phone || '',
          website: data?.website || '',
          timezone: data?.timezone || '',
        };
        setProfileData(settings);
        
        // Set the logo URL if it exists
        if (settings.business_logo_url) {
          // Convert relative URL to full URL for display
          const fullLogoUrl = settings.business_logo_url.startsWith('http') 
            ? settings.business_logo_url 
            : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${settings.business_logo_url}`;
          setLogoUrl(fullLogoUrl);
        }
      })
      .catch((error) => {
        console.error('Failed to load settings:', error);
        setProfileData({
          business_name: '',
          business_email: '',
          business_logo_url: '',
          language: 'en',
          phone: '',
          website: '',
          timezone: '',
        });
      })
      .finally(() => setProfileLoading(false));
  }, []);

  // Fetch user sessions on mount (security tab)
  useEffect(() => {
    if (active !== 'security') return;
    
    // Using the API utility for sessions
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/user-settings/sessions`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setSessions(data))
      .catch(() => setSessions([]));
  }, [active]);

  function validateProfile() {
    const errs = {};
    if (!profileData?.business_name) errs.business_name = t('businessNameIsRequired');
    if (!profileData?.business_email) errs.business_email = t('emailIsRequired');
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(profileData.business_email)) errs.business_email = t('invalidEmail');
    return errs;
  }

  function handleProfileChange(e) {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  }

  function handleSave(e) {
    e.preventDefault();
    const errs = validateProfile();
    setProfileErrors(errs);
    if (Object.keys(errs).length > 0) return;
    
    console.log('Saving settings:', profileData);
    setProfileLoading(true);
    
    userAPI.updateSettings(profileData)
      .then((data) => {
        console.log('Save successful:', data);
        setSaved(true);
        setShowToast(t('settingsSaved'));
      })
      .catch((error) => {
        console.error('Save failed:', error);
        setShowToast(t('settingsFailed'));
      })
      .finally(() => {
        setProfileLoading(false);
        setTimeout(() => setSaved(false), 2000);
        setTimeout(() => setShowToast(''), 2000);
      });
  }

  function handleChooseFile() {
    fileInputRef.current?.click()
  }

  function handleLogoChange(e) {
    const file = e.target.files[0]
    if (file) {
      setLogo(file)
      setLogoUrl(URL.createObjectURL(file))
      setLogoUploading(true)
      
      // Upload the file to server
      const formData = new FormData()
      formData.append('logo', file)
      
      axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/user-settings/upload-logo`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })
        .then((response) => {
          // Update the logo URL with the server URL
          const fullLogoUrl = response.data.logoUrl.startsWith('http') 
            ? response.data.logoUrl 
            : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${response.data.logoUrl}`;
          setLogoUrl(fullLogoUrl)
          setProfileData(prev => ({
            ...prev,
            business_logo_url: response.data.logoUrl
          }))
          setShowToast(t('logoUploaded'))
        })
        .catch((error) => {
          console.error('Logo upload failed:', error.response || error)
          setShowToast(t('failedToUploadLogo'))
        })
        .finally(() => {
          setLogoUploading(false)
          setTimeout(() => setShowToast(''), 2000)
        })
    }
  }

  function validateInvite(form) {
    const errs = {}
    if (!form.name) errs.name = t('nameIsRequired')
    if (!form.email) errs.email = t('emailIsRequired')
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = t('invalidEmail')
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
      setShowToast(t('invitationSent'))
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
      setShowToast(t('memberUpdated'))
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
    setShowToast(t('memberRemoved'))
    setTimeout(() => setShowToast(''), 2000)
  }

  function handleBotConfigChange(e) {
    setBotConfig({ ...botConfig, [e.target.name]: e.target.value })
  }
  function handleBotConfigSave() {
    setBotConfigLoading(true)
    setTimeout(() => {
      setBotConfigLoading(false)
      setShowBotToast(t('botSettingsSaved'))
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
      setShowBotToast(t('filesUploaded'))
      setTimeout(() => setShowBotToast(''), 2000)
      setUploadFiles([])
    }, 1200)
  }
  function handleExampleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!exampleForm.user) errs.user = t('userMessageRequired')
    if (!exampleForm.bot) errs.bot = t('botReplyRequired')
    setExampleErrors(errs)
    if (Object.keys(errs).length > 0) return
    setExampleLoading(true)
    setTimeout(() => {
      setExampleLoading(false)
      setShowExamples(false)
      setExamples(prev => [...prev, { ...exampleForm }])
      setShowBotToast(t('exampleAdded'))
      setTimeout(() => setShowBotToast(''), 2000)
      setExampleForm({ user: '', bot: '' })
    }, 1200)
  }

  function validatePassword() {
    const errs = {}
    if (!password) errs.password = t('currentPasswordRequired')
    if (!newPassword) errs.newPassword = t('newPasswordRequired')
    else if (newPassword.length < 8) errs.newPassword = t('passwordMustBeAtLeast8Characters')
    if (newPassword !== confirmPassword) errs.confirmPassword = t('passwordsDoNotMatch')
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
      setPwToast(t('passwordUpdated'))
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
        setSmsToast(t('sms2faEnabled'))
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
      setAuthToast(t('authenticator2faEnabled'))
      setTimeout(() => setAuthToast(''), 2000)
    }, 1200)
  }
  // Terminate session
  function handleTerminate(idx) {
    setTerminateIdx(idx)
    setShowTerminate(true)
  }
  function handleTerminateConfirm() {
    setTerminateLoading(true);
    const token = localStorage.getItem('token');
    const sessionId = sessions[terminateIdx]?.id;
    axios.delete(`/api/user-settings/sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setSessions(prev => prev.filter((_, i) => i !== terminateIdx));
        setShowTerminate(false);
        setTerminateLoading(false);
        setTerminateToast(t('sessionTerminated'))
        setTimeout(() => setTerminateToast(''), 2000);
      })
      .catch(() => setTerminateLoading(false));
  }

  function handleCopyKey(type) {
    navigator.clipboard.writeText(apiKeys[type])
    setApiToast(`${type === 'production' ? t('production') : t('test')} API key copied!`)
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
      setApiToast(`${regenModal.type === 'production' ? t('production') : t('test')} API key regenerated!`)
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
      setBillingToast(t('planChangedTo', { plan: newPlan }))
      setTimeout(() => setBillingToast(''), 2000)
    }, 1200)
  }
  function handleCancelSub() {
    setBillingLoading(true)
    setTimeout(() => {
      setBillingLoading(false)
      setShowCancelModal(false)
      setBillingToast(t('subscriptionCancelled'))
      setTimeout(() => setBillingToast(''), 2000)
    }, 1200)
  }
  function handleAddCard(e) {
    e.preventDefault()
    const errs = {}
    if (!cardForm.brand) errs.brand = t('brandRequired')
    if (!/^\d{16}$/.test(cardForm.number)) errs.number = t('16DigitCardNumber')
    if (!/^\d{2}\/\d{2}$/.test(cardForm.exp)) errs.exp = t('mmYy')
    if (!/^\d{3,4}$/.test(cardForm.cvc)) errs.cvc = t('34DigitCvc')
    setCardErrors(errs)
    if (Object.keys(errs).length > 0) return
    setCardLoading(true)
    setTimeout(() => {
      setBilling(b => ({ ...b, paymentMethods: [...b.paymentMethods, { id: Date.now(), brand: cardForm.brand, last4: cardForm.number.slice(-4), exp: cardForm.exp, primary: false }] }))
      setCardForm({ brand: '', number: '', exp: '', cvc: '' })
      setCardLoading(false)
      setShowAddCard(false)
      setBillingToast(t('cardAdded'))
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
      setBillingToast(t('cardRemoved'))
      setTimeout(() => setBillingToast(''), 2000)
    }, 1000)
  }
  function handleDownloadInvoice(id) {
    setBillingToast(t('invoiceDownloaded'))
    setTimeout(() => setBillingToast(''), 2000)
  }

  const handleToggle = (key) => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
      setSaving(false);
      setSnackbar(true);
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadein">
      <h1 className="text-3xl font-bold text-white mb-8">{t('settings')}</h1>
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
            {t(tab.name)}
          </button>
        ))}
      </div>

      {/* Profile Settings */}
      {active === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleSave} className="bg-gray-800 rounded-xl shadow p-6 space-y-4 border border-gray-700" aria-label="Business profile form">
            <div className="font-bold text-lg mb-4 text-white">{t('businessProfile')}</div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('businessName')}</label>
              <input 
                type="text" 
                name="business_name"
                value={profileData?.business_name} 
                onChange={handleProfileChange} 
                className={`w-full px-4 py-2 bg-gray-700 border ${profileErrors.business_name ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`} 
                aria-label="Business name"
              />
              {profileErrors.business_name && <div className="text-red-400 text-xs mt-1" role="alert">{profileErrors.business_name}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('emailAddress')}</label>
              <input 
                type="email" 
                name="business_email"
                value={profileData?.business_email} 
                onChange={handleProfileChange} 
                className={`w-full px-4 py-2 bg-gray-700 border ${profileErrors.business_email ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`} 
                aria-label="Email address"
              />
              {profileErrors.business_email && <div className="text-red-400 text-xs mt-1" role="alert">{profileErrors.business_email}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('phoneNumber')}</label>
              <input 
                type="tel" 
                name="phone"
                value={profileData.phone} 
                onChange={handleProfileChange} 
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                aria-label="Phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('website')}</label>
              <input 
                type="url" 
                name="website"
                value={profileData.website} 
                onChange={handleProfileChange} 
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                aria-label="Website"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('timezone')}</label>
              <input 
                type="text" 
                name="timezone"
                value={profileData.timezone} 
                onChange={handleProfileChange} 
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                aria-label="Timezone"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('language')}</label>
                <select 
                  name="language"
                  value={profileData?.language} 
                  onChange={handleProfileChange} 
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
              {profileLoading ? t('saving') : t('saveChanges')}
            </button>
            {saved && <div className="flex items-center gap-2 text-green-400 mt-2"><CheckCircleIcon className="h-5 w-5" />{t('changesSaved')}</div>}
          </form>

          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">{t('businessLogo')}</div>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt="Business logo preview" 
                    className="w-24 h-24 object-cover rounded-full"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}

                  />
                ) : (
                  <UserIcon className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <p className="text-gray-400 mb-2">
                {logoUrl ? t('logoUploaded') : t('uploadBusinessLogo')}
              </p>
              <button
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleChooseFile}
                type="button"
                disabled={logoUploading}
                aria-label="Choose logo file"
              >
                {logoUploading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Uploading...
                  </div>
                ) : (
                  t('chooseFile')
                )}
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
      {active === 'team' && (
        <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
          <div className="font-bold text-lg mb-4 flex items-center justify-between text-white">
            Team Members 
            <button
              className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              onClick={() => setShowInvite(true)}
              aria-label="Invite team member"
            >
              <PlusIcon className="h-4 w-4" />{t('inviteMember')}
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
                        >{t('edit')}</button>
                        <button
                          className="p-1 text-red-400 hover:bg-red-900/20 rounded"
                          onClick={() => handleRemoveClick(idx)}
                          aria-label={`Remove ${member.name}`}
                        >{t('remove')}</button>
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
                <h2 className="text-xl font-bold text-white mb-6">{t('inviteTeamMember')}</h2>
                <form onSubmit={handleInviteSubmit} className="space-y-4" aria-label="Invite member form">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('name')}</label>
                    <input
                      type="text"
                      name="name"
                      value={inviteForm.name}
                      onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })}
                      className={`w-full px-4 py-2 bg-gray-700 border ${inviteErrors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                      placeholder={t('fullName')}
                      aria-label="Name"
                    />
                    {inviteErrors.name && <div className="text-red-400 text-xs mt-1" role="alert">{inviteErrors.name}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={inviteForm.email}
                      onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })}
                      className={`w-full px-4 py-2 bg-gray-700 border ${inviteErrors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                      placeholder={t('email')}
                      aria-label="Email"
                    />
                    {inviteErrors.email && <div className="text-red-400 text-xs mt-1" role="alert">{inviteErrors.email}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('role')}</label>
                    <select
                      name="role"
                      value={inviteForm.role}
                      onChange={e => setInviteForm({ ...inviteForm, role: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      aria-label="Role"
                    >
                      <option value="Admin">{t('admin')}</option>
                      <option value="Manager">{t('manager')}</option>
                      <option value="Agent">{t('agent')}</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowInvite(false)}
                      className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                    >{t('cancel')}</button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                      disabled={inviteLoading}
                      aria-busy={inviteLoading}
                    >
                      {inviteLoading && (
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                      )}
                      {inviteLoading ? t('inviting') : t('invite')}
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
                <h2 className="text-xl font-bold text-white mb-6">{t('editTeamMember')}</h2>
                <form onSubmit={handleEditSubmit} className="space-y-4" aria-label="Edit member form">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('name')}</label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className={`w-full px-4 py-2 bg-gray-700 border ${editErrors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                      placeholder={t('fullName')}
                      aria-label="Name"
                    />
                    {editErrors.name && <div className="text-red-400 text-xs mt-1" role="alert">{editErrors.name}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      className={`w-full px-4 py-2 bg-gray-700 border ${editErrors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                      placeholder={t('email')}
                      aria-label="Email"
                    />
                    {editErrors.email && <div className="text-red-400 text-xs mt-1" role="alert">{editErrors.email}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('role')}</label>
                    <select
                      name="role"
                      value={editForm.role}
                      onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      aria-label="Role"
                    >
                      <option value="Admin">{t('admin')}</option>
                      <option value="Manager">{t('manager')}</option>
                      <option value="Agent">{t('agent')}</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEdit(false)}
                      className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                    >{t('cancel')}</button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                      disabled={editLoading}
                      aria-busy={editLoading}
                    >
                      {editLoading && (
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                      )}
                      {editLoading ? t('saving') : t('save')}
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
                <h2 className="text-xl font-bold text-white mb-6">{t('removeTeamMember')}</h2>
                <p className="text-gray-300 mb-6">{t('confirmRemoveMember', { name: team[removeIdx]?.name })}</p>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRemove(false)}
                    className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                  >{t('cancel')}</button>
                  <button
                    type="button"
                    onClick={handleRemoveConfirm}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >{t('remove')}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bot Settings */}
      {active === 'bots' && (
        <div className="space-y-6">
          {showBotToast && (
            <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{showBotToast}</div>
          )}
          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">{t('botConfiguration')}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('defaultResponseTime')}</label>
                <select
                  name="responseTime"
                  value={botConfig.responseTime}
                  onChange={handleBotConfigChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  aria-label="Default response time"
                >
                  <option>{t('immediate')}</option>
                  <option>5 seconds</option>
                  <option>10 seconds</option>
                  <option>30 seconds</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('autoResponseMode')}</label>
                <select
                  name="autoResponse"
                  value={botConfig.autoResponse}
                  onChange={handleBotConfigChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  aria-label="Auto-response mode"
                >
                  <option>{t('enabled')}</option>
                  <option>{t('disabled')}</option>
                  <option>{t('businessHoursOnly')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('languageDetection')}</label>
                <select
                  name="languageDetection"
                  value={botConfig.languageDetection}
                  onChange={handleBotConfigChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  aria-label="Language detection"
                >
                  <option>{t('automatic')}</option>
                  <option>{t('manual')}</option>
                  <option>{t('disabled')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('conversationHistory')}</label>
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
                  <option>{t('unlimited')}</option>
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
              {botConfigLoading ? t('saving') : t('saveBotSettings')}
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">{t('aiTraining')}</div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-white">{t('knowledgeBase')}</div>
                  <div className="text-sm text-gray-400">{t('uploadDocuments')}</div>
                </div>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  onClick={() => setShowUpload(true)}
                  aria-label="Upload files"
                >
                  {t('uploadFiles')}
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-white">{t('conversationExamples')}</div>
                  <div className="text-sm text-gray-400">{t('addSampleConversations')}</div>
                </div>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  onClick={() => setShowExamples(true)}
                  aria-label="Add examples"
                >
                  {t('addExamples')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {active === 'security' && (
        <div className="space-y-6 animate-fadein">
          {pwToast && (
            <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{pwToast}</div>
          )}
          {terminateToast && (
            <div className="fixed top-44 right-6 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{terminateToast}</div>
          )}
          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">{t('changePassword')}</div>
            <form className="space-y-4" onSubmit={handlePasswordChange} aria-label="Change password form">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('currentPassword')}</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700 border ${pwErrors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                  aria-label="Current password"
                />
                {pwErrors.password && <div className="text-red-400 text-xs mt-1" role="alert">{pwErrors.password}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('newPassword')}</label>
                <input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700 border ${pwErrors.newPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                  aria-label="New password"
                />
                {pwErrors.newPassword && <div className="text-red-400 text-xs mt-1" role="alert">{pwErrors.newPassword}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('confirmNewPassword')}</label>
                <input
                  type="password"
                  name="confirmPassword"
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
                {pwLoading ? t('updating') : t('updatePassword')}
              </button>
            </form>
          </div>
          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">{t('activeSessions')}</div>
            <div className="space-y-3">
              {sessions.map((session, idx) => {
                // Format device name more nicely
                const deviceName = session.device_name || t('unknownDevice');
                
                // Check if IP is localhost and format location
                const isLocalhost = session.ip_address === '::1' || session.ip_address === '127.0.0.1' || session.ip_address === 'localhost';
                const location = isLocalhost ? t('thisDevice') : (session.ip_address || t('unknownLocation'));
                
                // Format last active time
                const lastActive = session.last_active ? new Date(session.last_active).toLocaleString() : t('unknown');
                
                return (
                  <div key={session.id} className="flex items-center justify-between p-3 border border-gray-600 rounded-lg">
                    <div>
                      <div className="font-medium text-white">{deviceName}</div>
                      <div className="text-sm text-gray-400">
                        {location} • {t('lastActive')}: {lastActive}
                      </div>
                    </div>
                    <button
                      className="text-red-400 hover:text-red-300 text-sm"
                      onClick={() => handleTerminate(idx)}
                    >{t('terminate')}</button>
                  </div>
                );
              })}
              {/* Terminate Session Modal */}
              {showTerminate && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadein">
                  <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
                    <button
                      onClick={() => setShowTerminate(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
                      aria-label="Close terminate session modal"
                    >&times;</button>
                    <h2 className="text-xl font-bold text-white mb-6">{t('terminateSession')}</h2>
                    <p className="text-gray-300 mb-6">{t('confirmTerminateSession', { device: sessions[terminateIdx]?.device })}</p>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowTerminate(false)}
                        className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                      >{t('cancel')}</button>
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
                        {terminateLoading ? t('terminating') : t('terminate')}
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
      {active === 'api' && (
        <div className="space-y-6 animate-fadein">
          {apiToast && (
            <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{apiToast}</div>
          )}
          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">{t('apiKeys')}</div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-white">{t('productionAPIKey')}</div>
                  <div className="text-sm text-gray-400">{apiKeys.production}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 text-purple-400 hover:bg-gray-600 rounded text-sm"
                    onClick={() => handleCopyKey('production')}
                    aria-label="Copy production API key"
                  >{t('copy')}</button>
                  <button
                    className="px-3 py-1 text-red-400 hover:bg-red-900/20 rounded text-sm"
                    onClick={() => handleRegenClick('production')}
                    aria-label="Regenerate production API key"
                  >{t('regenerate')}</button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-white">{t('testAPIKey')}</div>
                  <div className="text-sm text-gray-400">{apiKeys.test}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 text-purple-400 hover:bg-gray-600 rounded text-sm"
                    onClick={() => handleCopyKey('test')}
                    aria-label="Copy test API key"
                  >{t('copy')}</button>
                  <button
                    className="px-3 py-1 text-red-400 hover:bg-red-900/20 rounded text-sm"
                    onClick={() => handleRegenClick('test')}
                    aria-label="Regenerate test API key"
                  >{t('regenerate')}</button>
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
                    <h2 className="text-xl font-bold text-white mb-6">{t('regenerateAPIKey')}</h2>
                    <p className="text-gray-300 mb-6">{t('confirmRegenerateAPIKey', { type: regenModal.type === 'production' ? t('production') : t('test') })}</p>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setRegenModal({ open: false, type: '' })}
                        className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                      >{t('cancel')}</button>
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
                        {regenLoading ? t('regenerating') : t('regenerate')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">{t('rateLimits')}</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-600 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">1,000</div>
                <div className="text-sm text-gray-400">{t('requestsPerMinute')}</div>
              </div>
              <div className="p-4 border border-gray-600 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">50,000</div>
                <div className="text-sm text-gray-400">{t('requestsPerDay')}</div>
              </div>
              <div className="p-4 border border-gray-600 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">100</div>
                <div className="text-sm text-gray-400">{t('concurrentConnections')}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">{t('apiDocumentation')}</div>
            <div className="space-y-3">
              <a href="#" className="flex items-center justify-between p-3 border border-gray-600 rounded-lg hover:bg-gray-700" aria-label="REST API Reference">{t('restAPIReference')}</a>
              <a href="#" className="flex items-center justify-between p-3 border border-gray-600 rounded-lg hover:bg-gray-700" aria-label="SDK Downloads">{t('sdkDownloads')}</a>
              <a href="#" className="flex items-center justify-between p-3 border border-gray-600 rounded-lg hover:bg-gray-700" aria-label="Webhook Guide">{t('webhookGuide')}</a>
            </div>
          </div>
        </div>
      )}

      {/* Billing Settings */}
      {active === 'billing' && (
        <div className="space-y-6 animate-fadein">
          {billingToast && (
            <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{billingToast}</div>
          )}
          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">{t('currentPlan')}</div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-2xl font-bold text-purple-400">{billing.plan} Plan</div>
                <div className="text-gray-300 text-lg">${billing.price}/mo</div>
                <div className="text-gray-400 text-sm">{t('renewsOn', { date: billing.renewal })}</div>
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
                  aria-label={t('upgradeOrDowngradePlan')}
                >{billingLoading ? t('processing') : t('upgradeDowngrade')}</button>
                <button
                  className="py-2 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                  onClick={() => setShowCancelModal(true)}
                  disabled={billingLoading}
                  aria-busy={billingLoading}
                  aria-label={t('cancelSubscription')}
                >{t('cancelSubscription')}</button>
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
                  <h2 className="text-xl font-bold text-white mb-6">{t('changePlan')}</h2>
                  <div className="space-y-4">
                    <button
                      className={`w-full py-3 rounded-lg font-semibold border transition ${billing.plan === 'Pro' ? 'bg-purple-600 text-white border-purple-700' : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-purple-700 hover:text-white'}`}
                      onClick={() => handlePlanChange('Pro')}
                      disabled={billingLoading || billing.plan === 'Pro'}
                      aria-busy={billingLoading}
                    >{t('pro', { price: 49 })}</button>
                    <button
                      className={`w-full py-3 rounded-lg font-semibold border transition ${billing.plan === 'Starter' ? 'bg-purple-600 text-white border-purple-700' : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-purple-700 hover:text-white'}`}
                      onClick={() => handlePlanChange('Starter')}
                      disabled={billingLoading || billing.plan === 'Starter'}
                      aria-busy={billingLoading}
                    >{t('starter', { price: 19 })}</button>
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
                  <h2 className="text-xl font-bold text-white mb-6">{t('cancelSubscription')}</h2>
                  <p className="text-gray-300 mb-6">{t('confirmCancelSubscription')}</p>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(false)}
                      className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                    >{t('keepSubscription')}</button>
                    <button
                      type="button"
                      onClick={handleCancelSub}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                      disabled={billingLoading}
                      aria-busy={billingLoading}
                    >
                      {billingLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                      ) : t('cancelSubscription')}</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">{t('paymentMethods')}</div>
            <div className="space-y-3">
              {billing.paymentMethods.map(card => (
                <div key={card.id} className="flex items-center justify-between p-3 border border-gray-600 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{card.brand} •••• {card.last4} {card.primary && <span className='ml-2 px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full text-xs'>{t('primary')}</span>}</div>
                    <div className="text-sm text-gray-400">{t('exp', { exp: card.exp })}</div>
                  </div>
                  <button
                    className="text-red-400 hover:text-red-300 text-sm"
                    onClick={() => handleRemoveCard(card.id)}
                    disabled={cardLoading && removeCardId === card.id}
                    aria-busy={cardLoading && removeCardId === card.id}
                    aria-label={t('removeCard', { brand: card.brand, last4: card.last4 })}
                  >{cardLoading && removeCardId === card.id ? t('removing') : t('remove')}</button>
                </div>
              ))}
              <button
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                onClick={() => setShowAddCard(true)}
                aria-label={t('addPaymentMethod')}
              >{t('addCard')}</button>
              {/* Add Card Modal */}
              {showAddCard && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadein">
                  <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
                    <button
                      onClick={() => setShowAddCard(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
                      aria-label="Close add card modal"
                    >&times;</button>
                    <h2 className="text-xl font-bold text-white mb-6">{t('addPaymentMethod')}</h2>
                    <form onSubmit={handleAddCard} className="space-y-4" aria-label="Add card form">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t('cardBrand')}</label>
                        <input
                          type="text"
                          name="brand"
                          value={cardForm.brand}
                          onChange={e => setCardForm({ ...cardForm, brand: e.target.value })}
                          className={`w-full px-4 py-2 bg-gray-700 border ${cardErrors.brand ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                          placeholder={t('cardBrand')}
                          aria-label="Card brand"
                          required
                        />
                        {cardErrors.brand && <div className="text-red-400 text-xs mt-1" role="alert">{cardErrors.brand}</div>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t('cardNumber')}</label>
                        <input
                          type="text"
                          name="number"
                          value={cardForm.number}
                          onChange={e => setCardForm({ ...cardForm, number: e.target.value })}
                          className={`w-full px-4 py-2 bg-gray-700 border ${cardErrors.number ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                          placeholder={t('cardNumber')}
                          aria-label="Card number"
                          required
                        />
                        {cardErrors.number && <div className="text-red-400 text-xs mt-1" role="alert">{cardErrors.number}</div>}
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-300 mb-1">{t('exp')}</label>
                          <input
                            type="text"
                            name="exp"
                            value={cardForm.exp}
                            onChange={e => setCardForm({ ...cardForm, exp: e.target.value })}
                            className={`w-full px-4 py-2 bg-gray-700 border ${cardErrors.exp ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                            placeholder={t('exp')}
                            aria-label="Expiration date"
                            required
                          />
                          {cardErrors.exp && <div className="text-red-400 text-xs mt-1" role="alert">{cardErrors.exp}</div>}
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-300 mb-1">{t('cvc')}</label>
                          <input
                            type="text"
                            name="cvc"
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
                        >{t('cancel')}</button>
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                          disabled={cardLoading}
                          aria-busy={cardLoading}
                        >
                          {cardLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                          ) : t('addCard')}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="font-bold text-lg mb-4 text-white">{t('invoices')}</div>
            <div className="space-y-3">
              {billing.invoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-3 border border-gray-600 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{t('invoice', { id: inv.id })}</div>
                    <div className="text-sm text-gray-400">{t('dateAmountStatus', { date: inv.date, amount: inv.amount, status: inv.status })}</div>
                  </div>
                  <button
                    className="text-purple-400 hover:text-purple-300 text-sm"
                    onClick={() => handleDownloadInvoice(inv.id)}
                    aria-label={t('downloadInvoice', { id: inv.id })}
                  >{t('download')}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 