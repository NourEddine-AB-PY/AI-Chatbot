import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  PlayIcon, 
  PauseIcon, 
  TrashIcon, 
  PencilIcon,
  EyeIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { useLanguage } from '../contexts/LanguageContext'
import { botsAPI } from '../utils/api'

export default function Bots() {
  const { t, isRTL } = useLanguage()
  const [bots, setBots] = useState([])
  const [selectedBot, setSelectedBot] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [botForm, setBotForm] = useState({
    name: '',
    description: '',
    channels: []
  })
  const [actionModal, setActionModal] = useState({ open: false, type: '', bot: null })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [botSettings, setBotSettings] = useState({
    autoResponse: false,
    analytics: false,
    notifications: false,
    channels: []
  })
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])

  // Helper to fetch bots from backend
  const reloadBots = () => {
    setLoading(true)
    
    botsAPI.getList()
      .then(data => {
        setLoading(false)
        console.log('Bots data received:', data)
        setBots(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        setLoading(false)
        setError(t('failedToLoadBots'))
      })
  }

  // Fetch bots on mount
  useEffect(() => {
    reloadBots()
    // eslint-disable-next-line
  }, [t])

  const handleCreateBot = () => {
    setShowCreateModal(true)
    setBotForm({ name: '', description: '', channels: [] })
  }

  const handleEditBot = (bot) => {
    setSelectedBot(bot)
    setBotForm({
      name: bot.name,
      description: bot.description,
      channels: bot.channels || []
    })
    setShowEditModal(true)
  }

  const handleDeleteBot = (bot) => {
    setSelectedBot(bot)
    setShowDeleteModal(true)
  }

  const handleBotAction = async (bot, action) => {

    switch (action) {
      case 'toggle': {
        setLoading(true)
        try {
          const data = await botsAPI.toggle(bot.id)
          setLoading(false)
          
          // Update local state
          setBots(prev => prev.map(b => b.id === bot.id ? { ...b, status: data.status } : b))
          setToast(`${bot.name} ${data.status === 'active' ? t('activated') : t('paused')}!`)
          setTimeout(() => setToast(''), 2000)
        } catch (err) {
          setLoading(false)
          setError(t('failedToToggleBot'))
        }
        break
      }
      case 'configure': {
        // Reset settings to current bot settings or defaults
        setBotSettings({
          autoResponse: bot.auto_response || false,
          analytics: bot.analytics_enabled || false,
          notifications: bot.notifications_enabled || false,
          channels: bot.channels || []
        })
        setActionModal({ open: true, type: action, bot })
        break
      }
      case 'analytics': {
        setLoading(true)
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/bots/${bot.id}/analytics`, {
            credentials: 'include'
          })
          const data = await res.json()
          setLoading(false)
          
          if (!res.ok) {
            setError(data.error || t('failedToLoadAnalytics'))
            return
          }
          
          setActionModal({ open: true, type: action, bot: { ...bot, analytics: data } })
        } catch (err) {
          setLoading(false)
          setError(t('failedToLoadAnalytics'))
        }
        break
      }
      case 'chat': {
        setChatHistory([]) // Reset chat history for new conversation
        setChatMessage('')
        setActionModal({ open: true, type: action, bot })
        break
      }
      case 'view': {
        setActionModal({ open: true, type: action, bot })
        break
      }
      default:
        break
    }
  }

  const handleSaveBot = (e) => {
    e.preventDefault()
    setLoading(true)
    
    if (showCreateModal) {
      // Create bot
      botsAPI.create({
        name: botForm.name,
        description: botForm.description
      })
        .then(data => {
          setLoading(false)
          setShowCreateModal(false)
          setBotForm({ name: '', description: '', channels: [] })
          setToast(t('botCreated'))
          reloadBots()
          setTimeout(() => setToast(''), 2000)
        })
        .catch((err) => {
          setLoading(false)
          setError(t('failedToCreateBot'))
        })
    } else if (showEditModal && selectedBot) {
      // Update bot
      botsAPI.update(selectedBot.id, {
        name: botForm.name,
        description: botForm.description
      })
        .then(data => {
          setLoading(false)
          setShowEditModal(false)
          setSelectedBot(null)
          setToast(t('botUpdated'))
          reloadBots()
          setTimeout(() => setToast(''), 2000)
        })
        .catch((err) => {
          setLoading(false)
          setError(t('failedToUpdateBot'))
        })
    }
  }

  const handleConfirmDelete = () => {
    if (!selectedBot) return
    setLoading(true)
    
    botsAPI.delete(selectedBot.id)
      .then(() => {
        setLoading(false)
        setShowDeleteModal(false)
        setSelectedBot(null)
        setToast(t('botDeleted'))
        reloadBots()
        setTimeout(() => setToast(''), 2000)
      })
      .catch((err) => {
        setLoading(false)
        setError(t('failedToDeleteBot'))
      })
  }

  const handleChannelToggle = (channel) => {
    setBotForm(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }))
  }

  const closeActionModal = () => setActionModal({ open: false, type: '', bot: null })

  const handleSaveSettings = async () => {
    if (!actionModal.bot) return
    
    setLoading(true)
    try {
      const data = await botsAPI.updateSettings(actionModal.bot.id, botSettings)
      setLoading(false)
      
      setToast(t('settingsSaved'))
      closeActionModal()
      reloadBots()
      setTimeout(() => setToast(''), 2000)
    } catch (err) {
      setLoading(false)
      setError(t('failedToSaveSettings'))
    }
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !actionModal.bot) return
    
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/bots/${actionModal.bot.id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ message: chatMessage })
      })
      const data = await res.json()
      setLoading(false)
      
      if (!res.ok) {
        setError(data.error || t('failedToSendMessage'))
        return
      }
      
      // Add to chat history
      setChatHistory(prev => [...prev, {
        type: 'user',
        message: chatMessage,
        timestamp: new Date().toISOString()
      }, {
        type: 'bot',
        message: data.botResponse,
        timestamp: data.timestamp
      }])
      
      setChatMessage('')
    } catch (err) {
      setLoading(false)
      setError(t('failedToSendMessage'))
    }
  }

  const getActionModalContent = () => {
    const { type, bot } = actionModal
    switch (type) {
      case 'view':
        return {
          title: t('viewBot'),
          content: (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('botName')}</label>
                <div className="text-white">{bot?.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('botDescription')}</label>
                <div className="text-white">{bot?.description}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('status')}</label>
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  bot?.status === 'active' 
                    ? 'bg-green-900/30 text-green-400' 
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {bot?.status === 'active' ? t('active') : t('inactive')}
                </div>
              </div>
            </div>
          )
        }
      case 'configure':
        return {
          title: t('configureBot'),
          content: (
            <div className="space-y-4">
              <p className="text-gray-300">{t('configureBotDescription')}</p>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={botSettings.autoResponse}
                    onChange={(e) => setBotSettings(prev => ({ ...prev, autoResponse: e.target.checked }))}
                  />
                  <span className="text-white">{t('enableAutoResponse')}</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={botSettings.analytics}
                    onChange={(e) => setBotSettings(prev => ({ ...prev, analytics: e.target.checked }))}
                  />
                  <span className="text-white">{t('enableAnalytics')}</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={botSettings.notifications}
                    onChange={(e) => setBotSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                  />
                  <span className="text-white">{t('enableNotifications')}</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={closeActionModal}
                  className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading && (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  )}
                  {loading ? t('saving') : t('save')}
                </button>
              </div>
            </div>
          )
        }
      case 'analytics':
        return {
          title: t('botAnalytics'),
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{bot?.analytics?.totalMessages || 0}</div>
                  <div className="text-sm text-gray-400">{t('totalMessages')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{bot?.analytics?.accuracy || 0}%</div>
                  <div className="text-sm text-gray-400">{t('accuracy')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{bot?.analytics?.totalConversations || 0}</div>
                  <div className="text-sm text-gray-400">{t('conversations')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{bot?.analytics?.avgMessagesPerConversation || 0}</div>
                  <div className="text-sm text-gray-400">{t('avgMessages')}</div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">{t('botStatus')}</h4>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  bot?.analytics?.status === 'active' 
                    ? 'bg-green-900/30 text-green-400' 
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {bot?.analytics?.status === 'active' ? t('active') : t('inactive')}
                </div>
              </div>
            </div>
          )
        }
      case 'chat':
        return {
          title: t('testChat'),
          content: (
            <div className="space-y-4">
              <p className="text-gray-300">{t('testChatDescription')}</p>
              <div className="bg-gray-700 rounded-lg p-4 h-64 overflow-y-auto">
                {chatHistory.length === 0 ? (
                  <div className="text-gray-400 text-sm">{t('chatHistory')}</div>
                ) : (
                  <div className="space-y-3">
                    {chatHistory.map((msg, index) => (
                      <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-3 py-2 rounded-lg ${
                          msg.type === 'user' 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-600 text-white'
                        }`}>
                          <div className="text-sm">{msg.message}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t('typeMessage')}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  disabled={loading}
                />
                <button 
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                  disabled={loading || !chatMessage.trim()}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    t('send')
                  )}
                </button>
              </div>
            </div>
          )
        }
      default:
        return { title: '', content: null }
    }
  }

  return (
    <div className={isRTL ? 'text-right' : 'text-left'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('bots')}</h1>
          <p className="text-gray-400">{t('manageYourBots')}</p>
        </div>
        <button
          onClick={handleCreateBot}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          {t('createNewBot')}
        </button>
      </div>

      {/* Toast notifications */}
      {toast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce">
          {toast}
        </div>
      )}
      {error && (
        <div className="fixed top-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce">
          {error}
        </div>
      )}

      {/* Bots Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-gray-400 mt-4">{t('loading')}</p>
        </div>
      ) : bots.length === 0 ? (
        <div className="text-center py-12">
          <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">{t('noBotsYet')}</h3>
          <p className="text-gray-400 mb-6">{t('createYourFirstBot')}</p>
          <button
            onClick={handleCreateBot}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            {t('createFirstBot')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <div key={bot.id} className="bg-gradient-to-br from-gray-900 via-gray-950 to-purple-900 rounded-2xl shadow-lg border-2 border-purple-700 hover:shadow-2xl transition-shadow duration-200 p-6 relative group">
              {/* Bot Avatar/Icon */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-purple-700 rounded-full p-3 shadow-lg border-4 border-gray-900 group-hover:scale-110 transition-transform">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
              </div>
              <div className="flex flex-col items-center mt-8 mb-4">
                <h3 className="text-2xl font-bold text-white mb-1 text-center">{bot.name}</h3>
                <p className="text-gray-400 text-sm text-center mb-2">{bot.description}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                  bot.status === 'active' 
                    ? 'bg-green-700/80 text-green-200 border border-green-400' 
                    : 'bg-gray-700/80 text-gray-300 border border-gray-500'
                }`}>
                  {bot.status === 'active' ? t('active') : t('inactive')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-400">{bot.messages}</div>
                  <div className="text-xs text-gray-400">{t('messages')}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">{bot.accuracy}%</div>
                  <div className="text-xs text-gray-400">{t('accuracy')}</div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-center gap-3 mt-2">
                <button
                  onClick={() => handleBotAction(bot, 'toggle')}
                  className={`p-2 rounded-full transition-colors shadow-md hover:scale-110 ${
                    bot.status === 'active' 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  title={bot.status === 'active' ? t('pauseBot') : t('activateBot')}
                >
                  {bot.status === 'active' ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => handleBotAction(bot, 'view')}
                  className="p-2 rounded-full bg-gray-700 hover:bg-purple-600 text-white shadow-md hover:scale-110 transition-colors"
                  title={t('viewBot')}
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleEditBot(bot)}
                  className="p-2 rounded-full bg-gray-700 hover:bg-blue-600 text-white shadow-md hover:scale-110 transition-colors"
                  title={t('editBot')}
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteBot(bot)}
                  className="p-2 rounded-full bg-gray-700 hover:bg-red-600 text-white shadow-md hover:scale-110 transition-colors"
                  title={t('deleteBot')}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleBotAction(bot, 'configure')}
                  className="p-2 rounded-full bg-gray-700 hover:bg-yellow-500 text-white shadow-md hover:scale-110 transition-colors"
                  title={t('configureBot')}
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleBotAction(bot, 'analytics')}
                  className="p-2 rounded-full bg-gray-700 hover:bg-green-500 text-white shadow-md hover:scale-110 transition-colors"
                  title={t('botAnalytics')}
                >
                  <ChartBarIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleBotAction(bot, 'chat')}
                  className="p-2 rounded-full bg-gray-700 hover:bg-purple-500 text-white shadow-md hover:scale-110 transition-colors"
                  title={t('testChat')}
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Bot Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
            <button 
              onClick={() => setShowCreateModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-white mb-6">{t('createNewBot')}</h2>
            <form onSubmit={handleSaveBot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t('botName')}
                </label>
                <input 
                  type="text" 
                  value={botForm.name}
                  onChange={(e) => setBotForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                  placeholder={t('enterBotName')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t('botDescription')}
                </label>
                <textarea 
                  value={botForm.description}
                  onChange={(e) => setBotForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                  placeholder={t('enterBotDescription')}
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading && (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  )}
                  {loading ? t('creating') : t('create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Bot Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
            <button 
              onClick={() => setShowEditModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-white mb-6">{t('editBot')}</h2>
            <form onSubmit={handleSaveBot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t('botName')}
                </label>
                <input 
                  type="text" 
                  value={botForm.name}
                  onChange={(e) => setBotForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                  placeholder={t('enterBotName')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t('botDescription')}
                </label>
                <textarea 
                  value={botForm.description}
                  onChange={(e) => setBotForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" 
                  placeholder={t('enterBotDescription')}
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading && (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  )}
                  {loading ? t('saving') : t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">{t('deleteBot')}</h2>
            <p className="text-gray-300 mb-6">
              {t('confirmDeleteBot', { name: selectedBot?.name })}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                {loading ? t('deleting') : t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {actionModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
            <button 
              onClick={closeActionModal} 
              className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-white mb-6">{getActionModalContent().title}</h2>
            {getActionModalContent().content}
            <div className="flex gap-3 pt-4">
              <button 
                onClick={closeActionModal}
                className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 