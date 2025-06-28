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

const categories = [
  { name: 'Getting Started', icon: PlayIcon, color: 'blue' },
  { name: 'Bot Setup', icon: Cog6ToothIcon, color: 'green' },
  { name: 'Integrations', icon: GlobeAltIcon, color: 'purple' },
  { name: 'Team Management', icon: UserGroupIcon, color: 'orange' },
  { name: 'Analytics', icon: ChartBarIcon, color: 'indigo' },
  { name: 'Security', icon: ShieldCheckIcon, color: 'red' },
]

const faqs = [
  { 
    category: 'Getting Started',
    q: 'How do I create my first chatbot?', 
    a: 'Go to the Bots page, click "Create New Bot", give it a name and description, then configure its responses and connect it to your preferred channels.' 
  },
  { 
    category: 'Getting Started',
    q: 'What channels can I connect my bot to?', 
    a: 'Currently supported channels include WhatsApp Business API, Facebook Messenger, Instagram Direct Messages, and web chat widgets.' 
  },
  { 
    category: 'Bot Setup',
    q: 'How do I train my bot with custom responses?', 
    a: 'Navigate to Settings > Bots > AI Training, upload your knowledge base documents or add conversation examples to improve bot responses.' 
  },
  { 
    category: 'Bot Setup',
    q: 'Can I set different responses for different languages?', 
    a: 'Yes, you can configure multi-language responses in your bot settings. The bot will automatically detect the user\'s language and respond accordingly.' 
  },
  { 
    category: 'Integrations',
    q: 'How do I connect WhatsApp Business API?', 
    a: 'Go to Settings > Integrations, click on WhatsApp, follow the setup wizard to connect your WhatsApp Business account and verify your phone number.' 
  },
  { 
    category: 'Integrations',
    q: 'What webhook events are available?', 
    a: 'Available webhook events include: message_received, message_sent, bot_status_changed, user_joined, and conversation_ended.' 
  },
  { 
    category: 'Team Management',
    q: 'How do I invite team members?', 
    a: 'Go to Settings > Team, click "Invite Member", enter their email address, assign a role (Admin, Manager, or Agent), and send the invitation.' 
  },
  { 
    category: 'Team Management',
    q: 'What are the different user roles?', 
    a: 'Admin: Full access to all features. Manager: Can manage bots and view analytics. Agent: Can only respond to conversations and view assigned chats.' 
  },
  { 
    category: 'Analytics',
    q: 'How do I view conversation analytics?', 
    a: 'Go to the Stats page to view detailed analytics including message volume, response times, customer satisfaction scores, and bot performance metrics.' 
  },
  { 
    category: 'Analytics',
    q: 'Can I export my analytics data?', 
    a: 'Yes, you can export analytics data in CSV or JSON format. Go to Stats page and click the export button in the top right corner.' 
  },
  { 
    category: 'Security',
    q: 'How secure is my data?', 
    a: 'We use enterprise-grade encryption, secure API keys, and comply with GDPR and SOC 2 standards. All data is encrypted in transit and at rest.' 
  },
  { 
    category: 'Security',
    q: 'How do I enable two-factor authentication?', 
    a: 'Go to Settings > Security, choose between SMS or authenticator app, and follow the setup instructions to enable 2FA for your account.' 
  },
]

const tutorials = [
  {
    title: 'Getting Started with ChatBot Platform',
    duration: '5 min',
    type: 'video',
    description: 'Learn the basics of setting up your first chatbot'
  },
  {
    title: 'Connecting WhatsApp Business API',
    duration: '8 min',
    type: 'video',
    description: 'Step-by-step guide to connect your WhatsApp account'
  },
  {
    title: 'Training Your Bot with AI',
    duration: '12 min',
    type: 'video',
    description: 'How to improve bot responses with custom training data'
  },
  {
    title: 'Setting Up Team Permissions',
    duration: '6 min',
    type: 'video',
    description: 'Configure roles and permissions for your team'
  },
  {
    title: 'API Integration Guide',
    duration: '15 min',
    type: 'document',
    description: 'Complete guide to integrating with our REST API'
  },
  {
    title: 'Webhook Configuration',
    duration: '10 min',
    type: 'document',
    description: 'Set up webhooks to receive real-time updates'
  },
]

