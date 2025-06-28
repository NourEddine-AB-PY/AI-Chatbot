import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, FunnelChart, Funnel, LabelList, AreaChart, Area, ComposedChart, ScatterChart, Scatter
} from 'recharts'
import axios from 'axios'

// Fake Data
const weeklyData = [
  { day: 'Mon', conversations: 120, users: 85, satisfaction: 89, revenue: 1200 },
  { day: 'Tue', conversations: 145, users: 92, satisfaction: 90, revenue: 1450 },
  { day: 'Wed', conversations: 132, users: 88, satisfaction: 91, revenue: 1320 },
  { day: 'Thu', conversations: 168, users: 105, satisfaction: 92, revenue: 1680 },
  { day: 'Fri', conversations: 189, users: 118, satisfaction: 93, revenue: 1890 },
  { day: 'Sat', conversations: 156, users: 95, satisfaction: 93.5, revenue: 1560 },
  { day: 'Sun', conversations: 142, users: 89, satisfaction: 94, revenue: 1420 },
]

const monthlyData = [
  { month: 'Jan', conversations: 1200, users: 890, satisfaction: 91, revenue: 12000 },
  { month: 'Feb', conversations: 1350, users: 1020, satisfaction: 92, revenue: 13500 },
  { month: 'Mar', conversations: 1180, users: 950, satisfaction: 90, revenue: 11800 },
  { month: 'Apr', conversations: 1420, users: 1100, satisfaction: 93, revenue: 14200 },
  { month: 'May', conversations: 1580, users: 1250, satisfaction: 94, revenue: 15800 },
  { month: 'Jun', conversations: 1847, users: 1450, satisfaction: 95, revenue: 18470 },
]

const hourlyData = [
  { hour: '00:00', conversations: 45, users: 32 },
  { hour: '02:00', conversations: 23, users: 18 },
  { hour: '04:00', conversations: 18, users: 12 },
  { hour: '06:00', conversations: 34, users: 28 },
  { hour: '08:00', conversations: 89, users: 67 },
  { hour: '10:00', conversations: 156, users: 134 },
  { hour: '12:00', conversations: 198, users: 167 },
  { hour: '14:00', conversations: 234, users: 189 },
  { hour: '16:00', conversations: 267, users: 223 },
  { hour: '18:00', conversations: 189, users: 156 },
  { hour: '20:00', conversations: 145, users: 123 },
  { hour: '22:00', conversations: 78, users: 65 },
]

const channelData = [
  { name: 'WhatsApp', value: 1247, color: '#25D366' },
  { name: 'Facebook', value: 892, color: '#1877F2' },
  { name: 'Instagram', value: 456, color: '#E4405F' },
  { name: 'Website', value: 252, color: '#8B5CF6' },
  { name: 'Telegram', value: 189, color: '#0088CC' },
]

const botData = [
  { name: 'SupportBot', conversations: 1247, accuracy: 94.2, uptime: 99.8, satisfaction: 96.5 },
  { name: 'SalesBot', conversations: 892, accuracy: 91.7, uptime: 98.9, satisfaction: 93.2 },
  { name: 'FAQBot', conversations: 708, accuracy: 96.8, uptime: 99.5, satisfaction: 97.1 },
  { name: 'TechBot', conversations: 456, accuracy: 89.3, uptime: 97.2, satisfaction: 88.7 },
]

const categoryData = [
  { category: 'Support', conversations: 1247, satisfaction: 94.2, avgTime: 2.1 },
  { category: 'Sales', conversations: 892, satisfaction: 91.7, avgTime: 1.8 },
  { category: 'FAQ', conversations: 708, satisfaction: 96.8, avgTime: 0.9 },
  { category: 'Technical', conversations: 456, satisfaction: 89.3, avgTime: 3.2 },
  { category: 'General', conversations: 334, satisfaction: 92.1, avgTime: 1.5 },
]

