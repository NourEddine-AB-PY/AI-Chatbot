import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function ModernSetup({ onComplete }) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const questions = [
    {
      id: 1,
      type: 'text',
      title: t('whats_your_business_called'),
      subtitle: t('this_will_be_displayed_to_your_customers'),
      placeholder: t('enter_your_business_name'),
      field: 'business_name',
      required: true
    },
    {
      id: 2,
      type: 'text',
      title: t('what_industry_are_you_in'),
      subtitle: t('this_helps_us_customize_your_chatbot'),
      placeholder: t('e_g_retail_healthcare_technology'),
      field: 'industry',
      required: true
    },
    {
      id: 3,
      type: 'textarea',
      title: t('describe_your_business'),
      subtitle: t('tell_us_about_what_you_do_and_what_makes_you_unique'),
      placeholder: t('describe_your_business_services_and_what_makes_you_special'),
      field: 'business_description',
      required: true
    },
    {
      id: 4,
      type: 'text',
      title: t('when_are_you_available'),
      subtitle: t('when_should_your_chatbot_be_active'),
      placeholder: t('e_g_24_7_business_hours_custom_schedule'),
      field: 'business_availability',
      required: true
    }
  ];

  useEffect(() => {
    setProgress(((currentStep + 1) / questions.length) * 100);
  }, [currentStep]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    const currentQuestion = questions[currentStep];
    // Validate required fields
    if (currentQuestion.required && !formData[currentQuestion.field]) {
      setError(t('this_field_is_required'));
      return;
    }
    setError('');
    if (currentStep === questions.length - 1) {
      setLoading(true);
      try {
        // Register setup info via backend API
        const payload = {
          business_name: formData.business_name,
          industry: formData.industry,
          business_description: formData.business_description,
          business_availability: formData.business_availability
        };
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/setup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || t('failed_to_register_setup_info'));
        setSetupComplete(true);
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 2000);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const canProceed = () => {
    const currentQuestion = questions[currentStep];
    if (!currentQuestion.required) return true;
    return formData[currentQuestion.field] && formData[currentQuestion.field].trim() !== '';
  };

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
          <h1 className="text-3xl font-bold text-white mb-4">{t('youre_all_set')}</h1>
          <p className="text-gray-400 mb-8">
            {t('your_chatbot_is_being_configured_and_will_be_ready_in_just_a_moment')}
          </p>
          <button 
            onClick={() => onComplete && onComplete()}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            {t('go_to_dashboard')}
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>{t('step')} {currentStep + 1} {t('of')} {questions.length}</span>
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
                  onChange={e => handleInputChange(currentQuestion.field, e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              )}
              {currentQuestion.type === 'textarea' && (
                <textarea
                  value={formData[currentQuestion.field] || ''}
                  onChange={e => handleInputChange(currentQuestion.field, e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              )}
            </div>

            {/* Error Message */}
            {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 px-4 bg-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-600 transition border border-gray-600"
                >
                  {t('back')}
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('setting_up')}
                  </>
                ) : (
                  <>
                    {currentStep === questions.length - 1 ? t('complete_setup') : t('continue')}
                    <ArrowRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 