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
  XMarkIcon,
  PuzzlePieceIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import StatsCard from '../components/StatsCard'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useLanguage } from '../contexts/LanguageContext'
import { conversationsAPI, botsAPI } from '../utils/api'



export default function Dashboard() {
  const { t, isRTL } = useLanguage()
  const [selectedBot, setSelectedBot] = useState(null)
  const [showBotModal, setShowBotModal] = useState(false)
  const [toast, setToast] = useState('')
  const [showCustomize, setShowCustomize] = useState(false)
  const [showActivityLog, setShowActivityLog] = useState(false)
  const [dashboardBots, setDashboardBots] = useState([])
  const [dashboardActivity, setDashboardActivity] = useState([])
  const [deleteBotModal, setDeleteBotModal] = useState({ open: false, bot: null })
  const [botForm, setBotForm] = useState({ name: '', description: '' })
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ totalConversations: 0, totalUsers: 0 })
  const [statsLoading, setStatsLoading] = useState(true)
  const [whatsappConversationsDetails, setWhatsappConversationsDetails] = useState([]);
  const [recentConvos, setRecentConvos] = useState([])
  const [weeklyData, setWeeklyData] = useState([])
  const [botsByName, setBotsByName] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  // Auth check is now handled by ProtectedRoute component

  // Fetch stats for dashboard cards (same as Stats page)
  useEffect(() => {
    console.log('📊 Dashboard: Fetching stats...');
    setStats({ totalConversations: 0, totalUsers: 0 });
    setStatsLoading(true);
    
    conversationsAPI.getStats()
      .then(data => {
        console.log('✅ Dashboard: Stats loaded:', data);
        setStats(data);
      })
      .catch((error) => {
        console.error('❌ Dashboard: Stats failed:', error);
        setStats({ totalConversations: 0, totalUsers: 0 });
      })
      .finally(() => setStatsLoading(false));
  }, []);

  // Fetch recent conversations for dashboard (same as Stats page)
  useEffect(() => {
    setRecentConvos([]);
    
    conversationsAPI.getList()
      .then(data => {
        setRecentConvos(data?.slice(0, 5) || []);
      })
      .catch(() => {
        setRecentConvos([]);
      });
  }, []);

  // Fetch weekly messages for dashboard (same as Stats page)
  useEffect(() => {
    setWeeklyData([]);
    
    conversationsAPI.getOverTime()
      .then(data => {
        setWeeklyData(data || []);
      })
      .catch(() => {
        setWeeklyData([]);
      });
  }, []);

  // Fetch bots for dashboard (same as Stats page)
  useEffect(() => {
    setBotsByName([]);
    
    conversationsAPI.getByBot()
      .then(data => {
        setBotsByName(data || []);
      })
      .catch(() => {
        setBotsByName([]);
      });
  }, []);

  // Fetch recent activity for dashboard
  useEffect(() => {
    setRecentActivity([]);
    
    // Using the API utility for dashboard activity
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/dashboard/activity`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setRecentActivity(data?.slice(0, 5) || []);
      })
      .catch(() => {
        setRecentActivity([]);
      });
  }, []);

  // Fetch bots from backend
  useEffect(() => {
    console.log('🤖 Dashboard: Fetching bots...');
    setLoading(true)
    
    botsAPI.getList()
      .then(data => {
        setLoading(false)
        console.log('✅ Dashboard: Bots loaded:', data)
        setDashboardBots(data)
      })
      .catch((error) => {
        setLoading(false)
        console.error('❌ Dashboard: Bots failed:', error)
        setError(t('failedToLoadBots'))
      })
  }, [t])

  const handleQuickAction = (action) => {
    if (action.to) return
    if (action.name === 'createNewBot') {
      setShowBotModal(true)
      setSelectedBot(null)
    } else if (action.name === 'customizeDashboard') {
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
        setToast(`${bot.name} ${bot.status === 'active' ? t('paused') : t('activated')}!`)
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
        setToast(`${t('action')}: ${action} ${t('on')} ${bot.name}`)
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
    setLoading(true)
    if (isEdit && selectedBot) {
      // Update bot
      fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/bots/${selectedBot._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: botForm.name,
          description: botForm.description
        })
      })
        .then(async (res) => {
          const data = await res.json()
          setLoading(false)
          if (!res.ok) {
            setError(data.error || t('failedToUpdateBot'))
            return
          }
          setDashboardBots(prev => prev.map(b => b._id === data._id ? data : b))
          setShowBotModal(false)
          setToast(t('botUpdated'))
          setTimeout(() => setToast(''), 2000)
        })
        .catch(() => {
          setLoading(false)
          setError(t('failedToUpdateBot'))
        })
    } else {
      // Create new bot
      fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/bots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: botForm.name,
          description: botForm.description
        })
      })
        .then(async (res) => {
          const data = await res.json()
          setLoading(false)
          if (!res.ok) {
            setError(data.error || t('failedToCreateBot'))
            return
          }
          setDashboardBots(prev => [...prev, data])
          setShowBotModal(false)
          setToast(t('botCreated'))
          setTimeout(() => setToast(''), 2000)
        })
        .catch(() => {
          setLoading(false)
          setError(t('failedToCreateBot'))
        })
    }
  }

  const handleDeleteBotConfirm = () => {
    if (!deleteBotModal.bot) return
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/bots/${deleteBotModal.bot._id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(async (res) => {
        setLoading(false)
        if (!res.ok) {
          const data = await res.json()
          setError(data.error || t('failedToDeleteBot'))
          return
        }
        setDashboardBots(prev => prev.filter(b => b._id !== deleteBotModal.bot._id))
        setDeleteBotModal({ open: false, bot: null })
        setToast(t('botDeleted'))
        setTimeout(() => setToast(''), 2000)
      })
      .catch(() => {
        setLoading(false)
        setError(t('failedToDeleteBot'))
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
      className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-purple-900 p-6 ${isRTL ? 'text-right' : 'text-left'}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        <StatsCard icon="💬" value={statsLoading ? '...' : stats?.totalConversations} label={t('messagesHandled') || 'Messages Handled'} trend="up" trendValue="📈" color="blue" />
        <StatsCard icon="😊" value={statsLoading ? '...' : stats?.totalUsers} label={t('uniqueUsers') || 'Unique Users'} trend="up" trendValue="⬆️" color="green" />
        {/* You can add more cards here if needed */}
        <div className="bg-gradient-to-br from-purple-800/80 to-gray-900/80 rounded-xl shadow p-6 flex flex-col items-center border border-purple-700 hover:shadow-2xl transition-shadow duration-200">
          <span className="text-4xl mb-2">✨</span>
          <div className="text-lg font-bold text-white mb-1">{t('whatsNew')}</div>
          <div className="text-gray-200 text-center">{t('whatsNewDesc')}</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center border border-gray-700 col-span-2 mt-6">
        <div className="flex items-center justify-between w-full mb-4">
          <span className="text-xl font-bold text-blue-400">{t('messagesHandledWeekly')}</span>
          <span className="text-gray-400 text-sm">{t('last7Days')}</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weeklyData}>
            <XAxis dataKey="date" stroke="#8884d8" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* Get Started Checklist (Upgraded) */}
        <div className="bg-gray-800/90 rounded-xl shadow p-6 border border-gray-700 flex flex-col">
          <div className="font-bold mb-2 flex items-center gap-2 text-white"><PlusIcon className="h-5 w-5 text-purple-400" />{t('getStartedChecklist')}</div>
          <ul className="space-y-3">
            {/* Step 1: Complete Business Profile */}
            <li className="flex items-center gap-3 text-gray-300">
              <span>{stats?.businessProfileComplete ? <CheckCircleIcon className="h-5 w-5 text-green-400" /> : <XMarkIcon className="h-5 w-5 text-gray-500" />}</span>
              <span>{t('completeBusinessProfile')}</span>
            </li>
            {/* Step 2: Create New Bot */}
            <li className="flex items-center gap-3 text-gray-300">
              <span>{stats?.bots?.length > 0 ? <CheckCircleIcon className="h-5 w-5 text-green-400" /> : <PlusIcon className="h-5 w-5 text-purple-400" />}</span>
              <span><Link to="/bots" className="text-purple-400 underline">{t('createNewBot')}</Link></span>
            </li>
            {/* Step 3: Connect a Channel */}
            <li className="flex items-center gap-3 text-gray-300">
              <span>{stats?.channels > 0 ? <CheckCircleIcon className="h-5 w-5 text-green-400" /> : <ChartBarIcon className="h-5 w-5 text-blue-400" />}</span>
              <span><Link to="/integrations" className="text-blue-400 underline">{t('connectChannel')}</Link></span>
            </li>
            {/* Step 4: Invite Team Member */}
            <li className="flex items-center gap-3 text-gray-300">
              <span>{stats?.teamMembers > 1 ? <CheckCircleIcon className="h-5 w-5 text-green-400" /> : <UserGroupIcon className="h-5 w-5 text-green-400" />}</span>
              <span><Link to="/settings" className="text-green-400 underline">{t('inviteTeamMember')}</Link></span>
            </li>
            {/* Step 5: Explore Analytics */}
            <li className="flex items-center gap-3 text-gray-300">
              <span><ChartBarIcon className="h-5 w-5 text-yellow-400" /></span>
              <span><Link to="/stats" className="text-yellow-400 underline">{t('exploreAnalytics')}</Link></span>
            </li>
            {/* Step 6: Add Integrations */}
            <li className="flex items-center gap-3 text-gray-300">
              <span><PuzzlePieceIcon className="h-5 w-5 text-green-400" /></span>
              <span><Link to="/integrations" className="text-green-400 underline">{t('addIntegrations')}</Link></span>
            </li>
            {/* Step 7: Get Help */}
            <li className="flex items-center gap-3 text-gray-300">
              <span><InformationCircleIcon className="h-5 w-5 text-purple-400" /></span>
              <span><Link to="/help" className="text-purple-400 underline">{t('getHelpSupport')}</Link></span>
            </li>
          </ul>
        </div>
        {/* Recent Conversations Card */}
        <div className="bg-gray-800/90 rounded-xl shadow p-6 border border-gray-700 flex flex-col">
          <div className="font-bold mb-2 flex items-center gap-2 text-white">{t('recentConversations')}</div>
          <ul className="divide-y divide-gray-700">
            {recentConvos.length === 0 ? (
              <li className="py-3 text-gray-400">{t('noRecentConversationsFound')}</li>
            ) : (
              recentConvos.map((conv, idx) => (
                <li key={conv.phone_number + conv.time + idx} className="py-3 flex flex-col md:flex-row md:justify-between md:items-center">
                  <span className="font-semibold text-gray-200">{conv.phone_number}</span>
                  <span className="text-gray-400 text-sm">{conv.lastMessage}</span>
                  <span className="text-xs text-gray-500">{new Date(conv.time).toLocaleString()}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        {/* Quick Actions */}
        <div className="bg-gray-800/90 rounded-xl shadow p-6 border border-gray-700 flex flex-col">
          <div className="font-bold mb-2 flex items-center gap-2 text-white">{t('quickActions')}</div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {stats?.bots?.length === 0 && (
              <Link to="/bots" className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition border border-gray-600">
                <PlusIcon className="h-6 w-6 text-purple-400" />
                <span className="font-medium text-white">{t('createNewBot')}</span>
              </Link>
            )}
            {stats?.channels === 0 && (
              <Link to="/integrations" className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition border border-gray-600">
                <ChartBarIcon className="h-6 w-6 text-blue-400" />
                <span className="font-medium text-white">{t('connectChannel')}</span>
              </Link>
            )}
            {stats?.teamMembers <= 1 && (
              <Link to="/settings" className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition border border-gray-600">
                <UserGroupIcon className="h-6 w-6 text-green-400" />
                <span className="font-medium text-white">{t('inviteTeamMember')}</span>
              </Link>
            )}
            <Link to="/live-chat" className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition border border-gray-600">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-orange-400" />
              <span className="font-medium text-white">{t('liveChat')}</span>
            </Link>
            {/* New Quick Actions */}
            <Link to="/stats" className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition border border-gray-600">
              <ChartBarIcon className="h-6 w-6 text-yellow-400" />
              <span className="font-medium text-white">{t('viewAnalytics')}</span>
            </Link>
            <Link to="/settings" className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition border border-gray-600">
              <Cog6ToothIcon className="h-6 w-6 text-gray-400" />
              <span className="font-medium text-white">{t('settings')}</span>
            </Link>
            <Link to="/help" className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition border border-gray-600">
              <InformationCircleIcon className="h-6 w-6 text-purple-400" />
              <span className="font-medium text-white">{t('getHelpSupport')}</span>
            </Link>
            <Link to="/integrations" className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition border border-gray-600">
              <PuzzlePieceIcon className="h-6 w-6 text-green-400" />
              <span className="font-medium text-white">{t('integrations')}</span>
            </Link>
            <Link to="/conversations" className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition border border-gray-600">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-400" />
              <span className="font-medium text-white">{t('viewAllConversations')}</span>
            </Link>
          </div>
          <button
            onClick={() => setShowCustomize(true)}
            className="mt-4 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition self-end"
          >
            {t('customizeDashboard')}
          </button>
        </div>
        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700 flex flex-col md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">{t('recentActivity')}</h2>
          </div>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-gray-400">{t('noRecentActivity')}</div>
            ) : (
              recentActivity.map((activity, idx) => (
                <div key={`${activity.type}-${activity.message}-${activity.time || idx}`} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.message}</p>
                    <p className="text-gray-500 text-xs">{activity.time ? new Date(activity.time).toLocaleString() : ''}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Active Bots (Your Bots) */}
        <div className="bg-gray-800 rounded-xl shadow p-6 border border-gray-700 flex flex-col md:col-span-2 lg:col-span-1">
          <h2 className="text-xl font-bold text-white mb-6">{t('yourBots')}</h2>
          <div className="space-y-4">
            {dashboardBots.length === 0 ? (
              <div className="text-gray-400">{t('noBotsFound')}</div>
            ) : (
              dashboardBots.slice(0, 4).map((bot) => (
                <div key={bot.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-medium">{bot.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bot.status === 'active' 
                          ? 'bg-green-900/30 text-green-400' 
                          : 'bg-gray-600 text-gray-300'
                      }`}>
                        {bot.status === 'active' ? t('active') : t('inactive')}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-2">
                      <p className="text-gray-400 text-sm">{bot.messages || 0} {t('messages')}</p>
                      <p className="text-gray-400 text-sm">{bot.accuracy || 0}% {t('accuracy')}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {dashboardBots.length > 4 && (
            <Link
              to="/bots"
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mt-4 font-medium"
            >
              {t('viewAllBots')}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          )}
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
            <h2 className="text-xl font-bold text-white mb-4">{selectedBot.name} {t('details')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('status')}</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedBot.status === 'active' 
                    ? 'bg-green-900/30 text-green-400' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {selectedBot.status === 'active' ? t('active') : t('inactive')}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('totalMessages')}</label>
                <p className="text-white">{selectedBot.messages}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('accuracy')}</label>
                <p className="text-white">{selectedBot.accuracy}</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowBotModal(false)}
                  className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  {t('close')}
                </button>
                <Link
                  to="/bots"
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition text-center"
                >
                  {t('editBot')}
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
            <h2 className="text-xl font-bold text-white mb-4">{t('customizeDashboard')}</h2>
            <div className="text-gray-300 mb-4">{t('personalizeDashboard')}</div>
            <button onClick={() => setShowCustomize(false)} className="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
              {t('close')}
            </button>
          </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {showActivityLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-2xl relative border border-gray-700">
            <button onClick={() => setShowActivityLog(false)} className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl" aria-label="Close activity log">&times;</button>
            <h2 className="text-xl font-bold text-white mb-4">{t('fullActivityLog')}</h2>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {dashboardActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-medium">{t(activity.title)}</p>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                  <span className="text-purple-400 text-sm font-medium capitalize">{t(activity.action)}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowActivityLog(false)} className="w-full mt-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
              {t('close')}
            </button>
          </div>
        </div>
      )}

      {/* Delete Bot Modal */}
      {deleteBotModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
            <button onClick={() => setDeleteBotModal({ open: false, bot: null })} className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 text-xl" aria-label="Close delete bot modal">&times;</button>
            <h2 className="text-xl font-bold text-white mb-4">{t('deleteBot')}</h2>
            <p className="text-gray-300 mb-6">{t('deleteBotConfirm')}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteBotModal({ open: false, bot: null })} className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition">
                {t('cancel')}
              </button>
              <button onClick={handleDeleteBotConfirm} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
                {t('deleteBot')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} ChatBot Platform &mdash; {t('allRightsReserved')}<br />
        {t('lastUpdated')}: {lastUpdated}
      </footer>
    </motion.div>
  )
} 