const funnelData = [
  { value: 10000, name: 'Visitors' },
  { value: 7500, name: 'Engaged' },
  { value: 2847, name: 'Conversations' },
  { value: 2562, name: 'Resolved' },
  { value: 2413, name: 'Satisfied' },
]

const heatmapData = [
  { day: 'Mon', '00:00': 12, '06:00': 34, '12:00': 156, '18:00': 189, '24:00': 45 },
  { day: 'Tue', '00:00': 15, '06:00': 41, '12:00': 178, '18:00': 203, '24:00': 52 },
  { day: 'Wed', '00:00': 18, '06:00': 38, '12:00': 167, '18:00': 195, '24:00': 48 },
  { day: 'Thu', '00:00': 22, '06:00': 45, '12:00': 189, '18:00': 217, '24:00': 55 },
  { day: 'Fri', '00:00': 25, '06:00': 52, '12:00': 198, '18:00': 234, '24:00': 62 },
  { day: 'Sat', '00:00': 20, '06:00': 39, '12:00': 145, '18:00': 167, '24:00': 41 },
  { day: 'Sun', '00:00': 16, '06:00': 31, '12:00': 123, '18:00': 142, '24:00': 35 },
]

const radarData = [
  { metric: 'Accuracy', value: 94 },
  { metric: 'Speed', value: 87 },
  { metric: 'Satisfaction', value: 91 },
  { metric: 'Uptime', value: 99 },
  { metric: 'Coverage', value: 85 },
  { metric: 'Efficiency', value: 92 },
]

const scatterData = [
  { x: 2.1, y: 94, size: 120, label: 'SupportBot' },
  { x: 1.8, y: 92, size: 89, label: 'SalesBot' },
  { x: 0.9, y: 97, size: 71, label: 'FAQBot' },
  { x: 3.2, y: 89, size: 46, label: 'TechBot' },
  { x: 1.5, y: 93, size: 33, label: 'GeneralBot' },
]

const COLORS = ['#25D366', '#1877F2', '#E4405F', '#8B5CF6', '#0088CC']

const chartOptions = [
  { key: 'line', label: 'Line Chart' },
  { key: 'area', label: 'Area Chart' },
  { key: 'bar', label: 'Bar Chart' },
  { key: 'stackedBar', label: 'Stacked Bar Chart' },
  { key: 'composed', label: 'Composed Chart' },
  { key: 'pie', label: 'Pie Chart' },
  { key: 'doughnut', label: 'Doughnut Chart' },
  { key: 'radar', label: 'Radar Chart' },
  { key: 'funnel', label: 'Funnel Chart' },
  { key: 'scatter', label: 'Scatter Chart' },
  { key: 'table', label: 'Table View' },
]

const timeRanges = [
  { key: 'weekly', label: 'Weekly', data: weeklyData },
  { key: 'monthly', label: 'Monthly', data: monthlyData },
]

const metricOptions = [
  { key: 'conversations', label: 'Conversations' },
  { key: 'users', label: 'Users' },
  { key: 'satisfaction', label: 'Satisfaction' },
  { key: 'revenue', label: 'Revenue' },
];

