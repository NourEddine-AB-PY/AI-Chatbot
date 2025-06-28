import { useState } from 'react'
import { CheckCircleIcon, XCircleIcon, ArrowRightIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

const initialIntegrations = [
  {
    id: 1,
    name: 'WhatsApp Business API',
    description: 'Connect your WhatsApp Business account to send and receive messages',
    status: 'connected',
    icon: '📱',
    color: 'green'
  },
  {
    id: 2,
    name: 'Facebook Messenger',
    description: 'Integrate with Facebook Messenger for customer support',
    status: 'connected',
    icon: '💬',
    color: 'blue'
  },
  {
    id: 3,
    name: 'Instagram Direct Messages',
    description: 'Connect Instagram DMs to your chatbot',
    status: 'disconnected',
    icon: '📸',
    color: 'pink'
  },
  {
    id: 4,
    name: 'Slack',
    description: 'Send notifications and alerts to Slack channels',
    status: 'disconnected',
    icon: '💼',
    color: 'purple'
  },
  {
    id: 5,
    name: 'Email',
    description: 'Send automated email responses and notifications',
    status: 'connected',
    icon: '📧',
    color: 'gray'
  },
  {
    id: 6,
    name: 'Webhook',
    description: 'Custom webhook integration for advanced use cases',
    status: 'disconnected',
    icon: '🔗',
    color: 'orange'
  }
]

export default function Integrations() {
  const [integrations, setIntegrations] = useState(initialIntegrations)
  const [showModal, setShowModal] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState(null)
  const [apiKey, setApiKey] = useState('')
  const [webhook, setWebhook] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [apiKeyError, setApiKeyError] = useState('')
  const [disconnectingId, setDisconnectingId] = useState(null)
  const [showApiKeyTip, setShowApiKeyTip] = useState(false)
  const [showWebhookTip, setShowWebhookTip] = useState(false)
  const [fbLoading, setFbLoading] = useState(false)

  const handleConnect = (integration) => {
    setSelectedIntegration(integration)
    setApiKey('')
    setWebhook('')
    setApiKeyError('')
    setShowModal(true)
  }

  const handleDisconnect = (integration) => {
    setDisconnectingId(integration.id)
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => i.id === integration.id ? { ...i, status: 'disconnected' } : i))
      setDisconnectingId(null)
      setToast(`${integration.name} disconnected!`)
      setTimeout(() => setToast(''), 2000)
    }, 1000)
  }

  const handleModalConnect = (e) => {
    e.preventDefault()
    if (!apiKey) {
      setApiKeyError('API key is required.')
      return
    }
    setApiKeyError('')
    setLoading(true)
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => i.id === selectedIntegration.id ? { ...i, status: 'connected' } : i))
      setLoading(false)
      setShowModal(false)
      setToast(`${selectedIntegration.name} connected!`)
      setTimeout(() => setToast(''), 2000)
    }, 1200)
  }

  const handleFacebookConnect = async () => {
    setFbLoading(true)
    setToast('Redirecting to Facebook...')
    setTimeout(() => {
      setFbLoading(false)
      setToast('Facebook connected! (placeholder)')
      setIntegrations(prev => prev.map(i => i.name === 'Facebook Messenger' ? { ...i, status: 'connected' } : i))
      setTimeout(() => setToast(''), 2000)
    }, 1500)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Integrations</h1>
        <p className="text-gray-400">Connect your chatbot to external platforms and services</p>
      </div>

      {toast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{toast}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadein">
        {integrations.map(integration => (
          <div key={integration.id} className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{integration.icon}</div>
                <div>
                  <h3 className="font-semibold text-white">{integration.name}</h3>
                  <p className="text-sm text-gray-400">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {integration.status === 'connected' ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                integration.status === 'connected' 
                  ? 'bg-green-900/30 text-green-400' 
                  : 'bg-gray-700 text-gray-300'
              }`}>
                {integration.status === 'connected' ? 'Connected' : 'Not Connected'}
              </span>
              {integration.name === 'Facebook Messenger' ? (
                <button
                  onClick={handleFacebookConnect}
                  className={`flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium ${fbLoading ? 'opacity-60 pointer-events-none' : ''}`}
                  aria-label="Connect Facebook Messenger"
                  disabled={fbLoading || integration.status === 'connected'}
                >
                  {fbLoading ? (
                    <svg className="animate-spin h-4 w-4 text-blue-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  ) : 'Connect with Facebook'}
                </button>
              ) : integration.status === 'connected' ? (
                <button
                  onClick={() => handleDisconnect(integration)}
                  className={`text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-2 ${disconnectingId === integration.id ? 'opacity-60 pointer-events-none' : ''}`}
                  aria-label={`Disconnect ${integration.name}`}
                  disabled={disconnectingId === integration.id}
                >
                  {disconnectingId === integration.id && (
                    <svg className="animate-spin h-4 w-4 text-red-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  )}
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(integration)}
                  className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm font-medium"
                  aria-label={`Connect ${integration.name}`}
                >
                  Connect
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Connection Modal */}
      {showModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadein">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
              aria-label="Close modal"
            >
              &times;
            </button>
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">{selectedIntegration.icon}</div>
              <h2 className="text-xl font-bold text-white mb-2">Connect {selectedIntegration.name}</h2>
              <p className="text-gray-400">{selectedIntegration.description}</p>
            </div>
            <form onSubmit={handleModalConnect} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1">
                  API Key
                  <span
                    onMouseEnter={() => setShowApiKeyTip(true)}
                    onMouseLeave={() => setShowApiKeyTip(false)}
                    onFocus={() => setShowApiKeyTip(true)}
                    onBlur={() => setShowApiKeyTip(false)}
                    tabIndex={0}
                    className="inline-flex items-center cursor-pointer"
                  >
                    <InformationCircleIcon className="h-4 w-4 text-purple-400" />
                  </span>
                </label>
                <input 
                  type="password" 
                  placeholder="Enter your API key" 
                  className={`w-full px-4 py-2 bg-gray-700 border ${apiKeyError ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400`} 
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  aria-label="API key"
                />
                {showApiKeyTip && (
                  <span className="absolute left-0 top-10 bg-gray-800 text-gray-200 text-xs rounded px-2 py-1 shadow border border-gray-700 z-20 animate-fadein" role="tooltip">
                    Your API key is provided by the integration platform. Keep it secret!
                  </span>
                )}
                {apiKeyError && <div className="text-red-400 text-xs mt-1" role="alert">{apiKeyError}</div>}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1">
                  Webhook URL (Optional)
                  <span
                    onMouseEnter={() => setShowWebhookTip(true)}
                    onMouseLeave={() => setShowWebhookTip(false)}
                    onFocus={() => setShowWebhookTip(true)}
                    onBlur={() => setShowWebhookTip(false)}
                    tabIndex={0}
                    className="inline-flex items-center cursor-pointer"
                  >
                    <InformationCircleIcon className="h-4 w-4 text-purple-400" />
                  </span>
                </label>
                <input 
                  type="url" 
                  placeholder="https://your-domain.com/webhook" 
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400" 
                  value={webhook}
                  onChange={e => setWebhook(e.target.value)}
                  aria-label="Webhook URL"
                />
                {showWebhookTip && (
                  <span className="absolute left-0 top-10 bg-gray-800 text-gray-200 text-xs rounded px-2 py-1 shadow border border-gray-700 z-20 animate-fadein" role="tooltip">
                    The webhook URL is where events will be sent. Optional for most integrations.
                  </span>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading && (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  )}
                  {loading ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 