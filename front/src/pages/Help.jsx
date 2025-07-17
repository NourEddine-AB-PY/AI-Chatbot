import { useState, useRef, useEffect } from 'react'
import { 
  MagnifyingGlassIcon, 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  PlayIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  PhoneIcon,
  GlobeAltIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'
import { useLanguage } from '../contexts/LanguageContext'

export default function Help() {
  const { t, isRTL } = useLanguage()

  // Define categories, faqs, and tutorials arrays here (as in previous edit)
  const categories = [
    { name: t('categoryGettingStarted'), icon: PlayIcon, color: 'blue' },
    { name: t('categoryBotSetup'), icon: Cog6ToothIcon, color: 'green' },
    { name: t('categoryIntegrations'), icon: GlobeAltIcon, color: 'purple' },
    { name: t('categoryTeamManagement'), icon: UserGroupIcon, color: 'orange' },
    { name: t('categoryAnalytics'), icon: ChartBarIcon, color: 'indigo' },
    { name: t('categorySecurity'), icon: ShieldCheckIcon, color: 'red' },
  ]
  const faqs = [
    { category: t('categoryGettingStarted'), q: t('faqHowCreateBot'), a: t('faqHowCreateBotAnswer') },
    { category: t('categoryGettingStarted'), q: t('faqWhatChannels'), a: t('faqWhatChannelsAnswer') },
    { category: t('categoryBotSetup'), q: t('faqTrainBot'), a: t('faqTrainBotAnswer') },
    { category: t('categoryBotSetup'), q: t('faqDifferentResponses'), a: t('faqDifferentResponsesAnswer') },
    { category: t('categoryIntegrations'), q: t('faqConnectWhatsApp'), a: t('faqConnectWhatsAppAnswer') },
    { category: t('categoryIntegrations'), q: t('faqWebhookEvents'), a: t('faqWebhookEventsAnswer') },
    { category: t('categoryTeamManagement'), q: t('faqInviteTeamMembers'), a: t('faqInviteTeamMembersAnswer') },
    { category: t('categoryTeamManagement'), q: t('faqUserRoles'), a: t('faqUserRolesAnswer') },
    { category: t('categoryAnalytics'), q: t('faqViewConversationAnalytics'), a: t('faqViewConversationAnalyticsAnswer') },
    { category: t('categoryAnalytics'), q: t('faqExportAnalytics'), a: t('faqExportAnalyticsAnswer') },
    { category: t('categorySecurity'), q: t('faqDataSecurity'), a: t('faqDataSecurityAnswer') },
    { category: t('categorySecurity'), q: t('faqEnableTwoFactorAuth'), a: t('faqEnableTwoFactorAuthAnswer') },
  ]
  const tutorials = [
    { title: t('tutorialGettingStartedTitle'), duration: '5 min', type: 'video', description: t('tutorialGettingStartedDesc') },
    { title: t('tutorialConnectWhatsAppTitle'), duration: '8 min', type: 'video', description: t('tutorialConnectWhatsAppDesc') },
    { title: t('tutorialTrainingBotTitle'), duration: '12 min', type: 'video', description: t('tutorialTrainingBotDesc') },
    { title: t('tutorialTeamPermissionsTitle'), duration: '6 min', type: 'video', description: t('tutorialTeamPermissionsDesc') },
    { title: t('tutorialApiIntegrationTitle'), duration: '15 min', type: 'document', description: t('tutorialApiIntegrationDesc') },
    { title: t('tutorialWebhookConfigTitle'), duration: '10 min', type: 'document', description: t('tutorialWebhookConfigDesc') },
  ]
  
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showContactModal, setShowContactModal] = useState(false)
  const [showFaqModal, setShowFaqModal] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  })
  const [contactErrors, setContactErrors] = useState({})
  const [contactLoading, setContactLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [showChatModal, setShowChatModal] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'agent', text: 'Hi! How can I help you today?' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, showChatModal])

  const handleChatSend = async (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    const msg = { id: Date.now(), sender: 'user', text: chatInput }
    setChatMessages(prev => [...prev, msg])
    setChatInput('')
    setChatLoading(true)
    try {
      const res = await fetch('http://localhost:8000/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: msg.text })
      })
      const data = await res.json()
      if (data.answer) {
        setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'agent', text: data.answer }])
      } else {
        setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'agent', text: 'Sorry, I could not get an answer right now.' }])
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'agent', text: 'Sorry, there was an error connecting to the FAQ agent.' }])
    }
    setChatLoading(false)
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(search.toLowerCase()) || 
                         faq.a.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  function validateContact() {
    const errs = {}
    if (!contactForm.name) errs.name = t('nameRequired')
    if (!contactForm.email) errs.email = t('emailRequired')
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactForm.email)) errs.email = t('invalidEmail')
    if (!contactForm.subject) errs.subject = t('subjectRequired')
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
      setShowContactModal(false)
      setContactForm({ name: '', email: '', subject: '', message: '', priority: 'medium' })
      setToast(t('supportRequestSent'))
      setTimeout(() => setToast(''), 2000)
    }, 1200)
  }

  return (
    <div className={isRTL ? 'text-right' : 'text-left'}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('help')}</h1>
        <p className="text-gray-400">{t('findAnswersAndSupport')}</p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* Search */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchHelp')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => setShowContactModal(true)}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:bg-gray-700 transition text-left"
        >
          <EnvelopeIcon className="h-8 w-8 text-blue-400 mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">{t('contactSupport')}</h3>
          <p className="text-gray-400">{t('contactSupportDesc')}</p>
        </button>
        <button className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:bg-gray-700 transition text-left">
          <BookOpenIcon className="h-8 w-8 text-purple-400 mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">{t('documentation')}</h3>
          <p className="text-gray-400">{t('documentationDesc')}</p>
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">{t('helpCategories')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`p-4 rounded-lg border transition ${
              selectedCategory === 'All'
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {t('all')}
          </button>
          {categories.map(category => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`p-4 rounded-lg border transition ${
                selectedCategory === category.name
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <category.icon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">{t('frequentlyAskedQuestions')}</h2>
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
              <p className="text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tutorials */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">{t('tutorials')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                {tutorial.type === 'video' ? (
                  <VideoCameraIcon className="h-6 w-6 text-red-400" />
                ) : (
                  <DocumentTextIcon className="h-6 w-6 text-blue-400" />
                )}
                <span className="text-sm text-gray-400">{tutorial.duration}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{tutorial.title}</h3>
              <p className="text-gray-400">{tutorial.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
            <button 
              onClick={() => setShowContactModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-white mb-6">{t('contactSupport')}</h2>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t('name')}
                </label>
                <input 
                  type="text" 
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                  placeholder={t('enterYourName')}
                />
                {contactErrors.name && <p className="text-red-400 text-sm mt-1">{contactErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t('email')}
                </label>
                <input 
                  type="email" 
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                  placeholder={t('enterYourEmail')}
                />
                {contactErrors.email && <p className="text-red-400 text-sm mt-1">{contactErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t('subject')}
                </label>
                <input 
                  type="text" 
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                  placeholder={t('enterSubject')}
                />
                {contactErrors.subject && <p className="text-red-400 text-sm mt-1">{contactErrors.subject}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t('message')}
                </label>
                <textarea 
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                  placeholder={t('enterMessage')}
                  rows={4}
                />
                {contactErrors.message && <p className="text-red-400 text-sm mt-1">{contactErrors.message}</p>}
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                  disabled={contactLoading}
                >
                  {contactLoading && (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  )}
                  {contactLoading ? t('sending') : t('send')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Floating Icon */}
      <button
        onClick={() => setShowChatModal(true)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg p-4 z-50 flex items-center justify-center"
        style={{ boxShadow: '0 4px 24px rgba(80,0,200,0.2)' }}
        aria-label="Open FAQ Chat"
      >
        <QuestionMarkCircleIcon className="h-8 w-8" />
      </button>
      {/* Chat Modal (FAQ Chat) */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute bottom-8 right-8 pointer-events-auto">
            <div
              className={`bg-gray-800 rounded-xl shadow-lg w-80 h-96 border border-gray-700 flex flex-col animate-faq-chat-in`}
              style={{ minWidth: '320px', maxWidth: '90vw' }}
            >
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">{t('faqChat')}</h2>
                <button 
                  onClick={() => setShowChatModal(false)} 
                  className="text-gray-400 hover:text-purple-400 text-xl"
                >
                  &times;
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-200'
                      }`}
                    >
                      <div className="text-sm">{message.text}</div>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-700 text-gray-200 flex items-center gap-2">
                      <QuestionMarkCircleIcon className="h-5 w-5 text-purple-400 animate-bounce" />
                      <span className="text-sm">{t('agentTyping') || 'Agent is typing...'}</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleChatSend} className="p-4 border-t border-gray-700 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={t('typeMessage') || 'Type your message...'}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 