export default function Stats() {
  const [selectedMetric, setSelectedMetric] = useState('conversations')
  const [visibleCharts, setVisibleCharts] = useState({
    line: true,
    area: true,
    bar: true,
    stackedBar: true,
    composed: true,
    pie: true,
    doughnut: true,
    radar: true,
    funnel: true,
    scatter: true,
    table: false,
  })
  const [selectedRange, setSelectedRange] = useState('weekly')
  const [toast, setToast] = useState('')
  // Dynamic metrics state
  const [dynamicStats, setDynamicStats] = useState({ totalConversations: null, totalUsers: null })
  // Remove static data arrays and use dynamic data from backend
  const [analytics, setAnalytics] = useState({
    weeklyData: [],
    monthlyData: [],
    channelData: [],
    satisfaction: null,
    revenue: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/conversations/analytics', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => setAnalytics(res.data))
      .catch(() => setAnalytics({
        weeklyData: [],
        monthlyData: [],
        channelData: [],
        satisfaction: null,
        revenue: null
      }));
  }, []);

  // Use dynamic data for charts and metrics
  const currentData = selectedRange === 'weekly' ? analytics.weeklyData : analytics.monthlyData;

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/conversations/stats', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => setDynamicStats(res.data))
      .catch(() => setDynamicStats({ totalConversations: 'N/A', totalUsers: 'N/A' }))
  }, [])

  const toggleChart = (key) => {
    setVisibleCharts((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const resetCharts = () => {
    setVisibleCharts(Object.fromEntries(chartOptions.map(opt => [opt.key, true])))
  }

  // Export CSV (for table view)
  const exportCSV = () => {
    const rows = [Object.keys(currentData[0]), ...currentData.map(row => Object.values(row))];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stats.csv';
    a.click();
    URL.revokeObjectURL(url);
    setToast('CSV exported!')
    setTimeout(() => setToast(''), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Conversational Insights Dashboard</h1>
          <p className="text-gray-400 text-lg">Powered by Recharts and test data</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {/* Metric Selector */}
          <select
            value={selectedMetric}
            onChange={e => setSelectedMetric(e.target.value)}
            className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          >
            {metricOptions.map(opt => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
          {/* Time Range Selector */}
          <select
            value={selectedRange}
            onChange={e => setSelectedRange(e.target.value)}
            className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          >
            {timeRanges.map(opt => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
          {/* Chart Toggles */}
          <div className="flex flex-wrap gap-2 items-center">
            {chartOptions.slice(0, 4).map(opt => (
              <button
                key={opt.key}
                onClick={() => toggleChart(opt.key)}
                className={`px-3 py-2 rounded text-sm font-medium transition ${visibleCharts[opt.key] ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                {visibleCharts[opt.key] ? 'Hide' : 'Show'} {opt.label}
              </button>
            ))}
            <button
              onClick={resetCharts}
              className="px-3 py-2 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              Show All
            </button>
          </div>
          {/* Export Button */}
          <button onClick={exportCSV} className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600">Export CSV</button>
        </div>
        {toast && (
          <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce">{toast}</div>
        )}

        {/* Section: Key Metrics */}
        <h2 className="text-2xl font-semibold text-white mb-4 text-center">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center shadow-lg hover:scale-105 transition-transform duration-200">
            <span className="text-4xl mb-2">💬</span>
            <span className="text-gray-400 text-sm mb-1">Total Conversations</span>
            <span className="text-3xl font-bold text-blue-400">{currentData.reduce((sum, d) => sum + (d.conversations || 0), 0)}</span>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center shadow-lg hover:scale-105 transition-transform duration-200">
            <span className="text-4xl mb-2">👥</span>
            <span className="text-gray-400 text-sm mb-1">Total Users</span>
            <span className="text-3xl font-bold text-cyan-400">{currentData.reduce((sum, d) => sum + (d.users || 0), 0)}</span>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center shadow-lg hover:scale-105 transition-transform duration-200">
            <span className="text-4xl mb-2">😊</span>
            <span className="text-gray-400 text-sm mb-1">Avg. Satisfaction</span>
            <span className="text-3xl font-bold text-green-400">{analytics.satisfaction !== null ? analytics.satisfaction : 'N/A'}%</span>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center shadow-lg hover:scale-105 transition-transform duration-200">
            <span className="text-4xl mb-2">💰</span>
            <span className="text-gray-400 text-sm mb-1">Total Revenue</span>
            <span className="text-3xl font-bold text-yellow-400">{analytics.revenue !== null ? `$${analytics.revenue}` : 'N/A'}</span>
          </div>
        </div>

        {/* Section: Visual Analytics */}
        <h2 className="text-2xl font-semibold text-white mb-4 text-center">Visual Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {/* Line Chart */}
          {visibleCharts.line && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:shadow-2xl transition-shadow duration-200">
            <div className="flex flex-col gap-1 mb-2">
              <h3 className="text-lg font-bold text-white">{selectedRange.charAt(0).toUpperCase() + selectedRange.slice(1)} {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} (Line)</h3>
              <span className="text-xs text-gray-400">Shows the trend of the selected metric over time.</span>
            </div>
            {currentData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-72 text-gray-400">
                <span className="text-6xl mb-4">📉</span>
                <span>No data yet! Start chatting to see your stats here.</span>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#2d2d3a" strokeDasharray="3 3" />
                <XAxis dataKey={selectedRange === 'weekly' ? 'day' : 'month'} stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip contentStyle={{ background: '#222', border: 'none', color: '#fff' }} />
                <Line type="monotone" dataKey={selectedMetric} stroke="#a78bfa" strokeWidth={3} dot={{ r: 6, fill: '#a78bfa' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
            )}
          </div>
          )}

          {/* Bar Chart */}
          {visibleCharts.bar && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:shadow-2xl transition-shadow duration-200">
            <div className="flex flex-col gap-1 mb-2">
              <h3 className="text-lg font-bold text-white">{selectedRange.charAt(0).toUpperCase() + selectedRange.slice(1)} Conversations (Bar)</h3>
              <span className="text-xs text-gray-400">Bar chart of conversations by time.</span>
            </div>
            {currentData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-72 text-gray-400">
                <span className="text-6xl mb-4">📊</span>
                <span>No data yet! Start chatting to see your stats here.</span>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={currentData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#2d2d3a" strokeDasharray="3 3" />
                <XAxis dataKey={selectedRange === 'weekly' ? 'day' : 'month'} stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip contentStyle={{ background: '#222', border: 'none', color: '#fff' }} />
                <Bar dataKey="conversations" fill="#a78bfa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>
          )}

          {/* Pie Chart */}
          {visibleCharts.pie && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:shadow-2xl transition-shadow duration-200">
            <div className="flex flex-col gap-1 mb-2">
              <h3 className="text-lg font-bold text-white">Channel Distribution (Pie)</h3>
              <span className="text-xs text-gray-400">Pie chart of channel distribution.</span>
            </div>
            {analytics.channelData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-72 text-gray-400">
                <span className="text-6xl mb-4">🥧</span>
                <span>No channel data yet!</span>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.channelData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#222', border: 'none', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            )}
          </div>
          )}

          {/* Radar Chart (Bot Performance) */}
          {visibleCharts.radar && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:shadow-2xl transition-shadow duration-200">
            <div className="flex flex-col gap-1 mb-2">
              <h3 className="text-lg font-bold text-white">Bot Performance (Radar)</h3>
              <span className="text-xs text-gray-400">Radar chart of bot performance metrics.</span>
            </div>
            {/* Dynamic radar data: if no data, show background */}
            {(!analytics.radarData || analytics.radarData.length === 0) ? (
              <div className="flex flex-col items-center justify-center h-72 text-gray-400">
                <span className="text-6xl mb-4">🤖</span>
                <span>No bot performance data yet!</span>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={analytics.radarData} cx="50%" cy="50%" outerRadius="80%">
                <PolarGrid stroke="#2d2d3a" />
                <PolarAngleAxis dataKey="metric" stroke="#aaa" />
                <PolarRadiusAxis stroke="#aaa" />
                <Radar name="Performance" dataKey="value" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.6} />
                <Tooltip contentStyle={{ background: '#222', border: 'none', color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
            )}
          </div>
          )}
        </div>

        {/* Last updated timestamp */}
        <div className="text-right text-xs text-gray-500 mt-8">Last updated: {new Date().toLocaleString()}</div>
      </div>
    </div>
  )
} 