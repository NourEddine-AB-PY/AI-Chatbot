import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  PlusIcon, 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import StatsCard from '../components/StatsCard'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const checklist = [
  { label: 'Connect a channel', done: true },
  { label: 'Create your first bot', done: false },
  { label: 'Invite your team', done: false },
]

const conversations = [
  { name: 'John Doe', last: 'Thank you for your help!', time: '2m ago' },
  { name: 'Jane Smith', last: 'How do I reset my password?', time: '10m ago' },
]

const quickActions = [
  { name: 'Create New Bot', icon: PlusIcon, to: '/bots', color: 'purple' },
  { name: 'View Analytics', icon: ChartBarIcon, to: '/stats', color: 'blue' },
  { name: 'Manage Team', icon: UserGroupIcon, to: '/settings', color: 'green' },
  { name: 'Live Chat', icon: ChatBubbleLeftRightIcon, to: '/live-chat', color: 'orange' },
]

const recentActivity = [
  { 
    id: 1,
    type: 'bot_created', 
    title: 'New bot "SupportBot" created', 
    time: '2 minutes ago',
    action: 'view'
  },
  { 
    id: 2,
    type: 'message_received', 
    title: '15 new messages from WhatsApp', 
    time: '10 minutes ago',
    action: 'respond'
  },
  { 
    id: 3,
    type: 'integration_connected', 
    title: 'Facebook Messenger connected', 
    time: '1 hour ago',
    action: 'configure'
  },
  { 
    id: 4,
    type: 'bot_trained', 
    title: 'Bot training completed', 
    time: '2 hours ago',
    action: 'review'
  },
]

const messageData = [
  { name: 'Mon', messages: 200 },
  { name: 'Tue', messages: 300 },
  { name: 'Wed', messages: 250 },
  { name: 'Thu', messages: 400 },
  { name: 'Fri', messages: 350 },
  { name: 'Sat', messages: 500 },
  { name: 'Sun', messages: 450 },
];

