import React from 'react'
import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, PlayIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useLanguage } from '../contexts/LanguageContext'

const features = [
  { title: 'Multi-Channel Support', description: 'Connect WhatsApp, Facebook, Instagram, and more' },
  { title: 'AI-Powered Responses', description: 'Advanced natural language processing for human-like conversations' },
  { title: 'Analytics Dashboard', description: 'Track performance, engagement, and customer satisfaction' },
  { title: 'Easy Integration', description: 'Simple setup with your existing business tools' },
]

const testimonials = [
  { name: 'Sarah Johnson', role: 'CEO, TechStart', content: 'Our customer support improved by 300% after implementing ChatBot Platform.' },
  { name: 'Mike Chen', role: 'Marketing Director', content: 'The analytics helped us understand our customers better than ever.' },
  { name: 'Emily Davis', role: 'Customer Success', content: 'Setting up our first bot took less than 10 minutes. Incredible!' },
]

// Modern SVG illustration for hero
const HeroSVG = () => (
  <svg width="420" height="260" viewBox="0 0 420 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-8 w-full max-w-lg animate-fadein">
    <ellipse cx="210" cy="230" rx="180" ry="25" fill="#8B5CF6" fillOpacity="0.10" />
    <rect x="80" y="60" width="260" height="100" rx="36" fill="#fff" />
    <ellipse cx="150" cy="110" rx="18" ry="18" fill="#8B5CF6" />
    <ellipse cx="270" cy="110" rx="18" ry="18" fill="#8B5CF6" />
    <rect x="170" y="140" width="80" height="14" rx="7" fill="#E5E7EB" />
    <rect x="190" y="170" width="40" height="8" rx="4" fill="#E5E7EB" />
    <rect x="200" y="40" width="20" height="28" rx="10" fill="#8B5CF6" />
    <rect x="120" y="190" width="180" height="18" rx="9" fill="#8B5CF6" fillOpacity="0.15" />
  </svg>
)

