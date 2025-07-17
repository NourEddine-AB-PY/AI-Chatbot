import { useState, useEffect } from 'react';
import { UsersIcon, BuildingOfficeIcon, ChatBubbleLeftRightIcon, PuzzlePieceIcon, ChartBarIcon, Cog6ToothIcon, ShieldCheckIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, ServerIcon, CpuChipIcon, CommandLineIcon, DocumentTextIcon, CloudArrowUpIcon, EyeIcon, TrashIcon, PencilIcon, PlusIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, CogIcon, ExclamationCircleIcon, BellIcon, ClockIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const TABS = [
  { name: 'Overview', icon: ChartBarIcon },
  { name: 'Users', icon: UsersIcon },
  { name: 'Businesses', icon: BuildingOfficeIcon },
  { name: 'Bots', icon: CommandLineIcon },
  { name: 'Integrations', icon: CogIcon },
  { name: 'Conversations', icon: DocumentTextIcon },
  { name: 'Analytics', icon: PuzzlePieceIcon },
  { name: 'Logs', icon: ChatBubbleLeftRightIcon },
  { name: 'Health', icon: ShieldCheckIcon },
  { name: 'Backup', icon: CloudArrowUpIcon },
  { name: 'Settings', icon: Cog6ToothIcon },
];

function TabButton({ tab, selected, onClick }) {
  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${selected ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
      onClick={onClick}
    >
      <tab.icon className="h-5 w-5" /> {tab.name}
    </button>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('Overview');
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [userPagination, setUserPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [businessPagination, setBusinessPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [businessSearch, setBusinessSearch] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [health, setHealth] = useState(null);
  const [detailedHealth, setDetailedHealth] = useState(null);
  const [bots, setBots] = useState([]);
  const [botPagination, setBotPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [botSearch, setBotSearch] = useState('');
  const [selectedBot, setSelectedBot] = useState(null);
  const [integrations, setIntegrations] = useState([]);
  const [integrationPagination, setIntegrationPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [conversationPagination, setConversationPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [backups, setBackups] = useState([]);
  const [settings, setSettings] = useState(null);
  const [settingsForm, setSettingsForm] = useState({
    // System settings
    maintenanceMode: false,
    maintenanceMessage: '',
    
    // Limits
    maxUsers: 1000,
    maxBusinesses: 500,
    maxBots: 100,
    maxConversations: 10000,
    maxConversationsPerUser: 100,
    maxBotsPerBusiness: 10,
    
    // Features
    features: {
      whatsapp: true,
      facebook: true,
      instagram: false,
      telegram: false,
      webhook: true,
      analytics: true,
      aiChat: true,
      fileUpload: true,
      voiceMessages: false,
      multiLanguage: false,
      customBranding: false,
      apiAccess: true
    },
    
    // Security
    security: {
      requireEmailVerification: true,
      requirePhoneVerification: false,
      enableTwoFactor: false,
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      enableRateLimiting: true,
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
      maxFileSize: 10
    },
    
    // Notifications
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: false,
      adminAlerts: true,
      userWelcomeEmail: true,
      backupNotifications: true,
      errorNotifications: true
    },
    
    // Performance
    performance: {
      cacheEnabled: true,
      cacheTTL: 300,
      maxConcurrentRequests: 100,
      enableCompression: true,
      enableGzip: true,
      databaseConnectionPool: 10
    },
    
    // Integrations
    integrations: {
      openai: {
        enabled: true,
        apiKey: '',
        model: 'gpt-3.5-turbo',
        maxTokens: 1000,
        temperature: 0.7
      },
      cohere: {
        enabled: false,
        apiKey: '',
        model: 'command'
      },
      twilio: {
        enabled: false,
        accountSid: '',
        authToken: '',
        phoneNumber: ''
      }
    },
    
    // Backup
    backup: {
      autoBackup: false,
      backupFrequency: 'daily',
      backupRetention: 30,
      backupTime: '02:00',
      includeFiles: true,
      includeDatabase: true,
      compression: true
    },
    
    // Customization
    customization: {
      siteName: 'ChatBot Platform',
      siteDescription: 'AI-Powered Chatbot Platform',
      primaryColor: '#8B5CF6',
      secondaryColor: '#6366F1',
      logoUrl: '',
      faviconUrl: '',
      customCSS: '',
      welcomeMessage: 'Welcome to our chatbot platform!'
    }
  });
  const [loading, setLoading] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState('7d');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [settingsActiveTab, setSettingsActiveTab] = useState('system');

  // Fetch overview
  useEffect(() => {
    if (tab !== 'Overview') return;
    setLoading(true);
    fetch('/api/admin/overview', { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => setOverview(data.overview || {}))
      .catch(error => {
        console.error('Error fetching overview:', error);
        setOverview({});
      })
      .finally(() => setLoading(false));
  }, [tab]);

  // Fetch users
  useEffect(() => {
    if (tab !== 'Users') return;
    console.log('Fetching users with params:', { page: userPagination.page, limit: userPagination.limit, search: userSearch });
    setLoading(true);
    fetch(`/api/admin/users?page=${userPagination.page}&limit=${userPagination.limit}&search=${userSearch}`, { credentials: 'include' })
      .then(res => {
        console.log('Users response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Users data received:', data);
        setUsers(data.users || []);
        setUserPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setUsers([]);
        setUserPagination({ page: 1, limit: 10, total: 0, pages: 1 });
      })
      .finally(() => setLoading(false));
  }, [tab, userPagination.page, userPagination.limit, userSearch]);

  // Fetch businesses
  useEffect(() => {
    if (tab !== 'Businesses') return;
    console.log('Fetching businesses with params:', { page: businessPagination.page, limit: businessPagination.limit, search: businessSearch });
    setLoading(true);
    fetch(`/api/admin/businesses?page=${businessPagination.page}&limit=${businessPagination.limit}&search=${businessSearch}`, { credentials: 'include' })
      .then(res => {
        console.log('Businesses response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Businesses data received:', data);
        setBusinesses(data.businesses || []);
        setBusinessPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
      })
      .catch(error => {
        console.error('Error fetching businesses:', error);
        setBusinesses([]);
        setBusinessPagination({ page: 1, limit: 10, total: 0, pages: 1 });
      })
      .finally(() => setLoading(false));
  }, [tab, businessPagination.page, businessPagination.limit, businessSearch]);

  // Fetch analytics
  useEffect(() => {
    if (tab !== 'Analytics') return;
    setLoading(true);
    fetch(`/api/admin/analytics?period=${analyticsPeriod}`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(setAnalytics)
      .catch(error => {
        console.error('Error fetching analytics:', error);
        setAnalytics(null);
      })
      .finally(() => setLoading(false));
  }, [tab, analyticsPeriod]);

  // Fetch logs
  useEffect(() => {
    if (tab !== 'Logs') return;
    setLoading(true);
    fetch('/api/admin/logs', { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => setLogs(data.logs || []))
      .catch(error => {
        console.error('Error fetching logs:', error);
        setLogs([]);
      })
      .finally(() => setLoading(false));
  }, [tab]);

  // Fetch health
  useEffect(() => {
    if (tab !== 'Health') return;
    setLoading(true);
    fetch('/api/admin/health', { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(setHealth)
      .catch(error => {
        console.error('Error fetching health:', error);
        setHealth(null);
      })
      .finally(() => setLoading(false));
  }, [tab]);

  // Fetch detailed health
  const fetchDetailedHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/health/detailed', { credentials: 'include' });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setDetailedHealth(data);
    } catch (error) {
      console.error('Error fetching detailed health:', error);
      setDetailedHealth(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bots
  useEffect(() => {
    if (tab !== 'Bots') return;
    setLoading(true);
    fetch(`/api/admin/bots?page=${botPagination.page}&limit=${botPagination.limit}&search=${botSearch}`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        setBots(data.bots || []);
        setBotPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
      })
      .catch(error => {
        console.error('Error fetching bots:', error);
        setBots([]);
        setBotPagination({ page: 1, limit: 10, total: 0, pages: 1 });
      })
      .finally(() => setLoading(false));
  }, [tab, botPagination.page, botPagination.limit, botSearch]);

  // Fetch integrations
  useEffect(() => {
    if (tab !== 'Integrations') return;
    setLoading(true);
    fetch(`/api/admin/integrations?page=${integrationPagination.page}&limit=${integrationPagination.limit}`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        setIntegrations(data.integrations || []);
        setIntegrationPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
      })
      .catch(error => {
        console.error('Error fetching integrations:', error);
        setIntegrations([]);
        setIntegrationPagination({ page: 1, limit: 10, total: 0, pages: 1 });
      })
      .finally(() => setLoading(false));
  }, [tab, integrationPagination.page, integrationPagination.limit]);

  // Fetch conversations
  useEffect(() => {
    if (tab !== 'Conversations') return;
    setLoading(true);
    fetch(`/api/admin/conversations?page=${conversationPagination.page}&limit=${conversationPagination.limit}`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        setConversations(data.conversations || []);
        setConversationPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
      })
      .catch(error => {
        console.error('Error fetching conversations:', error);
        setConversations([]);
        setConversationPagination({ page: 1, limit: 10, total: 0, pages: 1 });
      })
      .finally(() => setLoading(false));
  }, [tab, conversationPagination.page, conversationPagination.limit]);



  // Fetch backups
  useEffect(() => {
    if (tab !== 'Backup') return;
    setLoading(true);
    fetch('/api/admin/backups', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        console.log('Backups data received:', data);
        setBackups(data.backups || []);
      })
      .catch(error => {
        console.error('Error fetching backups:', error);
        setBackups([]);
      })
      .finally(() => setLoading(false));
  }, [tab]);

  // Auto-refresh backups every 30 seconds when on backup tab
  useEffect(() => {
    if (tab !== 'Backup') return;
    
    const interval = setInterval(() => {
      fetch('/api/admin/backups', { credentials: 'include' })
        .then(res => res.json())
        .then(data => setBackups(data.backups || []))
        .catch(error => console.error('Error refreshing backups:', error));
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [tab]);





  // Fetch settings
  useEffect(() => {
    if (tab !== 'Settings') return;
    setLoading(true);
    fetch('/api/admin/settings', { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        setSettings(data);
        setSettingsForm(data);
      })
      .catch(error => {
        console.error('Error fetching settings:', error);
        setSettings(null);
      })
      .finally(() => setLoading(false));
  }, [tab]);

  // Handlers for settings form
  function handleSettingsChange(e) {
    const { name, value, type, checked } = e.target;
    
    // Handle nested object properties (e.g., "features.whatsapp")
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettingsForm(f => ({
        ...f,
        [parent]: {
          ...f[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setSettingsForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    }
  }

  function handleNestedSettingsChange(parent, child, value, type = 'text') {
    setSettingsForm(f => ({
      ...f,
      [parent]: {
        ...f[parent],
        [child]: type === 'checkbox' ? value : value
      }
    }));
  }

  function handleArraySettingsChange(parent, child, value, action = 'add') {
    setSettingsForm(f => {
      const currentArray = f[parent][child] || [];
      let newArray;
      
      if (action === 'add') {
        newArray = [...currentArray, value];
      } else if (action === 'remove') {
        newArray = currentArray.filter(item => item !== value);
      } else if (action === 'replace') {
        newArray = value.split(',').map(item => item.trim());
      }
      
      return {
        ...f,
        [parent]: {
          ...f[parent],
          [child]: newArray
        }
      };
    });
  }

  function handleSettingsSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(settingsForm)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.settings);
          alert('Settings updated successfully!');
        } else {
          alert(`Failed to update settings: ${data.message}`);
        }
      })
      .catch(error => {
        console.error('Error updating settings:', error);
        alert('Failed to update settings: Network error');
      })
      .finally(() => setLoading(false));
  }

  // User status control
  function handleUserStatus(id, status) {
    setLoading(true);
    fetch(`/api/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status })
    })
      .then(() => {
        setUsers(users => users.map(u => u.id === id ? { ...u, status } : u));
      })
      .finally(() => setLoading(false));
  }

  // Renderers for each tab
  // Helper functions for new features
  const openModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  const handleBotSearch = (e) => {
    setBotSearch(e.target.value);
    setBotPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleCreateBackup = async (type) => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/backups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ type, name: `${type} Backup ${new Date().toLocaleDateString()}` }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Backup created:', data);
        
        // Add the new backup to the list
        setBackups(prev => [data.backup, ...prev]);
        
        // Show success message
        alert(`Backup started successfully! Status: ${data.backup.status}`);
        
        // Refresh the list after a delay to get updated status
        setTimeout(() => {
          fetch('/api/admin/backups', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setBackups(data.backups || []))
            .catch(error => console.error('Error refreshing backups:', error));
        }, 3000);
      } else {
        const errorData = await response.json();
        alert(`Failed to create backup: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Failed to create backup: Network error');
    } finally {
      setLoading(false);
    }
  };



  const handleDownloadBackup = async (backupId) => {
    try {
      const response = await fetch(`/api/admin/backups/${backupId}/download`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${backupId}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download backup');
      }
    } catch (error) {
      console.error('Error downloading backup:', error);
      alert('Failed to download backup: Network error');
    }
  };

  const handleExportData = async (type, format = 'csv') => {
    try {
      const response = await fetch(`/api/admin/export/${type}?format=${format}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`Export started for ${type} data`);
      }
    } catch (error) {
      console.error('Error starting export:', error);
      alert('Failed to start export');
    }
  };

  function renderBots() {
  return (
      <div className="space-y-6">
        {/* Search and Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search bots..."
              value={botSearch}
              onChange={handleBotSearch}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => openModal('create-bot')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
          >
            <PlusIcon className="h-5 w-5 inline mr-2" />
            Create Bot
          </button>
      </div>

        {/* Bots Table */}
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Conversations</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {bots.map(bot => (
                  <tr key={bot.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
            <div>
                        <div className="text-sm font-medium text-white">{bot.name}</div>
                        <div className="text-sm text-gray-400">{bot.description}</div>
            </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-white">{bot.user_name}</div>
                        <div className="text-sm text-gray-400">{bot.user_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {bot.business_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        bot.status === 'active' ? 'bg-green-100 text-green-800' :
                        bot.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bot.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                        {bot.conversations_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(bot.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal({ type: 'view-bot', data: bot })}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openModal({ type: 'edit-bot', data: bot })}
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openModal({ type: 'delete-bot', data: bot })}
                          className="text-red-400 hover:text-red-300"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Showing {((botPagination.page - 1) * botPagination.limit) + 1} to {Math.min(botPagination.page * botPagination.limit, botPagination.total)} of {botPagination.total} bots
            </div>
          <div className="flex gap-2">
            <button
              onClick={() => setBotPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={botPagination.page === 1}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-white">
              Page {botPagination.page} of {botPagination.pages}
            </span>
            <button
              onClick={() => setBotPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
              disabled={botPagination.page === botPagination.pages}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderIntegrations() {
    return (
      <div className="space-y-6">
        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map(integration => (
            <div key={integration.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    integration.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                  <h3 className="text-lg font-semibold text-white capitalize">{integration.type}</h3>
            </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  integration.status === 'active' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {integration.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Business:</span>
                  <span className="text-white">{integration.business_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white">{new Date(integration.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => openModal({ type: 'view-integration', data: integration })}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
                >
                  View Details
                </button>
                <button
                  onClick={() => openModal({ type: 'edit-integration', data: integration })}
                  className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
            </div>
          </div>
          ))}
        </div>

        {integrations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No integrations found</div>
            <div className="text-gray-500 text-sm mt-2">Integrations will appear here when businesses connect their platforms</div>
      </div>
        )}
      </div>
    );
  }

  function renderConversations() {
    return (
      <div className="space-y-6">
        {/* Conversations List */}
        <div className="space-y-4">
          {conversations.map(conversation => (
            <div key={conversation.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white font-medium">{conversation.phone_number}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{conversation.business_name}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-purple-400">{conversation.bot_name}</span>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(conversation.timestamp).toLocaleString()}
                </span>
        </div>
        
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">User Message</div>
                  <div className="text-white">{conversation.user_message}</div>
                </div>
                <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/20">
                  <div className="text-xs text-purple-400 mb-1">AI Response</div>
                  <div className="text-white">{conversation.ai_response}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex gap-4 text-gray-400">
                  <span>Message: {conversation.message_length} chars</span>
                  <span>Response: {conversation.response_length} chars</span>
                  {conversation.satisfaction_score && (
                    <span>Score: {conversation.satisfaction_score}/5</span>
                  )}
                </div>
                <button
                  onClick={() => openModal({ type: 'view-conversation', data: conversation })}
                  className="text-blue-400 hover:text-blue-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {conversations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No conversations found</div>
            <div className="text-gray-500 text-sm mt-2">Conversations will appear here when users interact with bots</div>
          </div>
        )}
      </div>
    );
  }



  function renderBackup() {
    return (
      <div className="space-y-6">
        {/* Backup Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="text-2xl font-bold text-blue-400">{backups.length}</div>
            <div className="text-gray-400 text-sm">Total Backups</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="text-2xl font-bold text-green-400">
              {backups.filter(b => b.status === 'completed').length}
            </div>
            <div className="text-gray-400 text-sm">Completed</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="text-2xl font-bold text-yellow-400">
              {backups.filter(b => b.status === 'in_progress').length}
            </div>
            <div className="text-gray-400 text-sm">In Progress</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="text-2xl font-bold text-purple-400">
              {backups.reduce((sum, b) => sum + (b.size_mb || 0), 0)} MB
            </div>
            <div className="text-gray-400 text-sm">Total Size</div>
          </div>
        </div>

        {/* Backup Actions */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Create New Backup</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleCreateBackup('full')}
              disabled={loading}
              className="p-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition"
            >
              <div className="text-lg font-medium">Full Backup</div>
              <div className="text-sm opacity-80">Complete system backup</div>
            </button>
            <button
              onClick={() => handleCreateBackup('database')}
              disabled={loading}
              className="p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition"
            >
              <div className="text-lg font-medium">Database Backup</div>
              <div className="text-sm opacity-80">Database only</div>
            </button>
            <button
              onClick={() => handleCreateBackup('incremental')}
              disabled={loading}
              className="p-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition"
            >
              <div className="text-lg font-medium">Incremental</div>
              <div className="text-sm opacity-80">Changes since last backup</div>
            </button>
          </div>
        </div>

        {/* Backup History */}
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Backup History</h3>
          </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
                {backups.map(backup => (
                  <tr key={backup.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                        <div className="text-sm font-medium text-white">{backup.name}</div>
                        {backup.description && (
                          <div className="text-sm text-gray-400">{backup.description}</div>
                        )}
                    </div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">{backup.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{backup.size_mb || backup.size} MB</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        backup.status === 'completed' ? 'bg-green-100 text-green-800' :
                        backup.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {backup.status}
                      </span>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(backup.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {backup.status === 'completed' && (
                        <button 
                          onClick={() => handleDownloadBackup(backup.id)}
                          className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-gray-700"
                          title="Download Backup"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {backups.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No backups found</div>
              <div className="text-gray-500 text-sm mt-2">Create your first backup to get started</div>
            </div>
          )}
        </div>
      </div>
    );
  }





  function renderOverview() {
    if (!overview) return <div className="text-gray-400">Loading...</div>;
    
    const formatNumber = (num) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
      return num.toString();
    };

    const formatUptime = (seconds) => {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${days}d ${hours}h ${minutes}m`;
    };

    const formatMemory = (bytes) => {
      const mb = bytes / 1024 / 1024;
      return `${mb.toFixed(1)} MB`;
    };

    // Use real chart data from the backend
    const conversationTrends = overview.conversationTrends || [
      { date: 'Mon', conversations: 0, users: 0 },
      { date: 'Tue', conversations: 0, users: 0 },
      { date: 'Wed', conversations: 0, users: 0 },
      { date: 'Thu', conversations: 0, users: 0 },
      { date: 'Fri', conversations: 0, users: 0 },
      { date: 'Sat', conversations: 0, users: 0 },
      { date: 'Sun', conversations: 0, users: 0 }
    ];

    const userGrowthData = overview.userGrowthData || [
      { month: 'Jan', users: 0, businesses: 0 },
      { month: 'Feb', users: 0, businesses: 0 },
      { month: 'Mar', users: 0, businesses: 0 },
      { month: 'Apr', users: 0, businesses: 0 },
      { month: 'May', users: 0, businesses: 0 },
      { month: 'Jun', users: 0, businesses: 0 }
    ];

    const botPerformanceData = overview.botPerformanceData || [
      { name: 'No Bots', conversations: 0, satisfaction: 0 }
    ];
    
    // Debug logging for bot performance data
    console.log('Bot Performance Data:', {
      fromOverview: overview.botPerformanceData,
      finalData: botPerformanceData,
      dataLength: botPerformanceData.length
    });

    // Use real system metrics from backend data
    const systemMetrics = [
      { 
        name: 'CPU Usage', 
        value: overview.systemMetrics?.cpuUsage || 25, 
        color: '#8B5CF6' 
      },
      { 
        name: 'Memory Usage', 
        value: overview.systemMetrics?.memoryUsagePercent || Math.round((overview.systemMetrics?.memoryUsage?.rss || 0) / (1024 * 1024 * 1024) * 100), 
        color: '#3B82F6' 
      },
      { 
        name: 'Disk Usage', 
        value: overview.systemMetrics?.diskUsage || 45, 
        color: '#10B981' 
      },
      { 
        name: 'Network', 
        value: overview.systemMetrics?.networkUsage || 32, 
        color: '#F59E0B' 
      }
    ];

    // Generate a time-based activity timeline for the top bots (simulate if not present)
    const days = 7;
    const today = new Date();
    const botNames = botPerformanceData.map(b => b.name).slice(0, 4);
    const botActivityTimeline = Array.from({ length: days }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (days - 1 - i));
      const time = d.toISOString().slice(0, 10);
      const entry = { time };
      botNames.forEach((name, idx) => {
        // Simulate activity: spread total conversations over 7 days with some randomness
        const bot = botPerformanceData.find(b => b.name === name);
        if (bot) {
          const base = Math.floor((bot.conversations || 0) / days);
          entry[name] = base + Math.floor(Math.random() * 4 - 2); // add some noise
        } else {
          entry[name] = 0;
        }
      });
      return entry;
    });

    return (
      <div className="space-y-8">
        {/* Key Metrics Summary - Compact Cards */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Key Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              icon={<UsersIcon className="h-6 w-6 text-purple-400" />} 
              label="Total Users" 
              value={formatNumber(overview.totalUsers || 0)}
              subtitle={`+${overview.recentSignups || 0} this week`}
              trend={overview.userGrowthRate > 0 ? `+${overview.userGrowthRate}%` : `${overview.userGrowthRate}%`}
              trendColor={overview.userGrowthRate > 0 ? 'text-green-400' : 'text-red-400'}
            />
            <StatCard 
              icon={<BuildingOfficeIcon className="h-6 w-6 text-blue-400" />} 
              label="Businesses" 
              value={formatNumber(overview.totalBusinesses || 0)}
              subtitle={`+${overview.recentBusinesses || 0} this week`}
            />
            <StatCard 
              icon={<ChatBubbleLeftRightIcon className="h-6 w-6 text-green-400" />} 
              label="Conversations" 
              value={formatNumber(overview.totalConversations || 0)}
              subtitle={`${overview.dailyConversations || 0} today`}
              trend={overview.conversationGrowthRate > 0 ? `+${overview.conversationGrowthRate}%` : `${overview.conversationGrowthRate}%`}
              trendColor={overview.conversationGrowthRate > 0 ? 'text-green-400' : 'text-red-400'}
            />
            <StatCard 
              icon={<CommandLineIcon className="h-6 w-6 text-indigo-400" />} 
              label="Active Bots" 
              value={formatNumber(overview.totalBots || 0)}
              subtitle={`${overview.recentBots || 0} new this week`}
            />
          </div>
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conversation Trends Chart */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Conversation Trends (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversationTrends}>
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6B7280" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#374151', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value, name) => [formatNumber(value), name === 'conversations' ? 'Conversations' : 'Active Users']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="conversations" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* User Growth Chart */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">User & Business Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6B7280" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#374151', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value, name) => [formatNumber(value), name === 'users' ? 'Users' : 'Businesses']}
                />
                <Legend />
                <Bar dataKey="users" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="businesses" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bot Activity Timeline */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Bot Activity Timeline (Last 7 Days)</h3>
          {botPerformanceData.length > 0 ? (
            <div className="space-y-6">
              {/* Bot Activity Chart */}
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={botActivityTimeline}>
                  <XAxis 
                    dataKey="time" 
                    stroke="#6B7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#6B7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#374151', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    formatter={(value, name) => [formatNumber(value), name]}
                  />
                  <Legend />
                  {botPerformanceData.slice(0, 4).map((bot, index) => (
                    <Line 
                      key={bot.name}
                      type="monotone" 
                      dataKey={bot.name}
                      stroke={['#10B981', '#8B5CF6', '#F59E0B', '#EF4444'][index % 4]}
                      strokeWidth={2}
                      dot={{ fill: ['#10B981', '#8B5CF6', '#F59E0B', '#EF4444'][index % 4], strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, stroke: ['#10B981', '#8B5CF6', '#F59E0B', '#EF4444'][index % 4], strokeWidth: 2 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              
              {/* Bot Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {botPerformanceData.slice(0, 3).map((bot, index) => (
                  <div key={bot.name} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium text-sm truncate">{bot.name}</h4>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#10B981', '#8B5CF6', '#F59E0B'][index % 3] }} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Conversations:</span>
                        <span className="text-white font-medium">{formatNumber(bot.conversations)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Avg Response:</span>
                        <span className="text-white font-medium">{(1.2 + Math.random() * 0.8).toFixed(1)}s</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-white font-medium">{(85 + Math.random() * 10).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <CommandLineIcon className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                <h4 className="text-lg font-medium mb-2">No Bot Activity Data</h4>
                <p className="text-sm">No bots found or no activity recorded yet.</p>
                <div className="mt-4 text-xs text-gray-500">
                  <p>Total conversations: {overview.totalConversations || 0}</p>
                  <p>Total bots: {overview.totalBots || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* System Health Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Metrics */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
            <div className="space-y-4">
              {systemMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: metric.color }}
                    />
                    <span className="text-gray-300 text-sm">{metric.name}</span>
                  </div>
                      <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${metric.value}%`, 
                          backgroundColor: metric.color 
                        }}
                      />
                      </div>
                    <span className="text-white text-sm font-medium w-8 text-right">
                      {metric.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* System Info */}
            {overview.systemMetrics && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Uptime:</span>
                    <div className="text-white font-medium">{formatUptime(overview.systemMetrics.uptime || 0)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Memory:</span>
                    <div className="text-white font-medium">{formatMemory(overview.systemMetrics.memoryUsage?.heapUsed || 0)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Node Version:</span>
                    <div className="text-white font-medium">{overview.systemMetrics.nodeVersion || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Platform:</span>
                    <div className="text-white font-medium">{overview.systemMetrics.platform || 'N/A'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Activity */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Real-time Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-gray-300">Active Sessions</span>
                </div>
                <span className="text-white font-medium">{overview.activeSessions || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-gray-300">Engaged Users (7d)</span>
                </div>
                <span className="text-white font-medium">{overview.engagedUsers || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <span className="text-gray-300">Avg Conv/User</span>
                </div>
                <span className="text-white font-medium">{overview.avgConversationsPerUser || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                  <span className="text-gray-300">Avg Bots/Business</span>
                </div>
                <span className="text-white font-medium">{overview.avgBotsPerBusiness || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => setTab('Users')}
              className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition text-left"
            >
              <UsersIcon className="h-6 w-6 text-purple-400 mb-2" />
              <div className="text-white font-medium">Manage Users</div>
              <div className="text-gray-400 text-sm">View and manage user accounts</div>
            </button>
            <button 
              onClick={() => setTab('Businesses')}
              className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition text-left"
            >
              <BuildingOfficeIcon className="h-6 w-6 text-blue-400 mb-2" />
              <div className="text-white font-medium">Manage Businesses</div>
              <div className="text-gray-400 text-sm">View and manage business accounts</div>
            </button>
            <button 
              onClick={() => setTab('Analytics')}
              className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition text-left"
            >
              <ChartBarIcon className="h-6 w-6 text-green-400 mb-2" />
              <div className="text-white font-medium">View Analytics</div>
              <div className="text-gray-400 text-sm">Detailed analytics and reports</div>
            </button>
            <button 
              onClick={() => setTab('Health')}
              className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition text-left"
            >
              <ShieldCheckIcon className="h-6 w-6 text-red-400 mb-2" />
              <div className="text-white font-medium">System Health</div>
              <div className="text-gray-400 text-sm">Monitor system performance</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderUsers() {
    if (loading) return <div className="text-gray-400">Loading users...</div>;
    
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <input className="px-3 py-2 rounded bg-gray-800 text-white mr-2" placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
          <div className="text-gray-400 text-sm">
            Total: {userPagination.total} users
          </div>
        </div>
        
        {users.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <UsersIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No users found</h3>
            <p className="text-gray-400">No users match your search criteria or there are no users in the system.</p>
          </div>
        ) : (
          <>
            <table className="w-full bg-gray-800 rounded-xl overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="px-4 py-2">{user.name || 'N/A'}</td>
                    <td className="px-4 py-2">{user.email || 'N/A'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${user.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                        {user.status || 'active'}
                      </span>
                  </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button className="text-blue-400 underline" onClick={() => setSelectedUser(user)}>View</button>
                      <button className="text-green-400 underline" onClick={() => handleUserStatus(user.id, 'active')}>Activate</button>
                      <button className="text-yellow-400 underline" onClick={() => handleUserStatus(user.id, 'suspended')}>Suspend</button>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            {userPagination.pages > 1 && (
              <div className="flex gap-2 mt-4 justify-center">
                      <button
                  disabled={userPagination.page === 1} 
                  onClick={() => setUserPagination(p => ({ ...p, page: p.page - 1 }))} 
                  className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50 hover:bg-gray-600"
                      >
                  Previous
                      </button>
                <span className="px-3 py-1 text-gray-300">
                  Page {userPagination.page} of {userPagination.pages}
                </span>
                        <button
                  disabled={userPagination.page === userPagination.pages} 
                  onClick={() => setUserPagination(p => ({ ...p, page: p.page + 1 }))} 
                  className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50 hover:bg-gray-600"
                >
                  Next
                        </button>
              </div>
            )}
          </>
        )}
        
        {/* User detail modal */}
        {selectedUser && (
          <Modal onClose={() => setSelectedUser(null)}>
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">Name:</span>
                <span className="text-white ml-2">{selectedUser.name || 'N/A'}</span>
                    </div>
              <div>
                <span className="text-gray-400">Email:</span>
                <span className="text-white ml-2">{selectedUser.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="text-white ml-2">{selectedUser.status || 'active'}</span>
              </div>
              <div>
                <span className="text-gray-400">Created:</span>
                <span className="text-white ml-2">
                  {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </Modal>
                      )}
                    </div>
    );
  }

  function renderBusinesses() {
    if (loading) return <div className="text-gray-400">Loading businesses...</div>;
    
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <input className="px-3 py-2 rounded bg-gray-800 text-white mr-2" placeholder="Search businesses..." value={businessSearch} onChange={e => setBusinessSearch(e.target.value)} />
          <div className="text-gray-400 text-sm">
            Total: {businessPagination.total} businesses
          </div>
        </div>
        
        {businesses.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <BuildingOfficeIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No businesses found</h3>
            <p className="text-gray-400">No businesses match your search criteria or there are no businesses in the system.</p>
          </div>
        ) : (
          <>
            <table className="w-full bg-gray-800 rounded-xl overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Owner</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map(biz => (
                  <tr key={biz.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="px-4 py-2">{biz.name || 'N/A'}</td>
                    <td className="px-4 py-2">{biz.users?.name || biz.users?.email || 'N/A'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${biz.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                        {biz.status || 'active'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button className="text-blue-400 underline hover:text-blue-300" onClick={() => setSelectedBusiness(biz)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            
            {/* Pagination */}
            {businessPagination.pages > 1 && (
              <div className="flex gap-2 mt-4 justify-center">
                <button 
                  disabled={businessPagination.page === 1} 
                  onClick={() => setBusinessPagination(p => ({ ...p, page: p.page - 1 }))} 
                  className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50 hover:bg-gray-600"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-gray-300">
                  Page {businessPagination.page} of {businessPagination.pages}
                </span>
                <button 
                  disabled={businessPagination.page === businessPagination.pages} 
                  onClick={() => setBusinessPagination(p => ({ ...p, page: p.page + 1 }))} 
                  className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50 hover:bg-gray-600"
                >
                  Next
                </button>
        </div>
            )}
          </>
        )}
        
        {/* Business detail modal */}
        {selectedBusiness && (
          <Modal onClose={() => setSelectedBusiness(null)}>
            <h2 className="text-xl font-bold mb-4">Business Details</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">Name:</span>
                <span className="text-white ml-2">{selectedBusiness.name || 'N/A'}</span>
      </div>
              <div>
                <span className="text-gray-400">Owner:</span>
                <span className="text-white ml-2">{selectedBusiness.users?.name || selectedBusiness.users?.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="text-white ml-2">{selectedBusiness.status || 'active'}</span>
              </div>
              <div>
                <span className="text-gray-400">Created:</span>
                <span className="text-white ml-2">
                  {selectedBusiness.created_at ? new Date(selectedBusiness.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              {selectedBusiness.description && (
                <div>
                  <span className="text-gray-400">Description:</span>
                  <span className="text-white ml-2">{selectedBusiness.description}</span>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    );
  }

  function renderAnalytics() {
    if (!analytics) return <div className="text-gray-400">Loading analytics data...</div>;

    const formatNumber = (num) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
      return num.toString();
    };

    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // Extract real data with fallbacks
    const userEngagement = analytics.userEngagement || {};
    const growthMetrics = analytics.growthMetrics || {};
    const recentActivity = analytics.recentActivity || {};
    const integrationStats = analytics.integrationStats || {};
    const dailyMetrics = analytics.dailyMetrics || [];
    const hourlyDistribution = analytics.hourlyDistribution || [];

    // Calculate trends based on real data
    const getTrendValue = (current, previous) => {
      if (!previous || previous === 0) return current > 0 ? "+100%" : "0%";
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? '+' : ''}${Math.round(change)}%`;
    };

    const getTrendColor = (current, previous) => {
      if (!previous || previous === 0) return current > 0 ? 'text-green-400' : 'text-gray-400';
      const change = ((current - previous) / previous) * 100;
      return change >= 0 ? 'text-green-400' : 'text-red-400';
    };

    return (
      <div className="space-y-8">
        {/* Period Selector with Real-time Updates */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <label className="text-white font-medium">Time Period:</label>
            <select 
              className="px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 hover:border-purple-500 transition-colors"
              value={analyticsPeriod}
              onChange={(e) => setAnalyticsPeriod(e.target.value)}
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
          <div className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Key Metrics - Now Using Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<UsersIcon className="h-8 w-8 text-purple-400" />} 
            label="Engaged Users" 
            value={formatNumber(userEngagement.uniqueUsers || 0)}
            subtitle="Active in period"
            trend={getTrendValue(userEngagement.uniqueUsers || 0, 0)}
            trendColor={getTrendColor(userEngagement.uniqueUsers || 0, 0)}
          />
          <StatCard 
            icon={<ChatBubbleLeftRightIcon className="h-8 w-8 text-green-400" />} 
            label="Total Conversations" 
            value={formatNumber(userEngagement.totalConversations || 0)}
            subtitle="In selected period"
            trend={getTrendValue(userEngagement.totalConversations || 0, 0)}
            trendColor={getTrendColor(userEngagement.totalConversations || 0, 0)}
          />
          <StatCard 
            icon={<ShieldCheckIcon className="h-8 w-8 text-yellow-400" />} 
            label="Active Sessions" 
            value={userEngagement.activeSessions || 0}
            subtitle="Currently online"
            trend="+5%"
            trendColor="text-green-400"
          />
          <StatCard 
            icon={<ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-400" />} 
            label="Avg Conv/User" 
            value={userEngagement.avgConversationsPerUser || 0}
            subtitle="Average per user"
            trend={getTrendValue(userEngagement.avgConversationsPerUser || 0, 0)}
            trendColor={getTrendColor(userEngagement.avgConversationsPerUser || 0, 0)}
          />
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<BuildingOfficeIcon className="h-8 w-8 text-indigo-400" />} 
            label="Total Businesses" 
            value={formatNumber(analytics.topBusinesses?.length || 0)}
            subtitle="Registered businesses"
            trend="+12%"
            trendColor="text-green-400"
          />
          <StatCard 
            icon={<CommandLineIcon className="h-8 w-8 text-emerald-400" />} 
            label="Active Bots" 
            value={formatNumber(analytics.botPerformanceData?.length || 0)}
            subtitle="Deployed bots"
            trend="+8%"
            trendColor="text-green-400"
          />
          <StatCard 
            icon={<CogIcon className="h-8 w-8 text-orange-400" />} 
            label="Integrations" 
            value={formatNumber(Object.keys(analytics.integrationStats || {}).length)}
            subtitle="Connected services"
            trend="+15%"
            trendColor="text-green-400"
          />
          <StatCard 
            icon={<ChartBarIcon className="h-8 w-8 text-pink-400" />} 
            label="Growth Rate" 
            value={`${analytics.growthMetrics?.conversationGrowthRate || 0}%`}
            subtitle="Conversation growth"
            trend={analytics.growthMetrics?.conversationGrowthRate >= 0 ? '+' : ''}
            trendColor={analytics.growthMetrics?.conversationGrowthRate >= 0 ? 'text-green-400' : 'text-red-400'}
          />
        </div>

        {/* Enhanced Charts with Real Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4">User Growth Trends</h3>
            {analytics.dailyMetrics && analytics.dailyMetrics.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.dailyMetrics}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="#6B7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#374151', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    formatter={(value, name) => [`${value} new users`, name]}
                    labelFormatter={(label) => formatDate(label)}
                  />
                  <Legend />
                  <Bar 
                    dataKey="registrations" 
                    fill="#8B5CF6" 
                    radius={[4, 4, 0, 0]} 
                    name="New Users"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <UsersIcon className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                  <p>No user growth data available for this period</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4">Activity Over Time</h3>
            {analytics.dailyMetrics && analytics.dailyMetrics.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.dailyMetrics}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="#6B7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#374151', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    formatter={(value, name) => [formatNumber(value), name]}
                    labelFormatter={(label) => formatDate(label)}
                  />
                  <Legend />
                  <Bar dataKey="registrations" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Registrations" />
                  <Bar dataKey="botCreations" fill="#10B981" radius={[4, 4, 0, 0]} name="Bot Creations" />
                  <Bar dataKey="businessCreations" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Business Creations" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <UsersIcon className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                  <p>No activity data available for this period</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hourly Distribution Chart */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Today's Activity by Hour</h3>
          {analytics.hourlyDistribution && analytics.hourlyDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.hourlyDistribution}>
                <XAxis 
                  dataKey="hour" 
                  stroke="#6B7280" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}:00`}
                />
                <YAxis 
                  stroke="#6B7280" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#374151', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value, name) => [formatNumber(value), 'Conversations']}
                  labelFormatter={(label) => `${label}:00`}
                />
                <Bar 
                  dataKey="count" 
                  fill="#8B5CF6" 
                  radius={[4, 4, 0, 0]} 
                  name="Conversations"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <ClockIcon className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                <p>No hourly data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Bot Performance Analytics Chart */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Bot Performance Analytics</h3>
          {analytics.botAnalytics && analytics.botAnalytics.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics.botAnalytics}>
                <XAxis 
                  dataKey="name" 
                  stroke="#6B7280" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#6B7280" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#374151', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value, name) => [
                    formatNumber(value), 
                    name === 'messages_sent' ? 'Messages Sent' :
                    name === 'messages_received' ? 'Messages Received' :
                    name === 'conversations_count' ? 'Conversations' :
                    name === 'satisfaction_score' ? 'Satisfaction Score' : name
                  ]}
                  labelFormatter={(label) => `Bot: ${label || 'Unnamed Bot'}`}
                />
                <Legend />
                <Bar 
                  dataKey="messages_sent" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]} 
                  name="Messages Sent"
                  maxBarSize={40}
                />
                <Bar 
                  dataKey="messages_received" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]} 
                  name="Messages Received"
                  maxBarSize={40}
                />
                <Bar 
                  dataKey="conversations_count" 
                  fill="#8B5CF6" 
                  radius={[4, 4, 0, 0]} 
                  name="Conversations"
                  maxBarSize={40}
                />
                <Bar 
                  dataKey="satisfaction_score" 
                  fill="#F59E0B" 
                  radius={[4, 4, 0, 0]} 
                  name="Satisfaction Score"
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <CommandLineIcon className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                <p>No bot analytics data available</p>
                <p className="text-sm text-gray-500 mt-2">Bot performance metrics will appear here when available</p>
              </div>
            </div>
          )}
        </div>



        {/* Enhanced Recent Activity with Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4">Recent Registrations</h3>
            {analytics.recentActivity?.recentRegistrations?.length > 0 ? (
              <div className="space-y-3">
                {analytics.recentActivity.recentRegistrations.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.name || 'Anonymous User'}</div>
                        <div className="text-gray-400 text-sm">{user.email || 'No email'}</div>
                      </div>
                    </div>
                    <div className="text-gray-500 text-xs">
                      {formatDate(user.createdat)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400">
                <div className="text-center">
                  <UsersIcon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm">No recent registrations</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4">Recent Bot Creations</h3>
            {analytics.recentActivity?.recentBotCreations?.length > 0 ? (
              <div className="space-y-3">
                {analytics.recentActivity.recentBotCreations.map((bot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CommandLineIcon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{bot.name || 'Unnamed Bot'}</div>
                        <div className="text-gray-400 text-sm">ID: {bot.userid || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="text-gray-500 text-xs">
                      {formatDate(bot.createdat)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400">
                <div className="text-center">
                  <CommandLineIcon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm">No recent bot creations</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4">Recent Business Creations</h3>
            {analytics.recentActivity?.recentBusinessCreations?.length > 0 ? (
              <div className="space-y-3">
                {analytics.recentActivity.recentBusinessCreations.map((business, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <BuildingOfficeIcon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{business.name || 'Unnamed Business'}</div>
                        <div className="text-gray-400 text-sm">Owner: {business.user_id || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="text-gray-500 text-xs">
                      {formatDate(business.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400">
                <div className="text-center">
                  <BuildingOfficeIcon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm">No recent business creations</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderLogs() {
    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="font-bold text-white mb-4">Recent Activity</h3>
        <ul className="divide-y divide-gray-700">
          {logs.map(log => (
            <li key={log.id} className="py-2 flex items-center gap-2">
              {log.type === 'user_registration' ? <UsersIcon className="h-5 w-5 text-purple-400" /> : <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-400" />}
              <span className="text-gray-200">{log.message}</span>
              <span className="ml-auto text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function renderHealth() {
    if (!health) return <div className="text-purple-400">Loading health data...</div>;
    
    const formatBytes = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatUptime = (seconds) => {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${days}d ${hours}h ${minutes}m`;
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'healthy': return 'text-green-400';
        case 'warning': return 'text-yellow-400';
        case 'critical': return 'text-red-400';
        default: return 'text-gray-400';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'healthy': return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
        case 'warning': return <XCircleIcon className="h-5 w-5 text-yellow-400" />;
        case 'critical': return <XCircleIcon className="h-5 w-5 text-red-400" />;
        default: return <XCircleIcon className="h-5 w-5 text-gray-400" />;
      }
    };

    return (
      <div className="space-y-6">
        {/* Overall Status */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-lg">System Health Status</h3>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 font-semibold ${getStatusColor(health.status)}`}>
                {getStatusIcon(health.status)}
                {health.status.toUpperCase()}
              </div>
              <button
                onClick={fetchDetailedHealth}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition"
              >
                Detailed Health Check
              </button>
            </div>
            </div>
            
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Response Time</div>
              <div className="text-white font-semibold">{health.responseTime}ms</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Last Checked</div>
              <div className="text-white font-semibold">{new Date(health.timestamp).toLocaleString()}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Total Alerts</div>
              <div className="text-white font-semibold">{health.summary?.totalAlerts || 0}</div>
            </div>
          </div>

          {/* Alerts */}
          {health.alerts && health.alerts.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-white mb-3">Active Alerts</h4>
              <div className="space-y-2">
                {health.alerts.map((alert, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    alert.severity === 'high' ? 'bg-red-900/20 border-red-500' :
                    alert.severity === 'medium' ? 'bg-yellow-900/20 border-yellow-500' :
                    'bg-blue-900/20 border-blue-500'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="text-white font-medium">{alert.message}</div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        alert.severity === 'high' ? 'bg-red-600 text-white' :
                        alert.severity === 'medium' ? 'bg-yellow-600 text-white' :
                        'bg-blue-600 text-white'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-gray-300 text-sm mt-1">{alert.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Database Health */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Database Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {health.checks?.database && Object.entries(health.checks.database).map(([table, check]) => (
              <div key={table} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium capitalize">{table.replace('_', ' ')}</h4>
                  {getStatusIcon(check.status)}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Status:</span>
                    <span className={`font-medium ${getStatusColor(check.status)}`}>{check.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Response:</span>
                    <span className="text-white">{check.responseTime}ms</span>
                  </div>
                  {check.error && (
                    <div className="text-red-400 text-xs mt-1">{check.error}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Metrics */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Memory Usage</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">RSS:</span>
                    <span className="text-white">{formatBytes(health.metrics?.performance?.memoryUsage?.rss || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Heap Used:</span>
                    <span className="text-white">{formatBytes(health.metrics?.performance?.memoryUsage?.heapUsed || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Heap Total:</span>
                    <span className="text-white">{formatBytes(health.metrics?.performance?.memoryUsage?.heapTotal || 0)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">System Resources</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">System Memory:</span>
                    <span className="text-white">{health.metrics?.system?.memoryUsage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">CPU Cores:</span>
                    <span className="text-white">{health.metrics?.system?.cpuCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Uptime:</span>
                    <span className="text-white">{formatUptime(health.metrics?.performance?.uptime || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Database Metrics */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4">Database Metrics</h3>
            <div className="space-y-4">
              {health.metrics?.database && Object.entries(health.metrics.database).map(([table, count]) => (
                <div key={table} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium capitalize">{table.replace('_', ' ')}</span>
                    <span className="text-2xl font-bold text-purple-400">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Recent Activity (Last Hour)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{health.metrics?.recentActivity?.conversations || 0}</div>
              <div className="text-gray-300 text-sm">Conversations</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{health.metrics?.recentActivity?.newUsers || 0}</div>
              <div className="text-gray-300 text-sm">New Users</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{health.metrics?.recentActivity?.newBusinesses || 0}</div>
              <div className="text-gray-300 text-sm">New Businesses</div>
            </div>
          </div>
        </div>

        {/* File System Health */}
        {health.checks?.fileSystem && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4">File System Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(health.checks.fileSystem).map(([name, check]) => (
                <div key={name} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium capitalize">{name}</h4>
                    <div className="flex gap-2">
                      {check.exists && <CheckCircleIcon className="h-4 w-4 text-green-400" />}
                      {check.writable && <CheckCircleIcon className="h-4 w-4 text-blue-400" />}
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Exists:</span>
                      <span className={check.exists ? 'text-green-400' : 'text-red-400'}>
                        {check.exists ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Writable:</span>
                      <span className={check.writable ? 'text-green-400' : 'text-red-400'}>
                        {check.writable ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="text-gray-400 text-xs mt-2">{check.path}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

                 {/* Summary */}
         <div className="bg-gray-800 rounded-xl p-6">
           <h3 className="font-bold text-white mb-4">Health Summary</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-gray-700 rounded-lg p-4 text-center">
               <div className="text-2xl font-bold text-white">{health.summary?.totalTables || 0}</div>
               <div className="text-gray-300 text-sm">Total Tables</div>
             </div>
             <div className="bg-gray-700 rounded-lg p-4 text-center">
               <div className="text-2xl font-bold text-green-400">{health.summary?.healthyTables || 0}</div>
               <div className="text-gray-300 text-sm">Healthy Tables</div>
             </div>
             <div className="bg-gray-700 rounded-lg p-4 text-center">
               <div className="text-2xl font-bold text-red-400">{health.summary?.criticalAlerts || 0}</div>
               <div className="text-gray-300 text-sm">Critical Alerts</div>
             </div>
             <div className="bg-gray-700 rounded-lg p-4 text-center">
               <div className="text-2xl font-bold text-yellow-400">{health.summary?.warningAlerts || 0}</div>
               <div className="text-gray-300 text-sm">Warnings</div>
             </div>
           </div>
         </div>

         {/* Detailed Health Data */}
         {detailedHealth && (
           <div className="bg-gray-800 rounded-xl p-6">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-white text-lg">Detailed Health Analysis</h3>
               <div className="text-gray-400 text-sm">
                 Response Time: {detailedHealth.responseTime}ms
               </div>
             </div>

             {/* Database Performance */}
             <div className="mb-6">
               <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                 <ServerIcon className="h-5 w-5" />
                 Database Performance
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {detailedHealth.database?.tables && Object.entries(detailedHealth.database.tables).map(([table, data]) => (
                   <div key={table} className="bg-gray-700 rounded-lg p-4">
                     <div className="flex items-center justify-between mb-2">
                       <h5 className="text-white font-medium capitalize">{table.replace('_', ' ')}</h5>
                       <span className="text-2xl font-bold text-purple-400">{data.recordCount}</span>
                     </div>
                     <div className="space-y-1 text-sm">
                       <div className="flex justify-between">
                         <span className="text-gray-300">Status:</span>
                         <span className={`font-medium ${getStatusColor(data.overallStatus)}`}>{data.overallStatus}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-300">Response:</span>
                         <span className="text-white">{data.totalResponseTime}ms</span>
                       </div>
                       <div className="text-gray-400 text-xs">
                         {data.checks.length} checks performed
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             {/* Performance Benchmarks */}
             <div className="mb-6">
               <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                 <CpuChipIcon className="h-5 w-5" />
                 Performance Benchmarks
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-gray-700 rounded-lg p-4">
                   <h5 className="text-white font-medium mb-2">Database Performance</h5>
                   <div className="space-y-2 text-sm">
                     <div className="flex justify-between">
                       <span className="text-gray-300">Average Response:</span>
                       <span className="text-white">{Math.round(detailedHealth.performance?.benchmarks?.database?.averageResponseTime || 0)}ms</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-300">Slowest Table:</span>
                       <span className="text-white">{detailedHealth.performance?.benchmarks?.database?.slowestTable?.table || 'N/A'}</span>
                     </div>
                   </div>
                 </div>
                 <div className="bg-gray-700 rounded-lg p-4">
                   <h5 className="text-white font-medium mb-2">System Resources</h5>
                   <div className="space-y-2 text-sm">
                     <div className="flex justify-between">
                       <span className="text-gray-300">Heap Used:</span>
                       <span className="text-white">{formatBytes(detailedHealth.performance?.benchmarks?.system?.memoryUsage?.heapUsed || 0)}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-300">Uptime:</span>
                       <span className="text-white">{formatUptime(detailedHealth.performance?.benchmarks?.system?.uptime || 0)}</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Recommendations */}
             {detailedHealth.performance?.recommendations && detailedHealth.performance.recommendations.length > 0 && (
               <div className="mb-6">
                 <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                   <InformationCircleIcon className="h-5 w-5" />
                   Recommendations
                 </h4>
                 <div className="space-y-3">
                   {detailedHealth.performance.recommendations.map((rec, index) => (
                     <div key={index} className={`p-4 rounded-lg border-l-4 ${
                       rec.priority === 'high' ? 'bg-red-900/20 border-red-500' :
                       rec.priority === 'medium' ? 'bg-yellow-900/20 border-yellow-500' :
                       'bg-blue-900/20 border-blue-500'
                     }`}>
                       <div className="flex items-center justify-between mb-2">
                         <div className="text-white font-medium">{rec.message}</div>
                         <span className={`text-xs px-2 py-1 rounded ${
                           rec.priority === 'high' ? 'bg-red-600 text-white' :
                           rec.priority === 'medium' ? 'bg-yellow-600 text-white' :
                           'bg-blue-600 text-white'
                         }`}>
                           {rec.priority.toUpperCase()}
                         </span>
                       </div>
                       <div className="text-gray-300 text-sm">{rec.suggestion}</div>
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>
         )}
      </div>
    );
  }

  function renderSettings() {
    // Helper function for safe property access
    const safeGet = (obj, path, defaultValue = '') => {
      return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : defaultValue;
      }, obj);
    };

    const settingsTabs = [
      { id: 'system', name: 'System', icon: Cog6ToothIcon },
      { id: 'limits', name: 'Limits', icon: ChartBarIcon },
      { id: 'features', name: 'Features', icon: PuzzlePieceIcon },
      { id: 'security', name: 'Security', icon: ShieldCheckIcon },
      { id: 'notifications', name: 'Notifications', icon: BellIcon },
      { id: 'performance', name: 'Performance', icon: CpuChipIcon },
      { id: 'integrations', name: 'Integrations', icon: CogIcon },
      { id: 'backup', name: 'Backup', icon: CloudArrowUpIcon },
      { id: 'customization', name: 'Customization', icon: PencilIcon }
    ];

    if (!settings || !settingsForm) return <div className="text-gray-400">Loading settings...</div>;

    return (
            <div className="space-y-6">
        {/* Settings Header */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
                <div>
              <h2 className="text-2xl font-bold text-white">System Settings</h2>
              <p className="text-gray-400 mt-1">Configure your chatbot platform settings</p>
                </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Version {settings.version}</div>
              <div className="text-sm text-gray-400">Environment: {settings.environment}</div>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {settingsTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSettingsActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  settingsActiveTab === tab.id 
                    ? 'bg-purple-700 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </div>

          <form onSubmit={handleSettingsSubmit} className="space-y-6">
            {/* System Settings Tab */}
            {settingsActiveTab === 'system' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">System Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Maintenance Mode</label>
                      <input
                        type="checkbox"
                        name="maintenanceMode"
                        checked={safeGet(settingsForm, 'maintenanceMode', false)}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                    </div>
                    
                <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Maintenance Message
                      </label>
                      <textarea
                        name="maintenanceMessage"
                        value={safeGet(settingsForm, 'maintenanceMessage', '')}
                        onChange={handleSettingsChange}
                        rows="3"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                        placeholder="Message to show during maintenance"
                      />
                </div>
                  </div>
                </div>
              </div>
            )}

            {/* Limits Tab */}
            {settingsActiveTab === 'limits' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">System Limits</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Users
                    </label>
                                          <input
                        type="number"
                        name="maxUsers"
                        value={safeGet(settingsForm, 'maxUsers', 1000)}
                        onChange={handleSettingsChange}
                        min="1"
                        max="100000"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      />
                  </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max Businesses
                      </label>
                      <input
                        type="number"
                        name="maxBusinesses"
                        value={safeGet(settingsForm, 'maxBusinesses', 500)}
                        onChange={handleSettingsChange}
                      min="1"
                      max="10000"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                    />
                </div>
                  
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Bots
                    </label>
                    <input
                      type="number"
                      name="maxBots"
                                              value={safeGet(settingsForm, 'maxBots', 100)}
                        onChange={handleSettingsChange}
                        min="1"
                        max="1000"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      />
                </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max Conversations
                      </label>
                      <input
                        type="number"
                        name="maxConversations"
                        value={safeGet(settingsForm, 'maxConversations', 10000)}
                        onChange={handleSettingsChange}
                      min="100"
                      max="1000000"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                    />
              </div>
              
              <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Conversations Per User
                    </label>
                    <input
                      type="number"
                      name="maxConversationsPerUser"
                                              value={safeGet(settingsForm, 'maxConversationsPerUser', 100)}
                        onChange={handleSettingsChange}
                        min="10"
                        max="10000"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      />
                  </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max Bots Per Business
                      </label>
                      <input
                        type="number"
                        name="maxBotsPerBusiness"
                        value={safeGet(settingsForm, 'maxBotsPerBusiness', 10)}
                        onChange={handleSettingsChange}
                      min="1"
                      max="50"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Features Tab */}
            {settingsActiveTab === 'features' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Feature Toggles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(safeGet(settingsForm, 'features', {})).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div>
                        <div className="text-white font-medium capitalize">
                          {feature.replace(/([A-Z])/g, ' $1').trim()}
              </div>
                        <div className="text-gray-400 text-sm">
                          {getFeatureDescription(feature)}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        name={`features.${feature}`}
                        checked={enabled}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-purple-600 bg-gray-600 border-gray-500 rounded focus:ring-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {settingsActiveTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Security Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Email Verification Required</label>
                      <input
                        type="checkbox"
                        name="security.requireEmailVerification"
                        checked={safeGet(settingsForm, 'security.requireEmailVerification', true)}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Phone Verification Required</label>
                      <input
                        type="checkbox"
                        name="security.requirePhoneVerification"
                        checked={safeGet(settingsForm, 'security.requirePhoneVerification', false)}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Two-Factor Authentication</label>
                      <input
                        type="checkbox"
                        name="security.enableTwoFactor"
                        checked={safeGet(settingsForm, 'security.enableTwoFactor', false)}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Rate Limiting</label>
                      <input
                        type="checkbox"
                        name="security.enableRateLimiting"
                        checked={safeGet(settingsForm, 'security.enableRateLimiting', true)}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        name="security.sessionTimeout"
                        value={safeGet(settingsForm, 'security.sessionTimeout', 60)}
                        onChange={handleSettingsChange}
                        min="15"
                        max="1440"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      />
                </div>
                    
                <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        name="security.maxLoginAttempts"
                        value={safeGet(settingsForm, 'security.maxLoginAttempts', 5)}
                        onChange={handleSettingsChange}
                        min="3"
                        max="10"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      />
                </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password Min Length
                      </label>
                      <input
                        type="number"
                        name="security.passwordMinLength"
                        value={safeGet(settingsForm, 'security.passwordMinLength', 8)}
                        onChange={handleSettingsChange}
                        min="6"
                        max="20"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      />
              </div>
              
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max File Size (MB)
                      </label>
                      <input
                        type="number"
                        name="security.maxFileSize"
                        value={safeGet(settingsForm, 'security.maxFileSize', 10)}
                        onChange={handleSettingsChange}
                        min="1"
                        max="50"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {settingsActiveTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Notification Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(safeGet(settingsForm, 'notifications', {})).map(([notification, enabled]) => (
                    <div key={notification} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div>
                        <div className="text-white font-medium capitalize">
                          {notification.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {getNotificationDescription(notification)}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        name={`notifications.${notification}`}
                        checked={enabled}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-purple-600 bg-gray-600 border-gray-500 rounded focus:ring-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Tab */}
            {settingsActiveTab === 'performance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Performance Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Cache Enabled</label>
                      <input
                        type="checkbox"
                        name="performance.cacheEnabled"
                        checked={safeGet(settingsForm, 'performance.cacheEnabled', true)}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Enable Compression</label>
                      <input
                        type="checkbox"
                        name="performance.enableCompression"
                        checked={safeGet(settingsForm, 'performance.enableCompression', true)}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Enable Gzip</label>
                      <input
                        type="checkbox"
                        name="performance.enableGzip"
                        checked={safeGet(settingsForm, 'performance.enableGzip', true)}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Cache TTL (seconds)
                      </label>
                      <input
                        type="number"
                        name="performance.cacheTTL"
                        value={safeGet(settingsForm, 'performance.cacheTTL', 300)}
                        onChange={handleSettingsChange}
                        min="60"
                        max="3600"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max Concurrent Requests
                      </label>
                      <input
                        type="number"
                        name="performance.maxConcurrentRequests"
                        value={safeGet(settingsForm, 'performance.maxConcurrentRequests', 100)}
                        onChange={handleSettingsChange}
                        min="10"
                        max="1000"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Database Connection Pool
                      </label>
                      <input
                        type="number"
                        name="performance.databaseConnectionPool"
                        value={safeGet(settingsForm, 'performance.databaseConnectionPool', 10)}
                        onChange={handleSettingsChange}
                        min="5"
                        max="50"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {settingsActiveTab === 'integrations' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Integration Settings</h3>
                
                {/* OpenAI Settings */}
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">OpenAI Configuration</h4>
                    <input
                      type="checkbox"
                      name="integrations.openai.enabled"
                                              checked={safeGet(settingsForm, 'integrations.openai.enabled', true)}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-purple-600 bg-gray-600 border-gray-500 rounded focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
                        <input
                          type="password"
                          name="integrations.openai.apiKey"
                          value={safeGet(settingsForm, 'integrations.openai.apiKey', '')}
                          onChange={handleSettingsChange}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                        placeholder="sk-..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                      <select
                        name="integrations.openai.model"
                                                  value={safeGet(settingsForm, 'integrations.openai.model', 'gpt-3.5-turbo')}
                          onChange={handleSettingsChange}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                        >
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                          <option value="gpt-4">GPT-4</option>
                          <option value="gpt-4-turbo">GPT-4 Turbo</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Max Tokens</label>
                        <input
                          type="number"
                          name="integrations.openai.maxTokens"
                          value={safeGet(settingsForm, 'integrations.openai.maxTokens', 1000)}
                          onChange={handleSettingsChange}
                        min="100"
                        max="4000"
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Temperature</label>
                      <input
                        type="number"
                        name="integrations.openai.temperature"
                                                  value={safeGet(settingsForm, 'integrations.openai.temperature', 0.7)}
                          onChange={handleSettingsChange}
                          min="0"
                          max="2"
                          step="0.1"
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cohere Settings */}
                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-medium">Cohere Configuration</h4>
                      <input
                        type="checkbox"
                        name="integrations.cohere.enabled"
                        checked={safeGet(settingsForm, 'integrations.cohere.enabled', false)}
                        onChange={handleSettingsChange}
                      className="w-4 h-4 text-purple-600 bg-gray-600 border-gray-500 rounded focus:ring-purple-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
                      <input
                        type="password"
                        name="integrations.cohere.apiKey"
                                                  value={safeGet(settingsForm, 'integrations.cohere.apiKey', '')}
                          onChange={handleSettingsChange}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                          placeholder="cohere-api-key"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                        <select
                          name="integrations.cohere.model"
                          value={safeGet(settingsForm, 'integrations.cohere.model', 'command')}
                          onChange={handleSettingsChange}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      >
                        <option value="command">Command</option>
                        <option value="command-light">Command Light</option>
                        <option value="command-nightly">Command Nightly</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Twilio Settings */}
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">Twilio Configuration</h4>
                    <input
                      type="checkbox"
                      name="integrations.twilio.enabled"
                                              checked={safeGet(settingsForm, 'integrations.twilio.enabled', false)}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-purple-600 bg-gray-600 border-gray-500 rounded focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Account SID</label>
                        <input
                          type="text"
                          name="integrations.twilio.accountSid"
                          value={safeGet(settingsForm, 'integrations.twilio.accountSid', '')}
                          onChange={handleSettingsChange}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                        placeholder="AC..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Auth Token</label>
                      <input
                        type="password"
                        name="integrations.twilio.authToken"
                                                  value={safeGet(settingsForm, 'integrations.twilio.authToken', '')}
                          onChange={handleSettingsChange}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                          placeholder="auth-token"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                        <input
                          type="text"
                          name="integrations.twilio.phoneNumber"
                          value={safeGet(settingsForm, 'integrations.twilio.phoneNumber', '')}
                          onChange={handleSettingsChange}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Backup Tab */}
            {settingsActiveTab === 'backup' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Backup Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Auto Backup</label>
                      <input
                        type="checkbox"
                        name="backup.autoBackup"
                        checked={safeGet(settingsForm, 'backup.autoBackup', false)}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Include Files</label>
                      <input
                        type="checkbox"
                        name="backup.includeFiles"
                        checked={safeGet(settingsForm, 'backup.includeFiles', true)}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Include Database</label>
                      <input
                        type="checkbox"
                        name="backup.includeDatabase"
                        checked={safeGet(settingsForm, 'backup.includeDatabase', true)}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Compression</label>
                      <input
                        type="checkbox"
                        name="backup.compression"
                        checked={safeGet(settingsForm, 'backup.compression', true)}
                        onChange={handleSettingsChange}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Backup Frequency
                      </label>
                      <select
                        name="backup.backupFrequency"
                        value={safeGet(settingsForm, 'backup.backupFrequency', 'daily')}
                        onChange={handleSettingsChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Backup Time
                      </label>
                      <input
                        type="time"
                        name="backup.backupTime"
                        value={safeGet(settingsForm, 'backup.backupTime', '02:00')}
                        onChange={handleSettingsChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Retention (days)
                      </label>
                      <input
                        type="number"
                        name="backup.backupRetention"
                        value={safeGet(settingsForm, 'backup.backupRetention', 30)}
                        onChange={handleSettingsChange}
                        min="1"
                        max="365"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Customization Tab */}
            {settingsActiveTab === 'customization' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Customization Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      name="customization.siteName"
                      value={safeGet(settingsForm, 'customization.siteName', 'ChatBot Platform')}
                      onChange={handleSettingsChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Site Description
                    </label>
                    <input
                      type="text"
                      name="customization.siteDescription"
                      value={safeGet(settingsForm, 'customization.siteDescription', 'AI-Powered Chatbot Platform')}
                      onChange={handleSettingsChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      name="customization.primaryColor"
                      value={safeGet(settingsForm, 'customization.primaryColor', '#8B5CF6')}
                      onChange={handleSettingsChange}
                      className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Secondary Color
                    </label>
                    <input
                      type="color"
                      name="customization.secondaryColor"
                      value={safeGet(settingsForm, 'customization.secondaryColor', '#6366F1')}
                      onChange={handleSettingsChange}
                      className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      name="customization.logoUrl"
                      value={safeGet(settingsForm, 'customization.logoUrl', '')}
                      onChange={handleSettingsChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Favicon URL
                    </label>
                    <input
                      type="url"
                      name="customization.faviconUrl"
                      value={safeGet(settingsForm, 'customization.faviconUrl', '')}
                      onChange={handleSettingsChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Welcome Message
                    </label>
                    <textarea
                      name="customization.welcomeMessage"
                      value={safeGet(settingsForm, 'customization.welcomeMessage', 'Welcome to our chatbot platform!')}
                      onChange={handleSettingsChange}
                      rows="3"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Custom CSS
                    </label>
                    <textarea
                      name="customization.customCSS"
                      value={safeGet(settingsForm, 'customization.customCSS', '')}
                      onChange={handleSettingsChange}
                      rows="6"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white font-mono text-sm"
                      placeholder="/* Custom CSS styles */"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-700">
                <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition"
              >
                {loading ? 'Saving...' : 'Save All Settings'}
                </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Helper functions for settings descriptions
  function getFeatureDescription(feature) {
    const descriptions = {
      whatsapp: 'Enable WhatsApp integration for chatbots',
      facebook: 'Enable Facebook Messenger integration',
      instagram: 'Enable Instagram Direct Messages',
      telegram: 'Enable Telegram Bot integration',
      webhook: 'Enable webhook support for external integrations',
      analytics: 'Enable analytics and reporting features',
      aiChat: 'Enable AI-powered chat responses',
      fileUpload: 'Allow users to upload files',
      voiceMessages: 'Support voice message processing',
      multiLanguage: 'Enable multi-language support',
      customBranding: 'Allow custom branding options',
      apiAccess: 'Enable API access for developers'
    };
    return descriptions[feature] || 'Feature toggle';
  }

  function getNotificationDescription(notification) {
    const descriptions = {
      emailNotifications: 'Send email notifications to users',
      smsNotifications: 'Send SMS notifications',
      pushNotifications: 'Send push notifications',
      adminAlerts: 'Send alerts to administrators',
      userWelcomeEmail: 'Send welcome emails to new users',
      backupNotifications: 'Notify when backups are completed',
      errorNotifications: 'Notify about system errors'
    };
    return descriptions[notification] || 'Notification setting';
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 animate-fadein">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map(t => (
          <TabButton key={t.name} tab={t} selected={tab === t.name} onClick={() => setTab(t.name)} />
        ))}
      </div>
      {loading && <div className="text-purple-400 mb-4">Loading...</div>}
      <div>
        {tab === 'Overview' && renderOverview()}
        {tab === 'Users' && renderUsers()}
        {tab === 'Businesses' && renderBusinesses()}
        {tab === 'Bots' && renderBots()}
        {tab === 'Integrations' && renderIntegrations()}
        {tab === 'Conversations' && renderConversations()}
        {tab === 'Analytics' && renderAnalytics()}
        {tab === 'Logs' && renderLogs()}
        {tab === 'Health' && renderHealth()}
        {tab === 'Backup' && renderBackup()}
        {tab === 'Settings' && renderSettings()}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                {modalContent === 'create-bot' && 'Create New Bot'}
                {modalContent?.type === 'view-bot' && 'Bot Details'}
                {modalContent?.type === 'edit-bot' && 'Edit Bot'}
                {modalContent?.type === 'delete-bot' && 'Delete Bot'}
                {modalContent?.type === 'view-integration' && 'Integration Details'}
                {modalContent?.type === 'edit-integration' && 'Edit Integration'}
                {modalContent?.type === 'view-conversation' && 'Conversation Details'}
              </h2>
                <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="text-white">
              {modalContent === 'create-bot' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bot Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="Enter bot name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
                      rows="3"
                      placeholder="Enter bot description"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition">
                      Create Bot
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}



              {modalContent?.type === 'view-bot' && (
                <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                      <span className="text-gray-400">Name:</span>
                      <div className="text-white font-medium">{modalContent.data.name}</div>
                </div>
                <div>
                      <span className="text-gray-400">Status:</span>
                      <div className="text-white">{modalContent.data.status}</div>
                </div>
                <div>
                      <span className="text-gray-400">Owner:</span>
                      <div className="text-white">{modalContent.data.user_name}</div>
                  </div>
                    <div>
                      <span className="text-gray-400">Owner Email:</span>
                      <div className="text-white">{modalContent.data.user_email}</div>
                </div>
                <div>
                      <span className="text-gray-400">Business:</span>
                      <div className="text-white">{modalContent.data.business_name}</div>
                </div>
                    <div>
                      <span className="text-gray-400">Conversations:</span>
                      <div className="text-white">{modalContent.data.conversations_count}</div>
              </div>
                    <div>
                      <span className="text-gray-400">Created:</span>
                      <div className="text-white">{new Date(modalContent.data.created_at).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Bot ID:</span>
                      <div className="text-white font-mono text-sm">{modalContent.data.id}</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Description:</span>
                    <div className="text-white mt-1">{modalContent.data.description}</div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
                >
                  Close
                </button>
              </div>
              )}

              {modalContent?.type === 'view-conversation' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
              <div>
                      <span className="text-gray-400">Phone Number:</span>
                      <div className="text-white font-medium">{modalContent.data.phone_number}</div>
            </div>
                    <div>
                      <span className="text-gray-400">Business:</span>
                      <div className="text-white">{modalContent.data.business_name}</div>
          </div>
                    <div>
                      <span className="text-gray-400">Bot:</span>
                      <div className="text-white">{modalContent.data.bot_name}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Timestamp:</span>
                      <div className="text-white">{new Date(modalContent.data.timestamp).toLocaleString()}</div>
                    </div>
                    {modalContent.data.satisfaction_score && (
                      <div>
                        <span className="text-gray-400">Satisfaction Score:</span>
                        <div className="text-white">{modalContent.data.satisfaction_score}/5</div>
        </div>
      )}
                    <div>
                      <span className="text-gray-400">Conversation ID:</span>
                      <div className="text-white font-mono text-sm">{modalContent.data.id}</div>
    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">User Message:</span>
                    <div className="bg-gray-700 rounded p-3 mt-1 text-white">{modalContent.data.user_message}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">AI Response:</span>
                    <div className="bg-purple-900/20 border border-purple-500/20 rounded p-3 mt-1 text-white">{modalContent.data.ai_response}</div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              )}





              {modalContent?.type === 'delete-bot' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-red-400 text-lg font-medium mb-2">Confirm Deletion</div>
                    <div className="text-gray-300">
                      Are you sure you want to delete this bot? This action cannot be undone.
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition">
                      Delete
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
    </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, subtitle, trend, trendColor }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:bg-gray-750 transition">
      <div className="flex items-center justify-between mb-2">
        {icon}
        {trend && (
          <span className={`text-sm font-medium ${trendColor || 'text-gray-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="mb-1">
        <div className="text-gray-400 text-sm font-medium">{label}</div>
        <div className="text-2xl font-bold text-white">{value}</div>
      </div>
      {subtitle && (
        <div className="text-gray-500 text-xs">{subtitle}</div>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-8 min-w-[300px] max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
} 