export default function Dashboard() {
  const [selectedBot, setSelectedBot] = useState(null)
  const [showBotModal, setShowBotModal] = useState(false)
  const [toast, setToast] = useState('')
  const [showCustomize, setShowCustomize] = useState(false)
  const [showActivityLog, setShowActivityLog] = useState(false)
  const [dashboardBots, setDashboardBots] = useState([])
  const [dashboardActivity, setDashboardActivity] = useState([...recentActivity])
  const [deleteBotModal, setDeleteBotModal] = useState({ open: false, bot: null })
  const [botForm, setBotForm] = useState({ name: '', description: '' })
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch bots from backend
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    setLoading(true)
    fetch('http://localhost:5000/api/bots', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async (res) => {
        const data = await res.json()
        setLoading(false)
        if (!res.ok) {
          setError(data.error || 'Failed to load bots')
          return
        }
        setDashboardBots(data)
      })
      .catch(() => {
        setLoading(false)
        setError('Failed to load bots')
      })
  }, [])

  const handleQuickAction = (action) => {
    if (action.to) return
    if (action.name === 'Create New Bot') {
      setShowBotModal(true)
      setSelectedBot(null)
    } else if (action.name === 'Customize Dashboard') {
      setShowCustomize(true)
    }
  }

  const handleActivityAction = (activity) => {
    setShowActivityLog(true)
  }

  const handleBotAction = (bot, action) => {
    switch (action) {
      case 'toggle': {
        // Local toggle only (not persisted)
        setDashboardBots(prev => prev.map(b => b._id === bot._id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b))
        setToast(`${bot.name} ${bot.status === 'active' ? 'paused' : 'activated'}!`)
        setTimeout(() => setToast(''), 2000)
        break
      }
      case 'view':
        setSelectedBot(bot)
        setShowBotModal(true)
        setIsEdit(false)
        break
      case 'edit':
        setSelectedBot(bot)
        setBotForm({ name: bot.name, description: bot.description })
        setShowBotModal(true)
        setIsEdit(true)
        break
      case 'delete':
        setDeleteBotModal({ open: true, bot })
        break
      default:
        setToast(`Action: ${action} on ${bot.name}`)
        setTimeout(() => setToast(''), 2000)
    }
  }

  const handleCreateBot = () => {
    setShowBotModal(true)
    setSelectedBot(null)
    setBotForm({ name: '', description: '' })
    setIsEdit(false)
  }

  const handleSaveBot = (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) return
    setLoading(true)
    if (isEdit && selectedBot) {
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
          setDashboardBots(prev => prev.map(b => b._id === data._id ? data : b))
          setShowBotModal(false)
          setToast('Bot updated!')
          setTimeout(() => setToast(''), 2000)
        })
        .catch(() => {
          setLoading(false)
          setError('Failed to update bot')
        })
    } else {
      // Create bot
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
          const data = await res.json()
          setLoading(false)
          if (!res.ok) {
            setError(data.error || 'Failed to create bot')
            return
          }
          setDashboardBots(prev => [data, ...prev])
          setShowBotModal(false)
          setToast('Bot created!')
          setTimeout(() => setToast(''), 2000)
        })
        .catch(() => {
          setLoading(false)
          setError('Failed to create bot')
        })
    }
  }

  const handleDeleteBotConfirm = () => {
    const token = localStorage.getItem('token')
    if (!token || !deleteBotModal.bot) return
    setLoading(true)
    fetch(`http://localhost:5000/api/bots/${deleteBotModal.bot._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async (res) => {
        await res.json()
        setLoading(false)
        setDashboardBots(prev => prev.filter(b => b._id !== deleteBotModal.bot._id))
        setDeleteBotModal({ open: false, bot: null })
        setToast('Bot deleted!')
        setTimeout(() => setToast(''), 2000)
      })
      .catch(() => {
        setLoading(false)
        setError('Failed to delete bot')
      })
  }

  const handleViewAllActivity = () => {
    setShowActivityLog(true)
  }

  const lastUpdated = new Date().toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 32 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-purple-900 p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        <StatsCard icon="💬" value="1,245" label="Messages Handled" trend="up" trendValue="📈" color="blue" />
        <StatsCard icon="😊" value="98%" label="Customer Satisfaction" trend="up" trendValue="⬆️" color="green" />
        <StatsCard icon="🔗" value="3" label="Connected Channels" trend="up" trendValue="🟢" color="purple" />
        <div className="bg-gradient-to-br from-purple-800/80 to-gray-900/80 rounded-xl shadow p-6 flex flex-col items-center border border-purple-700 hover:shadow-2xl transition-shadow duration-200">
          <span className="text-4xl mb-2">✨</span>
          <div className="text-lg font-bold text-white mb-1">What's New</div>
          <div className="text-gray-200 text-center">You can now manage bots, view analytics, and chat live with your customers—all in one place!</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center border border-gray-700 col-span-2 mt-6">
        <div className="flex items-center justify-between w-full mb-4">
          <span className="text-xl font-bold text-blue-400">Messages Handled (Weekly)</span>
          <span className="text-gray-400 text-sm">Last 7 days</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={messageData}>
            <XAxis dataKey="name" stroke="#8884d8" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="messages" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* Get Started Checklist */}
        <div className="bg-gray-800/90 rounded-xl shadow p-6 border border-gray-700 flex flex-col">
          <div className="font-bold mb-2 flex items-center gap-2 text-white"><PlusIcon className="h-5 w-5 text-purple-400" />Get Started Checklist</div>
          <ul className="space-y-2">
            {checklist.map(item => (
              <li key={item.label} className="flex items-center gap-2 text-gray-300">
                {item.done ? <CheckCircleIcon className="h-5 w-5 text-green-400" /> : <span className="inline-block w-5 h-5 border-2 border-gray-600 rounded-full" />}
                {item.label}
              </li>
            ))}
          </ul>
        </div>
        {/* Recent Conversations */}
        <div className="bg-gray-800/90 rounded-xl shadow p-6 border border-gray-700 flex flex-col">
          <div className="font-bold mb-2 flex items-center gap-2 text-white"><ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-400" />Recent Conversations</div>
          <ul className="divide-y divide-gray-700">
            {conversations.map(conv => (
              <li key={conv.name} className="py-3 flex justify-between items-center">
                <span className="font-semibold text-gray-200">{conv.name}</span>
                <span className="text-gray-400 text-sm">{conv.last}</span>
                <span className="text-xs text-gray-500">{conv.time}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Quick Actions */}
        <div className="bg-gray-800/90 rounded-xl shadow p-6 border border-gray-700 flex flex-col">
          <div className="font-bold mb-2 flex items-center gap-2 text-white">Quick Actions</div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.to}
                className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition border border-gray-600"
              >
                <action.icon className={`h-6 w-6 text-${action.color}-400`} />
                <span className="font-medium text-white">{action.name}</span>
              </Link>
            ))}
          </div>
          <button
            onClick={() => setShowCustomize(true)}
            className="mt-4 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition self-end"
          >
            Customize Dashboard
          </button>
        </div>
        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700 flex flex-col md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <button
              onClick={handleViewAllActivity}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {dashboardActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.title}</p>
                  <p className="text-gray-400 text-sm">{activity.time}</p>
                </div>
                <button
                  onClick={() => handleActivityAction(activity)}
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium capitalize"
                >
                  {activity.action}
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Active Bots */}
        <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700 flex flex-col md:col-span-2 lg:col-span-1">
          <h2 className="text-xl font-bold text-white mb-6">Your Bots</h2>
          <div className="space-y-4">
            {dashboardBots.map((bot) => (
              <div key={bot._id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-medium">{bot.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      bot.status === 'active' 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {bot.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{bot.messages} messages • {bot.accuracy} accuracy</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBotAction(bot, 'view')}
                    className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-600 rounded"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleBotAction(bot, 'toggle')}
                    className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-gray-600 rounded"
                  >
                    {bot.status === 'active' ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleBotAction(bot, 'delete')}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/bots"
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mt-4 font-medium"
          >
            View All Bots
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Bot Details Modal */}
      {showBotModal && selectedBot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
            <button 
              onClick={() => setShowBotModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-white mb-4">{selectedBot.name} Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedBot.status === 'active' 
                    ? 'bg-green-900/30 text-green-400' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {selectedBot.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Total Messages</label>
                <p className="text-white">{selectedBot.messages}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Accuracy</label>
                <p className="text-white">{selectedBot.accuracy}</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowBotModal(false)}
                  className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Close
                </button>
                <Link
                  to="/bots"
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition text-center"
                >
                  Edit Bot
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{toast}</div>
      )}

      {/* Customize Dashboard Modal */}
      {showCustomize && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
            <button onClick={() => setShowCustomize(false)} className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl" aria-label="Close customize modal">&times;</button>
            <h2 className="text-xl font-bold text-white mb-4">Customize Dashboard</h2>
            <div className="text-gray-300 mb-4">Personalize your dashboard layout and widgets. (This is a placeholder for customization options.)</div>
            <button onClick={() => setShowCustomize(false)} className="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">Close</button>
          </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {showActivityLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-2xl relative border border-gray-700">
            <button onClick={() => setShowActivityLog(false)} className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl" aria-label="Close activity log">&times;</button>
            <h2 className="text-xl font-bold text-white mb-4">Full Activity Log</h2>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {dashboardActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.title}</p>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                  <span className="text-purple-400 text-sm font-medium capitalize">{activity.action}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowActivityLog(false)} className="w-full mt-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">Close</button>
          </div>
        </div>
      )}

      {/* Delete Bot Modal */}
      {deleteBotModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
            <button onClick={() => setDeleteBotModal({ open: false, bot: null })} className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl" aria-label="Close delete bot modal">&times;</button>
            <h2 className="text-xl font-bold text-white mb-4">Delete Bot</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to delete <strong>{deleteBotModal.bot?.name}</strong>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteBotModal({ open: false, bot: null })} className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition">Cancel</button>
              <button onClick={handleDeleteBotConfirm} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">Delete Bot</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} ChatBot Platform &mdash; All rights reserved.<br />
        Last updated: {lastUpdated}
      </footer>
    </motion.div>
  )
} 