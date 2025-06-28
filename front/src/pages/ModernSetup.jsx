import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const questions = [
  {
    id: 1,
    type: 'text',
    title: "What's your business called?",
    subtitle: "This will be displayed to your customers",
    placeholder: "Enter your business name",
    field: 'businessName',
    required: true
  },
  {
    id: 2,
    type: 'select',
    title: "What industry are you in?",
    subtitle: "This helps us customize your chatbot",
    field: 'industry',
    options: [
      { value: 'ecommerce', label: 'E-commerce & Retail' },
      { value: 'healthcare', label: 'Healthcare & Medical' },
      { value: 'finance', label: 'Finance & Banking' },
      { value: 'education', label: 'Education & Training' },
      { value: 'restaurant', label: 'Restaurant & Food' },
      { value: 'real-estate', label: 'Real Estate' },
      { value: 'automotive', label: 'Automotive' },
      { value: 'technology', label: 'Technology & Software' },
      { value: 'other', label: 'Other' }
    ],
    required: true
  },
  {
    id: 3,
    type: 'text',
    title: "What's your website?",
    subtitle: "Optional - helps us understand your business better",
    placeholder: "https://yourwebsite.com",
    field: 'website',
    required: false
  },
  {
    id: 4,
    type: 'select',
    title: "How should your chatbot sound?",
    subtitle: "Choose the tone that matches your brand",
    field: 'tone',
    options: [
      { value: 'professional', label: 'Professional & Formal' },
      { value: 'friendly', label: 'Friendly & Approachable' },
      { value: 'casual', label: 'Casual & Relaxed' },
      { value: 'enthusiastic', label: 'Enthusiastic & Energetic' }
    ],
    required: true
  },
  {
    id: 5,
    type: 'textarea',
    title: "What do customers ask you most?",
    subtitle: "Tell us about your products, services, or common questions",
    placeholder: "e.g., We sell handmade jewelry, customers often ask about shipping, returns, and custom orders...",
    field: 'specialties',
    required: false
  },
  {
    id: 6,
    type: 'select',
    title: "When are you available?",
    subtitle: "When should your chatbot be active?",
    field: 'businessHours',
    options: [
      { value: '24/7', label: '24/7 - Always available' },
      { value: 'business-hours', label: 'Business hours only' },
      { value: 'custom', label: 'Custom schedule' }
    ],
    required: true
  }
]

export default function ModernSetup({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(((currentStep + 1) / questions.length) * 100)
  }, [currentStep])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = async () => {
    const currentQuestion = questions[currentStep]
    // Validate required fields
    if (currentQuestion.required && !formData[currentQuestion.field]) {
      return
    }
    if (currentStep === questions.length - 1) {
      setLoading(true)
      try {
        // Get JWT token from localStorage
        const token = localStorage.getItem('token')
        if (!token) throw new Error('User not authenticated')
        // Register setup info via backend API
        const response = await fetch('http://localhost:5000/api/setup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            businessName: formData.businessName,
            industry: formData.industry,
            website: formData.website,
            tone: formData.tone,
            specialties: formData.specialties,
            businessHours: formData.businessHours,
          }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Failed to register setup info')
        setSetupComplete(true)
        if (onComplete) {
          setTimeout(() => {
            onComplete()
          }, 3000)
        }
      } catch (error) {
        alert('Setup failed: ' + error.message)
        console.error('Setup failed:', error)
      } finally {
        setLoading(false)
      }
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  const canProceed = () => {
    const currentQuestion = questions[currentStep]
    if (!currentQuestion.required) return true
    return formData[currentQuestion.field] && formData[currentQuestion.field].trim() !== ''
  }

  if (setupComplete) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">You're all set!</h1>
          <p className="text-gray-400 mb-8">
            Your chatbot is being configured and will be ready in just a moment.
          </p>
          <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
            <div className="text-sm text-gray-300 mb-2">Your WhatsApp Number:</div>
            <div className="text-xl font-mono text-green-400">+1 (555) 123-4567</div>
          </div>
          <button 
            onClick={() => onComplete && onComplete()}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    )
  }

  const currentQuestion = questions[currentStep]

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Step {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div 
              className="bg-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl"
          >
            {/* Question Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <SparklesIcon className="h-8 w-8 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {currentQuestion.title}
              </h1>
              <p className="text-gray-400">
                {currentQuestion.subtitle}
              </p>
            </div>

            {/* Input Field */}
            <div className="mb-8">
              {currentQuestion.type === 'text' && (
                <input
                  type="text"
                  value={formData[currentQuestion.field] || ''}
                  onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              )}

              {currentQuestion.type === 'select' && (
                <select
                  value={formData[currentQuestion.field] || ''}
                  onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select an option</option>
                  {currentQuestion.options.map(option => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {currentQuestion.type === 'textarea' && (
                <textarea
                  value={formData[currentQuestion.field] || ''}
                  onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 px-4 bg-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-600 transition border border-gray-600"
                >
                  Back
                </button>
              )}
              
              <button
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    {currentStep === questions.length - 1 ? 'Complete Setup' : 'Continue'}
                    <ArrowRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Skip Option */}
        {!currentQuestion.required && (
          <div className="text-center mt-6">
            <button
              onClick={handleNext}
              className="text-gray-400 hover:text-white text-sm"
            >
              Skip this question
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 