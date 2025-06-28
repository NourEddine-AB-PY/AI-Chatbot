import { useState, useEffect } from 'react'
import { 
  UsersIcon, 
  ChatBubbleLeftRightIcon, 
  Cog6ToothIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PhoneIcon,
  GlobeAltIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline'

const mockClients = [
  {
    id: 1,
    businessName: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    status: 'active',
    whatsappNumber: '+1 (555) 123-4567',
    setupDate: '2024-01-15',
    conversations: 45,
    lastActivity: '2 hours ago'
  },
  {
    id: 2,
    businessName: 'Green Gardens',
    email: 'info@greengardens.com',
    status: 'setup_in_progress',
    whatsappNumber: null,
    setupDate: '2024-01-20',
    conversations: 0,
    lastActivity: 'Never'
  },
  {
    id: 3,
    businessName: 'QuickFix Auto',
    email: 'service@quickfixauto.com',
    status: 'active',
    whatsappNumber: '+1 (555) 987-6543',
    setupDate: '2024-01-10',
    conversations: 128,
    lastActivity: '30 minutes ago'
  }
]

export default function AdminDashboard() {
  const [clients, setClients] = useState(mockClients)
  const [selectedClient, setSelectedClient] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'setup_in_progress': return 'text-yellow-400'
      case 'inactive': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="h-5 w-5 text-green-400" />
      case 'setup_in_progress': return <ClockIcon className="h-5 w-5 text-yellow-400" />
      case 'inactive': return <XCircleIcon className="h-5 w-5 text-red-400" />
      default: return <ClockIcon className="h-5 w-5 text-gray-400" />
    }
  }

  const handleSetupWhatsApp = async (clientId) => {
    setLoading(true)
    try {
      // Simulate API call to set up WhatsApp
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setClients(prev => prev.map(client => 
        client.id === clientId 
          ? { 
              ...client, 
              status: 'active',
              whatsappNumber: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
            }
          : client
      ))
    } catch (error) {
      console.error('Setup failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (client) => {
    setSelectedClient(client)
    setShowDetails(true)
  }

  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'active').length,
    totalConversations: clients.reduce((sum, c) => sum + c.conversations, 0),
    pendingSetups: clients.filter(c => c.status === 'setup_in_progress').length
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage all client chatbots and integrations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Clients</p>
              <p className="text-2xl font-bold text-white">{stats.totalClients}</p>
            </div>
            <UsersIcon className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Clients</p>
              <p className="text-2xl font-bold text-green-400">{stats.activeClients}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Conversations</p>
              <p className="text-2xl font-bold text-white">{stats.totalConversations}</p>
            </div>
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Setups</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pendingSetups}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Client Management</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  WhatsApp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Conversations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{client.businessName}</div>
                      <div className="text-sm text-gray-400">{client.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(client.status)}
                      <span className={`text-sm font-medium ${getStatusColor(client.status)}`}>
                        {client.status.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {client.whatsappNumber ? (
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-white font-mono">{client.whatsappNumber}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not configured</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-white">{client.conversations}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-400">{client.lastActivity}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(client)}
                        className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                      >
                        <EyeIcon className="h-4 w-4" />
                        Details
                      </button>
                      
                      {client.status === 'setup_in_progress' && (
                        <button
                          onClick={() => handleSetupWhatsApp(client.id)}
                          disabled={loading}
                          className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1 disabled:opacity-50"
                        >
                          <Cog6ToothIcon className="h-4 w-4" />
                          {loading ? 'Setting up...' : 'Setup WhatsApp'}
                        </button>
                      )}
                      
                      {client.status === 'active' && (
                        <button className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center gap-1">
                          <PauseIcon className="h-4 w-4" />
                          Pause
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Details Modal */}
      {showDetails && selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-2xl border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Client Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Business Name</label>
                  <p className="text-white">{selectedClient.businessName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <p className="text-white">{selectedClient.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedClient.status)}
                    <span className={`text-white ${getStatusColor(selectedClient.status)}`}>
                      {selectedClient.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Setup Date</label>
                  <p className="text-white">{selectedClient.setupDate}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">WhatsApp Number</label>
                {selectedClient.whatsappNumber ? (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-green-400" />
                    <span className="text-white font-mono">{selectedClient.whatsappNumber}</span>
                  </div>
                ) : (
                  <p className="text-gray-400">Not configured</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Total Conversations</label>
                  <p className="text-white">{selectedClient.conversations}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Last Activity</label>
                  <p className="text-white">{selectedClient.lastActivity}</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => handleSetupWhatsApp(selectedClient.id)}
                  disabled={loading || selectedClient.status === 'active'}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Setting up...' : 'Setup WhatsApp'}
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 