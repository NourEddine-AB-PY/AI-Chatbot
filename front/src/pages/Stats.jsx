import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts'
import { useLanguage } from '../contexts/LanguageContext'
import { conversationsAPI } from '../utils/api'

export default function Stats() {
  const { t, isRTL } = useLanguage();
  const [convoData, setConvoData] = useState([]);
  const [botData, setBotData] = useState([]);
  const [selectedBot, setSelectedBot] = useState('All');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalConversations: 0, totalUsers: 0 });
  const [recentConvos, setRecentConvos] = useState([]);
  const [allConvoData, setAllConvoData] = useState([]);
  const [allRecentConvos, setAllRecentConvos] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [responseTimeStats, setResponseTimeStats] = useState({ avgResponseTime: 0, totalResponses: 0 });
  const [integrationStats, setIntegrationStats] = useState({ activeIntegrations: 0, integrationTypes: [] });
  const [engagementData, setEngagementData] = useState([]);
  const [topicData, setTopicData] = useState([]);


  useEffect(() => {
    setLoading(true);
    Promise.all([
      conversationsAPI.getOverTime(),
      conversationsAPI.getByBot(),
      conversationsAPI.getStats(),
      conversationsAPI.getList(),
      conversationsAPI.getAnalytics(),
      conversationsAPI.getResponseTime(),
      conversationsAPI.getActiveIntegrations()
    ])
      .then(([convoData, botData, statsData, listData, analyticsData, responseTimeData, integrationData]) => {
        setAllConvoData(convoData || []);
        setConvoData(convoData || []);
        setBotData(botData || []);
        setStats(statsData || { totalConversations: 0, totalUsers: 0 });
        setAllRecentConvos(listData || []);
        setRecentConvos(listData || []);
        setMonthlyData((analyticsData && analyticsData.monthlyData) || []);
        setResponseTimeStats(responseTimeData || { avgResponseTime: 0, totalResponses: 0 });
        setIntegrationStats(integrationData || { activeIntegrations: 0, integrationTypes: [] });
        setEngagementData((analyticsData && analyticsData.engagementData) || []);
        setTopicData((analyticsData && analyticsData.topicData) || []);

      })
      .catch(() => {
        setAllConvoData([]);
        setConvoData([]);
        setBotData([]);
        setStats({ totalConversations: 0, totalUsers: 0 });
        setAllRecentConvos([]);
        setRecentConvos([]);
        setMonthlyData([]);
        setResponseTimeStats({ avgResponseTime: 0, totalResponses: 0 });
        setIntegrationStats({ activeIntegrations: 0, integrationTypes: [] });
        setEngagementData([]);
        setTopicData([]);

      })
      .finally(() => setLoading(false));
  }, []);

  // Get bot options for filter
  const botOptions = ['All', ...botData.map(b => b.bot_name || b.name).filter(Boolean)];

  // Filter all data by selected bot
  useEffect(() => {
    if (selectedBot === 'All') {
      setConvoData(allConvoData);
      setRecentConvos(allRecentConvos);
      return;
    }
    // Find the business_id for the selected bot
    // Try to get business_id from botData
    let businessId = null;
    const bot = botData.find(b => (b.bot_name || b.name) === selectedBot);
    if (bot) {
      businessId = bot.business_id || bot.id;
    }
    if (!businessId) {
      setConvoData([]);
      setRecentConvos([]);
      return;
    }
    // Filter recent conversations by business_id
    setRecentConvos(allRecentConvos.filter(c => c.business_id === businessId));
    // (Optional) Filter convoData if you have bot info in that data
    setConvoData(allConvoData); // No per-bot info in convoData, so show all
  }, [selectedBot, allConvoData, allRecentConvos, botData]);

  // Prepare data for recent conversations bar chart
  const phoneCounts = {};
  recentConvos.forEach(conv => {
    phoneCounts[conv.phone_number] = (phoneCounts[conv.phone_number] || 0) + 1;
  });
  const recentBarData = Object.entries(phoneCounts).map(([phone, count]) => ({ phone, count }));

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className={isRTL ? 'text-right' : 'text-left'}>
      <h1 className="text-3xl font-bold text-white mb-8">{t('analytics')}</h1>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-2">{stats.totalConversations}</div>
          <div className="text-gray-300">{t('totalConversations')}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
          <div className="text-2xl font-bold text-green-400 mb-2">{stats.totalUsers}</div>
          <div className="text-gray-300">{t('uniqueUsers')}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-2">{responseTimeStats.avgResponseTime}s</div>
          <div className="text-gray-300">{t('avgResponseTime')}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
          <div className="text-2xl font-bold text-orange-400 mb-2">{integrationStats.activeIntegrations}</div>
          <div className="text-gray-300">{t('activeChannels')}</div>
        </div>
      </div>
      {/* Bot Filter */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-white font-semibold">{t('filterByBot')}</label>
        <select
          className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2"
          value={selectedBot}
          onChange={e => setSelectedBot(e.target.value)}
        >
          {botOptions.map(bot => (
            <option key={bot} value={bot}>{bot}</option>
          ))}
        </select>
      </div>
      {/* Conversations Over Time */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">{t('conversationsOverTime')}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={convoData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#374151', border: '1px solid #4B5563', borderRadius: '8px', color: '#F9FAFB' }} />
            <Line type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* New Client-Focused Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Customer Engagement Analysis */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">{t('customerEngagementAnalysis')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="customer" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#374151', border: '1px solid #4B5563', borderRadius: '8px', color: '#F9FAFB' }}
                formatter={(value, name, props) => [
                  `${value} messages`,
                  `Status: ${props.payload.status}`
                ]}
              />
              <Bar dataKey="messages" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Conversation Topics Distribution */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">{t('conversationTopicsDistribution')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topicData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {topicData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#374151', border: '1px solid #4B5563', borderRadius: '8px', color: '#F9FAFB' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 