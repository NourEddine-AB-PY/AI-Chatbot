import { useState, useRef, useEffect } from 'react'
import { PaperAirplaneIcon, UserIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

export default function LiveChat() {
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [toast, setToast] = useState('')
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const messagesEndRef = useRef(null)

  // Fetch conversations on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    setLoadingConversations(true)
    axios.get('/api/conversations/list', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => {
        setConversations(res.data)
        setSelectedChat(res.data.length > 0 ? res.data[0] : null)
      })
      .catch(() => setConversations([]))
      .finally(() => setLoadingConversations(false))
  }, [])

  // Fetch messages when selectedChat changes
  useEffect(() => {
    if (!selectedChat) {
      setMessages([])
      return
    }
    const token = localStorage.getItem('token')
    setLoadingMessages(true)
    axios.get(`/api/conversations/${selectedChat.business_id}/${selectedChat.phone_number}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => setMessages(res.data))
      .catch(() => setMessages([]))
      .finally(() => setLoadingMessages(false))
  }, [selectedChat])

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, selectedChat, isBotTyping])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChat) return
    const token = localStorage.getItem('token')
    try {
      await axios.post('/api/conversations/', {
        phone_number: selectedChat.phone_number,
        user_message: newMessage,
        business_id: selectedChat.business_id
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      setNewMessage('')
      setToast('Message sent!')
      setTimeout(() => setToast(''), 1500)
      // Refresh messages
      setLoadingMessages(true)
      const res = await axios.get(`/api/conversations/${selectedChat.business_id}/${selectedChat.phone_number}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      setMessages(res.data)
    } catch {
      setToast('Failed to send message')
      setTimeout(() => setToast(''), 1500)
    } finally {
      setLoadingMessages(false)
    }
  }

  return (
    <div className="h-[calc(100vh-200px)] flex bg-gray-900 rounded-xl overflow-hidden border border-gray-700 animate-fadein">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce" aria-live="polite">{toast}</div>
      )}
      {/* Conversations List */}
      <div className="w-80 bg-gray-800 border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Conversations</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {loadingConversations ? (
            <div className="flex flex-col items-center justify-center h-72 text-gray-400">
              <span className="text-6xl mb-4">💬</span>
              <span>Loading conversations...</span>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-72 text-gray-400">
              <span className="text-6xl mb-4">💬</span>
              <span>No conversations yet! Start chatting to see them here.</span>
            </div>
          ) : conversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => setSelectedChat(conversation)}
              className={`p-4 cursor-pointer border-b border-gray-700 hover:bg-gray-700 transition ${
                selectedChat && selectedChat.id === conversation.id ? 'bg-purple-900/20 border-l-4 border-l-purple-500' : ''
              }`}
              aria-label={`Open conversation with ${conversation.phone_number}`}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') setSelectedChat(conversation) }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-gray-300" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{conversation.phone_number}</div>
                    <div className="text-sm text-gray-400">{conversation.lastMessage}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">{conversation.time && new Date(conversation.time).toLocaleString()}</div>
                  {conversation.unread > 0 && (
                    <div className="mt-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-gray-300" />
            </div>
            <div>
              <div className="font-semibold text-white">{selectedChat ? selectedChat.phone_number : 'No conversation selected'}</div>
              {selectedChat && <div className="text-sm text-green-400 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Online
              </div>}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
          {loadingMessages ? (
            <div className="flex flex-col items-center justify-center h-72 text-gray-400">
              <span className="text-6xl mb-4">💬</span>
              <span>Loading messages...</span>
            </div>
          ) : (!selectedChat || messages.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-72 text-gray-400">
              <span className="text-6xl mb-4">💬</span>
              <span>No messages yet! Start chatting to see them here.</span>
            </div>
          ) : messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.user_message ? 'justify-end' : 'justify-start'} animate-fadein`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.user_message
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                <div className="text-sm">{message.user_message || message.ai_response}</div>
                <div className={`text-xs mt-1 ${
                  message.user_message ? 'text-purple-200' : 'text-gray-400'
                }`}>
                  {message.timestamp && new Date(message.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          {isBotTyping && (
            <div className="flex justify-start animate-fadein">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-700 text-gray-200 flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-400 animate-bounce" />
                <span className="text-sm">Bot is typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <form onSubmit={handleSendMessage} className="flex gap-2" aria-label="Send message">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              aria-label="Type your message"
              disabled={!selectedChat}
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition disabled:opacity-50"
              disabled={!selectedChat || !newMessage.trim()}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 