export default function Help() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showContactModal, setShowContactModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
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
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'agent', text: 'Hi! How can I help you today?' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatClosed, setChatClosed] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, showChatModal])

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(search.toLowerCase()) || 
                         faq.a.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  function validateContact() {
    const errs = {}
    if (!contactForm.name) errs.name = 'Name is required.'
    if (!contactForm.email) errs.email = 'Email is required.'
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactForm.email)) errs.email = 'Invalid email.'
    if (!contactForm.subject) errs.subject = 'Subject is required.'
    if (!contactForm.message) errs.message = 'Message is required.'
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
      setToast('Support request sent!')
      setTimeout(() => setToast(''), 2000)
    }, 1200)
  }

  const handleChatSend = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    const msg = { id: Date.now(), sender: 'user', text: chatInput }
    setChatMessages(prev => [...prev, msg])
    setChatInput('')
    setChatLoading(true)
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'agent', text: 'Thanks for your message! A support agent will reply soon.' }])
      setChatLoading(false)
    }, 1200)
  }

  const handleCloseChat = () => {
    setShowChatModal(false)
    setChatClosed(true)
    setTimeout(() => setChatClosed(false), 2000)
    setToast('Chat closed!')
    setTimeout(() => setToast(''), 2000)
    setChatMessages([{ id: 1, sender: 'agent', text: 'Hi! How can I help you today?' }])
    setChatInput('')
  }

  return (
    <div className="max-w-6xl mx-auto animate-fadein">
      <h1 className="text-3xl font-bold text-white mb-8">Help & Support Center</h1>
      {toast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{toast}</div>
      )}
      {/* Search Bar */}
      <div className="bg-gray-800 rounded-xl shadow p-6 mb-8 border border-gray-700">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search for help articles, tutorials, or FAQs..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400" 
              aria-label="Search help"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button 
          onClick={() => setShowContactModal(true)}
          className="flex items-center gap-3 p-4 bg-gray-800 rounded-xl shadow hover:shadow-lg transition border border-gray-700"
          aria-label="Contact support"
        >
          <EnvelopeIcon className="h-8 w-8 text-purple-400" />
          <div className="text-left">
            <div className="font-semibold text-white">Contact Support</div>
            <div className="text-sm text-gray-400">Get help from our team</div>
          </div>
        </button>
        <button 
          onClick={() => setShowChatModal(true)}
          className="flex items-center gap-3 p-4 bg-gray-800 rounded-xl shadow hover:shadow-lg transition border border-gray-700"
          aria-label="Live chat"
        >
          <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-400" />
          <div className="text-left">
            <div className="font-semibold text-white">Live Chat</div>
            <div className="text-sm text-gray-400">Chat with support agent</div>
          </div>
        </button>
        <a 
          href="tel:+1-800-CHATBOT"
          className="flex items-center gap-3 p-4 bg-gray-800 rounded-xl shadow hover:shadow-lg transition border border-gray-700"
          aria-label="Call support"
        >
          <PhoneIcon className="h-8 w-8 text-blue-400" />
          <div className="text-left">
            <div className="font-semibold text-white">Call Us</div>
            <div className="text-sm text-gray-400">+1-800-CHATBOT</div>
          </div>
        </a>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`p-4 rounded-xl border-2 transition ${
              selectedCategory === 'All' 
                ? 'border-purple-500 bg-purple-900/20' 
                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
            }`}
          >
            <div className="text-center">
              <QuestionMarkCircleIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <div className="font-medium text-sm text-white">All Topics</div>
            </div>
          </button>
          {categories.map(category => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`p-4 rounded-xl border-2 transition ${
                selectedCategory === category.name 
                  ? 'border-purple-500 bg-purple-900/20' 
                  : 'border-gray-600 bg-gray-800 hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <category.icon className={`h-8 w-8 text-${category.color}-400 mx-auto mb-2`} />
                <div className="font-medium text-sm text-white">{category.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-gray-800 rounded-xl shadow p-6 mb-8 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <details key={index} className="border border-gray-600 rounded-lg">
              <summary className="p-4 cursor-pointer hover:bg-gray-700 font-medium text-gray-200">
                {faq.q}
              </summary>
              <div className="p-4 pt-0 text-gray-300 border-t border-gray-600">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
        {filteredFaqs.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No questions found matching your search criteria.
          </div>
        )}
      </div>

      {/* Tutorials & Documentation */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Tutorials & Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutorials.map((tutorial, index) => (
            <div key={index} className="bg-gray-800 rounded-xl shadow p-4 hover:shadow-lg transition border border-gray-700">
              <div className="flex items-start justify-between mb-3">
                {tutorial.type === 'video' ? (
                  <VideoCameraIcon className="h-6 w-6 text-red-400" />
                ) : (
                  <DocumentTextIcon className="h-6 w-6 text-purple-400" />
                )}
                <span className="text-xs text-gray-400">{tutorial.duration}</span>
              </div>
              <h3 className="font-semibold text-white mb-2">{tutorial.title}</h3>
              <p className="text-sm text-gray-400 mb-3">{tutorial.description}</p>
              <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                {tutorial.type === 'video' ? 'Watch Video' : 'Read Guide'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadein">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
            <button 
              onClick={() => setShowContactModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
              aria-label="Close contact modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Contact Support</h2>
            <form onSubmit={handleContactSubmit} className="space-y-4" aria-label="Contact support form">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  className={`w-full px-4 py-2 bg-gray-700 border ${contactErrors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400`}
                  placeholder="Your name"
                  aria-label="Name"
                />
                {contactErrors.name && <div className="text-red-400 text-xs mt-1" role="alert">{contactErrors.name}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  className={`w-full px-4 py-2 bg-gray-700 border ${contactErrors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400`}
                  placeholder="you@email.com"
                  aria-label="Email"
                />
                {contactErrors.email && <div className="text-red-400 text-xs mt-1" role="alert">{contactErrors.email}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                  className={`w-full px-4 py-2 bg-gray-700 border ${contactErrors.subject ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400`}
                  placeholder="Subject"
                  aria-label="Subject"
                />
                {contactErrors.subject && <div className="text-red-400 text-xs mt-1" role="alert">{contactErrors.subject}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  className={`w-full px-4 py-2 bg-gray-700 border ${contactErrors.message ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400`}
                  placeholder="How can we help you?"
                  rows={4}
                  aria-label="Message"
                />
                {contactErrors.message && <div className="text-red-400 text-xs mt-1" role="alert">{contactErrors.message}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                <select
                  value={contactForm.priority}
                  onChange={e => setContactForm({ ...contactForm, priority: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  aria-label="Priority"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                  disabled={contactLoading}
                  aria-busy={contactLoading}
                >
                  {contactLoading && (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  )}
                  {contactLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadein">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700 flex flex-col">
            <button
              onClick={handleCloseChat}
              className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
              aria-label="Close chat modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-white mb-4">Live Chat with Support</h2>
            <div className="flex-1 overflow-y-auto mb-4 max-h-64" aria-live="polite">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadein mb-2`}>
                  <div className={`px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start animate-fadein mb-2">
                  <div className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 flex items-center gap-2">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-400 animate-bounce" />
                    <span className="text-sm">Agent is typing...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleChatSend} className="flex gap-2" aria-label="Send chat message">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                aria-label="Type your message"
                disabled={chatLoading}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                aria-label="Send message"
                disabled={!chatInput.trim() || chatLoading}
              >
                <PaperAirplaneIcon className="h-5 w-5" />
                Send
              </button>
            </form>
          </div>
        </div>
      )}
      {chatClosed && (
        <div className="fixed top-20 right-6 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">Chat closed!</div>
      )}
    </div>
  )
} 