const trustLogos = [
  { src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', alt: 'Microsoft' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', alt: 'Google' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', alt: 'Netflix' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg', alt: 'Facebook' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Amazon_logo.svg', alt: 'Amazon' },
]

const faqs = [
  { q: 'What is ChatBot Platform?', a: 'A modern platform to build, deploy, and manage AI-powered chatbots for your business.' },
  { q: 'Is there a free trial?', a: 'Yes! You can start with a free trial and upgrade anytime.' },
  { q: 'Can I integrate with my existing tools?', a: 'Absolutely. We support integrations with popular business tools and channels.' },
  { q: 'Is my data secure?', a: 'Yes, we use industry-standard security and encryption to protect your data.' },
]

export default function Landing() {
  const { t, isRTL, language, changeLanguage } = useLanguage()
  
  const features = [
    { title: t('multiChannelSupport'), description: t('multiChannelSupportDesc') },
    { title: t('aiPoweredResponses'), description: t('aiPoweredResponsesDesc') },
    { title: t('analyticsDashboard'), description: t('analyticsDashboardDesc') },
    { title: t('easyIntegration'), description: t('easyIntegrationDesc') },
  ]

  const testimonials = [
    { name: t('sarahJohnson'), role: t('ceoTechstart'), content: t('sarahTestimonial') },
    { name: t('mikeChen'), role: t('marketingDirector'), content: t('mikeTestimonial') },
    { name: t('emilyDavis'), role: t('customerSuccess'), content: t('emilyTestimonial') },
  ]

  const featuredLogos = [
    { src: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Product_Hunt_Logo.png', alt: t('productHunt') },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/TechCrunch_Logo.svg', alt: t('techCrunch') },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Indie_Hackers_logo.png', alt: t('indieHackers') },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Hacker_News_logo.png', alt: t('hackerNews') },
  ]

  // Modern SVG illustration for hero
  const HeroSVG = () => (
    <svg width="420" height="260" viewBox="0 0 420 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-8 w-full max-w-lg animate-fadein">
      <ellipse cx="210" cy="230" rx="180" ry="25" fill="#8B5CF6" fillOpacity="0.10" />
      <rect x="80" y="60" width="260" height="100" rx="36" fill="#fff" />
      <ellipse cx="150" cy="110" rx="18" ry="18" fill="#8B5CF6" />
      <ellipse cx="270" cy="110" rx="18" ry="18" fill="#8B5CF6" />
      <rect x="170" y="140" width="80" height="14" rx="7" fill="#E5E7EB" />
      <rect x="190" y="170" width="40" height="8" rx="4" fill="#E5E7EB" />
      <rect x="200" y="40" width="20" height="28" rx="10" fill="#8B5CF6" />
      <rect x="120" y="190" width="180" height="18" rx="9" fill="#8B5CF6" fillOpacity="0.15" />
    </svg>
  )

  const trustLogos = [
    { src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', alt: 'Microsoft' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', alt: 'Google' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', alt: 'Netflix' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg', alt: 'Facebook' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Amazon_logo.svg', alt: 'Amazon' },
  ]

  const faqs = [
    { q: t('whatIsChatbotPlatform'), a: t('whatIsChatbotPlatformAnswer') },
    { q: t('isThereFreeTrial'), a: t('isThereFreeTrialAnswer') },
    { q: t('canIntegrateWithTools'), a: t('canIntegrateWithToolsAnswer') },
    { q: t('isDataSecure'), a: t('isDataSecureAnswer') },
  ]

  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [modal, setModal] = useState({ open: false, type: '' })
  const [contactModal, setContactModal] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactErrors, setContactErrors] = useState({})
  const [contactLoading, setContactLoading] = useState(false)
  const [contactToast, setContactToast] = useState('')
  const [faqOpen, setFaqOpen] = useState(null)
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const testimonialTimeout = useRef(null)
  const [showCtaBanner, setShowCtaBanner] = useState(true)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  const handleDemoClick = () => {
    setShowDemo(true)
    setTimeout(() => {
      setShowDemo(false)
      setModal({ open: true, type: 'demo' })
    }, 1000)
  }

  const handleContactSales = (e) => {
    e.preventDefault()
    setContactModal(true)
  }

  const validateContact = () => {
    const errs = {}
    if (!contactForm.name) errs.name = t('nameRequired')
    if (!contactForm.email) errs.email = t('emailRequired')
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactForm.email)) errs.email = t('invalidEmail')
    if (!contactForm.message) errs.message = t('messageRequired')
    return errs
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    const errs = validateContact()
    setContactErrors(errs)
    if (Object.keys(errs).length > 0) return
    setContactLoading(true)
    setTimeout(() => {
      setContactLoading(false)
      setContactModal(false)
      setContactForm({ name: '', email: '', message: '' })
      setContactToast(t('messageSent'))
      setTimeout(() => setContactToast(''), 2000)
    }, 1200)
  }

  const handleFooterModal = (type) => {
    setModal({ open: true, type })
  }

  const closeModal = () => setModal({ open: false, type: '' })

  const getModalContent = () => {
    switch (modal.type) {
      case 'demo':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">{t('liveDemo')}</h2>
            <div className="bg-gray-700 rounded-lg p-4 flex items-center justify-center mb-4" style={{ minHeight: 200 }}>
              <span className="text-gray-400">{t('demoPlaceholder')}</span>
            </div>
            <p className="text-gray-300">{t('demoDescription')}</p>
          </div>
        )
      case 'about':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">{t('aboutChatbotPlatform')}</h2>
            <p className="text-gray-300">{t('aboutDescription')}</p>
          </div>
        )
      case 'privacy':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">{t('privacyPolicy')}</h2>
            <p className="text-gray-300">{t('privacyDescription')}</p>
          </div>
        )
      case 'terms':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">{t('termsOfService')}</h2>
            <p className="text-gray-300">{t('termsDescription')}</p>
          </div>
        )
      default:
        return null
    }
  }

  // Carousel auto-advance
  function nextTestimonial() {
    setTestimonialIdx((testimonialIdx + 1) % testimonials.length)
  }
  function prevTestimonial() {
    setTestimonialIdx((testimonialIdx - 1 + testimonials.length) % testimonials.length)
  }
  // Auto-advance every 6s
  React.useEffect(() => {
    testimonialTimeout.current && clearTimeout(testimonialTimeout.current)
    testimonialTimeout.current = setTimeout(() => {
      setTestimonialIdx((testimonialIdx + 1) % testimonials.length)
    }, 6000)
    return () => clearTimeout(testimonialTimeout.current)
  }, [testimonialIdx])

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
    <div className={`min-h-screen bg-gray-900 flex flex-col relative ${isRTL ? 'text-right' : 'text-left'}`}>
      <LanguageSwitcher />
      {/* Animated gradient background for hero */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 opacity-20 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>
      {/* Hero Section */}
      <section className="relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fadein">
              {t('buildAmazing')}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"> {t('chatbots')}</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fadein">{t('heroDescription')}</p>
            <HeroSVG />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 animate-bounce-on-hover"
              >
                {t('getStartedFree')}
                <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <button 
                onClick={handleDemoClick}
                className={`inline-flex items-center gap-2 px-8 py-4 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${showDemo ? 'animate-pulse' : ''}`}
              >
                <PlayIcon className="h-5 w-5" />
                {t('watchDemo')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Honest App Introduction Section */}
      <section className="py-12 bg-gray-950 border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="mb-4">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
              <rect x="8" y="16" width="40" height="24" rx="8" fill="#8B5CF6" fillOpacity="0.15" />
              <rect x="16" y="24" width="24" height="8" rx="4" fill="#8B5CF6" />
              <circle cx="28" cy="28" r="27" stroke="#8B5CF6" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{t('whatIsChatbotPlatform')}</h2>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl">{t('whatIsChatbotPlatformIntro')}</p>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-gray-900 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">{t('howItWorks')}</h2>
            <p className="text-lg text-gray-300">{t('howItWorksDesc')}</p>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center max-w-xs animate-fadein">
              <div className="bg-purple-600/20 rounded-full p-4 mb-3">
                <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#8B5CF6" fillOpacity="0.15"/><path d="M18 10a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 10c4.418 0 8 1.79 8 4v2H10v-2c0-2.21 3.582-4 8-4z" fill="#8B5CF6"/></svg>
              </div>
              <div className="font-semibold text-white text-lg mb-1">{t('signUp')}</div>
              <div className="text-gray-400 text-sm">{t('signUpDesc')}</div>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center max-w-xs animate-fadein" style={{ animationDelay: '0.1s' }}>
              <div className="bg-purple-600/20 rounded-full p-4 mb-3">
                <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#8B5CF6" fillOpacity="0.15"/><path d="M12 24v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="18" cy="14" r="4" stroke="#8B5CF6" strokeWidth="2"/></svg>
              </div>
              <div className="font-semibold text-white text-lg mb-1">{t('createBot')}</div>
              <div className="text-gray-400 text-sm">{t('createBotDesc')}</div>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center max-w-xs animate-fadein" style={{ animationDelay: '0.2s' }}>
              <div className="bg-purple-600/20 rounded-full p-4 mb-3">
                <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#8B5CF6" fillOpacity="0.15"/><path d="M12 18h12M18 12v12" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <div className="font-semibold text-white text-lg mb-1">{t('connectChannel')}</div>
              <div className="text-gray-400 text-sm">{t('connectChannelDesc')}</div>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col items-center text-center max-w-xs animate-fadein" style={{ animationDelay: '0.3s' }}>
              <div className="bg-purple-600/20 rounded-full p-4 mb-3">
                <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#8B5CF6" fillOpacity="0.15"/><path d="M12 24h12M12 18h12M12 12h12" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <div className="font-semibold text-white text-lg mb-1">{t('viewAnalytics')}</div>
              <div className="text-gray-400 text-sm">{t('viewAnalyticsDesc')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Preview Section */}
      <section className="py-16 bg-gray-950 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-white mb-6">{t('liveDemoPreview')}</h2>
          <p className="text-gray-300 mb-8 text-center max-w-2xl">{t('liveDemoPreviewDesc')}</p>
          <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 flex flex-col gap-2 animate-fadein">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-purple-400 to-indigo-400 flex items-center justify-center font-bold text-white">B</div>
              <span className="font-semibold text-white">SupportBot</span>
              <span className="ml-auto text-xs text-green-400">Online</span>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div className="self-start bg-gray-700 text-white px-4 py-2 rounded-2xl rounded-bl-sm max-w-[80%]">{t('demoBotMsg1')}</div>
              <div className="self-end bg-purple-600 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[80%]">{t('demoUserMsg1')}</div>
              <div className="self-start bg-gray-700 text-white px-4 py-2 rounded-2xl rounded-bl-sm max-w-[80%]">{t('demoBotMsg2')}</div>
              <div className="self-end bg-purple-600 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[80%]">{t('demoUserMsg2')}</div>
              <div className="self-start bg-gray-700 text-white px-4 py-2 rounded-2xl rounded-bl-sm max-w-[80%]">{t('demoBotMsg3')}</div>
              <div className="self-end bg-purple-600 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[80%]">Thanks!</div>
              <div className="self-start bg-gray-700 text-white px-4 py-2 rounded-2xl rounded-bl-sm max-w-[80%]">You're welcome! 😊</div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input type="text" disabled placeholder={t('typeMessagePlaceholder')} className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 placeholder-gray-500 text-sm" />
              <button disabled className="bg-purple-600 text-white px-4 py-2 rounded-lg opacity-60 cursor-not-allowed">{t('send')}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-gray-900 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">{t('useCases')}</h2>
            <p className="text-lg text-gray-300">{t('useCasesDesc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col items-center text-center animate-fadein">
              <svg width="36" height="36" fill="none" viewBox="0 0 36 36" className="mb-3"><circle cx="18" cy="18" r="18" fill="#8B5CF6" fillOpacity="0.15"/><path d="M12 18h12M18 12v12" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/></svg>
              <div className="font-semibold text-white text-lg mb-1">{t('answerFaqs')}</div>
              <div className="text-gray-400 text-sm">{t('answerFaqsDesc')}</div>
            </div>
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col items-center text-center animate-fadein" style={{ animationDelay: '0.1s' }}>
              <svg width="36" height="36" fill="none" viewBox="0 0 36 36" className="mb-3"><circle cx="18" cy="18" r="18" fill="#8B5CF6" fillOpacity="0.15"/><path d="M12 24v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="18" cy="14" r="4" stroke="#8B5CF6" strokeWidth="2"/></svg>
              <div className="font-semibold text-white text-lg mb-1">{t('qualifyLeads')}</div>
              <div className="text-gray-400 text-sm">{t('qualifyLeadsDesc')}</div>
            </div>
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col items-center text-center animate-fadein" style={{ animationDelay: '0.2s' }}>
              <svg width="36" height="36" fill="none" viewBox="0 0 36 36" className="mb-3"><circle cx="18" cy="18" r="18" fill="#8B5CF6" fillOpacity="0.15"/><path d="M12 12h12M12 18h12M12 24h12" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/></svg>
              <div className="font-semibold text-white text-lg mb-1">{t('automateSupport')}</div>
              <div className="text-gray-400 text-sm">{t('automateSupportDesc')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-950 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">{t('whyChooseUs')}</h2>
            <p className="text-lg text-gray-300">{t('whyChooseUsDesc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4 animate-fadein">
              <span className="mt-1"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#8B5CF6" fillOpacity="0.15"/><path d="M7 13l3 3 7-7" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              <div>
                <div className="font-semibold text-white mb-1">{t('noCoding')}</div>
                <div className="text-gray-400 text-sm">{t('noCodingDesc')}</div>
              </div>
            </div>
            <div className="flex items-start gap-4 animate-fadein" style={{ animationDelay: '0.1s' }}>
              <span className="mt-1"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#8B5CF6" fillOpacity="0.15"/><path d="M7 13l3 3 7-7" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              <div>
                <div className="font-semibold text-white mb-1">{t('simpleAnalytics')}</div>
                <div className="text-gray-400 text-sm">{t('simpleAnalyticsDesc')}</div>
              </div>
            </div>
            <div className="flex items-start gap-4 animate-fadein" style={{ animationDelay: '0.2s' }}>
              <span className="mt-1"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#8B5CF6" fillOpacity="0.15"/><path d="M7 13l3 3 7-7" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              <div>
                <div className="font-semibold text-white mb-1">{t('quickSetup')}</div>
                <div className="text-gray-400 text-sm">{t('quickSetupDesc')}</div>
              </div>
            </div>
            <div className="flex items-start gap-4 animate-fadein" style={{ animationDelay: '0.3s' }}>
              <span className="mt-1"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#8B5CF6" fillOpacity="0.15"/><path d="M7 13l3 3 7-7" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              <div>
                <div className="font-semibold text-white mb-1">{t('freeToTry')}</div>
                <div className="text-gray-400 text-sm">{t('freeToTryDesc')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Statement */}
      <section className="py-6 bg-gray-900 border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-gray-400 text-sm">{t('accessibilityStatement')} <a href="mailto:info@chatbot.com" className="text-purple-400 underline">{t('letUsKnow')}</a>.</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">{t('everythingYouNeed')}</h2>
            <p className="text-xl text-gray-300">{t('everythingYouNeedDesc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-700 p-6 rounded-xl border border-gray-600 hover:border-purple-500 transition transform hover:scale-105 hover:shadow-xl duration-200 animate-fadein" style={{ animationDelay: `${index * 0.1 + 0.2}s` }}>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="py-20 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">{t('lovedByBusinesses')}</h2>
            <p className="text-xl text-gray-300">{t('lovedByBusinessesDesc')}</p>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 animate-fadein flex flex-col items-center text-center min-h-[200px]">
              <p className="text-gray-300 mb-4 text-lg transition-all duration-500">"{testimonials[testimonialIdx].content}"</p>
              <div>
                <div className="font-semibold text-white">{testimonials[testimonialIdx].name}</div>
                <div className="text-gray-400">{testimonials[testimonialIdx].role}</div>
              </div>
            </div>
            {/* Carousel navigation */}
            <div className="flex justify-center gap-4 mt-6">
              <button aria-label="Previous testimonial" onClick={prevTestimonial} className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 animate-bounce-on-hover">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M13 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {testimonials.map((_, i) => (
                <button key={i} aria-label={`Go to testimonial ${i+1}`} onClick={() => setTestimonialIdx(i)} className={`w-3 h-3 rounded-full border-2 ${testimonialIdx === i ? 'bg-purple-500 border-purple-400' : 'bg-gray-700 border-gray-600'} transition`}></button>
              ))}
              <button aria-label="Next testimonial" onClick={nextTestimonial} className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 animate-bounce-on-hover">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-900 border-t border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">{t('faq')}</h2>
            <p className="text-lg text-gray-300">{t('faqDesc')}</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-800 rounded-lg border border-gray-700">
                <button
                  className="w-full flex justify-between items-center px-6 py-4 text-left text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-expanded={faqOpen === i}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span className={`transform transition-transform duration-200 ${faqOpen === i ? 'rotate-90 text-purple-400' : 'rotate-0 text-gray-400'}`}>▶</span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  className={`px-6 pb-4 text-gray-300 text-sm transition-all duration-300 ${faqOpen === i ? 'block' : 'hidden'}`}
                  aria-hidden={faqOpen !== i}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">{t('readyToStart')}</h2>
          <p className="text-xl text-gray-300 mb-8">
            {t('ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              {t('startFreeTrial')}
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <button 
              onClick={handleContactSales}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition border border-gray-600"
            >
              {t('contactSales')}
            </button>
          </div>
          
          {/* Newsletter Signup */}
          <div className="bg-gray-700 p-6 rounded-xl border border-gray-600">
            <h3 className="text-xl font-semibold text-white mb-2">{t('stayUpdated')}</h3>
            <p className="text-gray-300 mb-4">{t('stayUpdatedDesc')}</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('enterYourEmail')}
                className="flex-1 px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                {t('subscribe')}
              </button>
            </form>
            {isSubscribed && (
              <div className="flex items-center gap-2 text-green-400 mt-2 justify-center">
                <CheckCircleIcon className="h-5 w-5" />
                {t('successfullySubscribed')}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Toast for contact form */}
      {contactToast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{contactToast}</div>
      )}

      {/* Contact Sales Modal */}
      {contactModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
            <button
              onClick={() => setContactModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
              aria-label="Close contact modal"
            >&times;</button>
            <h2 className="text-2xl font-bold text-white mb-6">{t('contactSales')}</h2>
            <form onSubmit={handleContactSubmit} className="space-y-4" aria-label="Contact sales form">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('name')}</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  className={`w-full px-4 py-2 bg-gray-700 border ${contactErrors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400`}
                  placeholder={t('yourName')}
                  aria-label="Name"
                />
                {contactErrors.name && <div className="text-red-400 text-xs mt-1" role="alert">{contactErrors.name}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('email')}</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  className={`w-full px-4 py-2 bg-gray-700 border ${contactErrors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400`}
                  placeholder={t('yourEmail')}
                  aria-label="Email"
                />
                {contactErrors.email && <div className="text-red-400 text-xs mt-1" role="alert">{contactErrors.email}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('message')}</label>
                <textarea
                  value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  className={`w-full px-4 py-2 bg-gray-700 border ${contactErrors.message ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400`}
                  placeholder={t('howCanWeHelp')}
                  rows={4}
                  aria-label="Message"
                />
                {contactErrors.message && <div className="text-red-400 text-xs mt-1" role="alert">{contactErrors.message}</div>}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setContactModal(false)}
                  className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                >{t('cancel')}</button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                  disabled={contactLoading}
                  aria-busy={contactLoading}
                >{contactLoading ? t('sending') : t('send')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <span className="bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 p-2 rounded-2xl shadow-lg">
              <ArrowRightIcon className="h-6 w-6 text-white drop-shadow" />
            </span>
            <span className="text-lg font-extrabold text-white tracking-tight">ChatBot Platform</span>
          </div>
          <div className="flex gap-6 text-gray-400 text-sm">
            <button onClick={() => handleFooterModal('about')} className="hover:text-purple-400 transition">{t('about')}</button>
            <button onClick={() => handleFooterModal('privacy')} className="hover:text-purple-400 transition">{t('privacy')}</button>
            <button onClick={() => handleFooterModal('terms')} className="hover:text-purple-400 transition">{t('terms')}</button>
            <a href="mailto:info@chatbot.com" className="hover:text-purple-400 transition">{t('contact')}</a>
          </div>
          <div className="flex gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-purple-400 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.936 0 .39.045.765.127 1.124C7.728 8.85 4.1 6.884 1.671 3.965c-.427.734-.666 1.584-.666 2.491 0 1.72.875 3.234 2.205 4.122a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-purple-400 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-purple-400 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.25 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
            </a>
          </div>
        </div>
        <div className="text-center text-gray-500 text-xs mt-4 flex flex-col items-center gap-1">
          <span>&copy; {new Date().getFullYear()} {t('chatbotPlatform')}. {t('allRightsReserved')}</span>
          <span className="inline-flex items-center gap-1 mt-1"><svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect width="18" height="18" rx="4" fill="#8B5CF6" fillOpacity="0.15"/><rect x="3" y="3" width="5" height="5" rx="1" fill="#8B5CF6"/><rect x="10" y="3" width="5" height="5" rx="1" fill="#6366F1"/><rect x="3" y="10" width="5" height="5" rx="1" fill="#6366F1"/><rect x="10" y="10" width="5" height="5" rx="1" fill="#8B5CF6"/></svg> {t('builtWith')} <span className="font-semibold text-purple-400">React</span> & <span className="font-semibold text-indigo-400">Vite</span></span>
        </div>
      </footer>

      {/* Modal for Demo, About, Privacy, Terms */}
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

      {/* Sticky CTA Banner */}
      {showCtaBanner && (
        <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center animate-fadein">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-t-2xl shadow-2xl flex items-center gap-4 max-w-xl w-full mx-2 sm:mx-0">
            <span className="font-semibold text-lg">{t('startYourFreeTrial')}</span>
            <Link to="/login" className="ml-auto px-5 py-2 bg-white text-purple-700 rounded-lg font-bold shadow hover:bg-gray-100 transition animate-bounce-on-hover">{t('signUp')}</Link>
            <button onClick={() => setShowCtaBanner(false)} aria-label="Dismiss banner" className="ml-2 text-white/70 hover:text-white text-2xl leading-none focus:outline-none">&times;</button>
          </div>
        </div>
      )}
    </div>
  )
} 