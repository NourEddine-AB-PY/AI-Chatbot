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

export default function Bots() {
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

  // Fetch bots from backend
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    console.log('Token:', token)
    console.log('User:', user)
    if (!token) {
      console.log('No token found - user not logged in')
      setError('Please log in first')
      return
    }
    setLoading(true)
    fetch('http://localhost:5000/api/bots', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async (res) => {
        const data = await res.json()
        setLoading(false)
        if (!res.ok) {
          console.log('Error loading bots:', data)
          setError(data.error || 'Failed to load bots')
          return
        }
        setBots(prev => [
          {
            ...data,
            _id: data._id || data.id,
            channels: data.channels || [],
            status: data.status || 'inactive',
            messages: data.messages || 0,
            accuracy: data.accuracy || 0
          },
          ...prev
        ])
      })
      .catch((err) => {
        console.log('Error loading bots:', err)
        setLoading(false)
        setError('Failed to load bots')
      })
  }, [])

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

  const handleBotAction = (bot, action) => {
    switch (action) {
      case 'toggle': {
        setBots(prev => prev.map(b => b._id === bot._id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b))
        break
      }
      case 'view':
      case 'configure':
      case 'analytics':
      case 'chat':
        setActionModal({ open: true, type: action, bot })
        break
      default:
        break
    }
  }

  const handleSaveBot = (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    console.log('Token for creating bot:', token)
    if (!token) {
      setError('Please log in first')
      return
    }
    setLoading(true)
    if (showCreateModal) {
      // Create bot
      console.log('Creating bot with data:', { name: botForm.name, description: botForm.description })
      fetch('http://localhost:5000/api/bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          name: botForm.name,
          description: botForm.description
        })
      })
        .then(async (res) => {
          console.log('Response status:', res.status)
          const data = await res.json()
          console.log('Response data:', data)
          setLoading(false)
          if (!res.ok) {
            setError(data.error || 'Failed to create bot')
            return
          }
          setBots(prev => [
            {
              ...data,
              _id: data._id || data.id,
              channels: data.channels || [],
              status: data.status || 'inactive',
              messages: data.messages || 0,
              accuracy: data.accuracy || 0
            },
            ...prev
          ])
          setShowCreateModal(false)
          setBotForm({ name: '', description: '', channels: [] })
          setToast('Bot created!')
          setTimeout(() => setToast(''), 2000)
        })
        .catch((err) => {
          console.log('Error creating bot:', err)
          setLoading(false)
          setError('Failed to create bot')
        })
    } else if (showEditModal && selectedBot) {
      // Update bot
      fetch(`http://localhost:5000/api/bots/${selectedBot._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          name: botForm.name,
          description: botForm.description
        })
      })
        .then(async (res) => {
          const data = await res.json()
          setLoading(false)
          if (!res.ok) {
            setError(data.error || 'Failed to update bot')
            return
          }
          setBots(prev => prev.map(b => b._id === data._id ? data : b))
          setShowEditModal(false)
          setSelectedBot(null)
          setToast('Bot updated!')
          setTimeout(() => setToast(''), 2000)
        })
        .catch((err) => {
          console.log('Error updating bot:', err)
          setLoading(false)
          setError('Failed to update bot')
        })
    }
  }

  const handleConfirmDelete = () => {
    const token = localStorage.getItem('token')
    if (!token || !selectedBot) return
    setLoading(true)
    fetch(`http://localhost:5000/api/bots/${selectedBot._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async (res) => {
        await res.json()
        setLoading(false)
        console.log('Deleted bot with _id:', selectedBot._id)
        // Always re-fetch bots after deletion attempt
        fetch('http://localhost:5000/api/bots', {
          headers: { 'Authorization': 'Bearer ' + token }
        })
          .then(async (res) => {
            const data = await res.json()
            console.log('Bots fetched after deletion:', data)
            setBots(Array.isArray(data) ? data.map(bot => ({
              ...bot,
              _id: bot._id || bot.id,
              channels: bot.channels || [],
              status: bot.status || 'inactive',
              messages: bot.messages || 0,
              accuracy: bot.accuracy || 0
            })) : [])
            setTimeout(() => {
              console.log('Current bots state:', data)
            }, 500)
          })
        setShowDeleteModal(false)
        setSelectedBot(null)
        setToast('Bot deleted!')
        setTimeout(() => setToast(''), 2000)
      })
      .catch((err) => {
        console.log('Error deleting bot:', err)
        setLoading(false)
        // Always re-fetch bots even if there was an error
        fetch('http://localhost:5000/api/bots', {
          headers: { 'Authorization': 'Bearer ' + token }
        })
          .then(async (res) => {
            const data = await res.json()
            console.log('Bots fetched after deletion (error case):', data)
            setBots(Array.isArray(data) ? data.map(bot => ({
              ...bot,
              _id: bot._id || bot.id,
              channels: bot.channels || [],
              status: bot.status || 'inactive',
              messages: bot.messages || 0,
              accuracy: bot.accuracy || 0
            })) : [])
            setTimeout(() => {
              console.log('Current bots state (error case):', data)
            }, 500)
          })
        setShowDeleteModal(false)
        setSelectedBot(null)
        setError('Failed to delete bot (but UI is now synced)')
        setTimeout(() => setError(''), 2000)
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

  const getActionModalContent = () => {
    if (!actionModal.bot) return null
    switch (actionModal.type) {
      case 'view':
        return (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{actionModal.bot.name} Details</h2>
            <p className="text-gray-300 mb-2">{actionModal.bot.description}</p>
            <div className="mb-2">
              <span className="text-gray-400 text-sm">Channels: </span>
              {actionModal.bot.channels.map((c, i) => <span key={i} className="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded mr-1">{c}</span>)}
            </div>
            <div className="mb-2">
              <span className="text-gray-400 text-sm">Status: </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${actionModal.bot.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-gray-600 text-gray-300'}`}>{actionModal.bot.status}</span>
            </div>
            <div className="mb-2">
              <span className="text-gray-400 text-sm">Messages: </span>
              <span className="text-white">{actionModal.bot.messages}</span>
            </div>
            <div className="mb-2">
              <span className="text-gray-400 text-sm">Accuracy: </span>
              <span className="text-white">{actionModal.bot.accuracy}</span>
            </div>
          </div>
        )
      case 'configure':
        return (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Configure {actionModal.bot.name}</h2>
            <p className="text-gray-300 mb-2">Configuration options will be available here.</p>
            <div className="text-gray-400 text-sm">(This is a placeholder for configuration settings.)</div>
          </div>
        )
      case 'analytics':
        return (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{actionModal.bot.name} Analytics</h2>
            <p className="text-gray-300 mb-2">Analytics and charts will be shown here.</p>
            <div className="text-gray-400 text-sm">(This is a placeholder for analytics data.)</div>
          </div>
        )
      case 'chat':
        return (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Live Chat with {actionModal.bot.name}</h2>
            <p className="text-gray-300 mb-2">A live chat interface will be available here.</p>
            <div className="text-gray-400 text-sm">(This is a placeholder for live chat.)</div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {loading && <div className="text-white">Loading...</div>}
      {error && <div className="text-red-400">{error}</div>}
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Bot Management</h1>
        <button
          onClick={handleCreateBot}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          <PlusIcon className="h-5 w-5" />
          Create New Bot
        </button>
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((bot) => (
          <div key={bot._id} className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-1">{bot.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{bot.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    bot.status === 'active' 
                      ? 'bg-green-900/30 text-green-400' 
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {bot.status}
                  </span>
                  <span className="text-gray-400 text-xs">• {bot.lastActive}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleBotAction(bot, 'view')}
                  className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-700 rounded"
                  title="View Details"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEditBot(bot)}
                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded"
                  title="Edit Bot"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteBot(bot)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded"
                  title="Delete Bot"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-700 rounded-lg">
                <div className="text-lg font-bold text-white">{bot.messages}</div>
                <div className="text-xs text-gray-400">Messages</div>
              </div>
              <div className="text-center p-3 bg-gray-700 rounded-lg">
                <div className="text-lg font-bold text-white">{bot.accuracy}</div>
                <div className="text-xs text-gray-400">Accuracy</div>
              </div>
            </div>

            {/* Channels */}
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">Connected Channels:</div>
              <div className="flex flex-wrap gap-1">
                {bot.channels.map((channel, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded">
                    {channel}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBotAction(bot, 'toggle')}
                className={`flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition ${
                  bot.status === 'active'
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {bot.status === 'active' ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                {bot.status === 'active' ? 'Pause' : 'Activate'}
              </button>
              <button
                onClick={() => handleBotAction(bot, 'configure')}
                className="flex items-center gap-1 px-3 py-2 bg-gray-700 text-gray-200 rounded text-sm font-medium hover:bg-gray-600 transition"
              >
                <Cog6ToothIcon className="h-4 w-4" />
                Configure
              </button>
              <button
                onClick={() => handleBotAction(bot, 'analytics')}
                className="flex items-center gap-1 px-3 py-2 bg-gray-700 text-gray-200 rounded text-sm font-medium hover:bg-gray-600 transition"
              >
                <ChartBarIcon className="h-4 w-4" />
                Analytics
              </button>
              <button
                onClick={() => handleBotAction(bot, 'chat')}
                className="flex items-center gap-1 px-3 py-2 bg-gray-700 text-gray-200 rounded text-sm font-medium hover:bg-gray-600 transition"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                Chat
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Bot Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
            <button 
              onClick={() => { setShowCreateModal(false); setShowEditModal(false); setSelectedBot(null); }} 
              className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-white mb-6">
              {showCreateModal ? 'Create New Bot' : 'Edit Bot'}
            </h2>
            <form onSubmit={handleSaveBot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Bot Name</label>
                <input
                  type="text"
                  value={botForm.name}
                  onChange={(e) => setBotForm({...botForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Enter bot name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={botForm.description}
                  onChange={(e) => setBotForm({...botForm, description: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Describe what this bot does"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Channels</label>
                <div className="space-y-2">
                  {['WhatsApp', 'Facebook', 'Instagram', 'Website', 'Telegram'].map((channel) => (
                    <label key={channel} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={botForm.channels.includes(channel)}
                        onChange={() => handleChannelToggle(channel)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-700"
                      />
                      <span className="ml-2 text-gray-300">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => { setShowCreateModal(false); setShowEditModal(false); setSelectedBot(null); }}
                  className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  {showCreateModal ? 'Create Bot' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Delete Bot</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <strong>{selectedBot.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Delete Bot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal for View, Configure, Analytics, Chat */}
      {actionModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
            <button 
              onClick={closeActionModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
            >
              &times;
            </button>
            {getActionModalContent()}
          </div>
        </div>
      )}
    </div>
  )
} 