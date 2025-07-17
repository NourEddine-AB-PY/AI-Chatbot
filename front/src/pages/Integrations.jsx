import { useState, useEffect } from 'react'
import { CheckCircleIcon, BuildingOfficeIcon, ClockIcon, MapPinIcon, DocumentTextIcon, PlusIcon, XMarkIcon, StarIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { useLanguage } from '../contexts/LanguageContext'

// Animated typing component
const TypingAnimation = ({ text, speed = 50, onComplete }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  useEffect(() => {
    setDisplayText('')
    setCurrentIndex(0)
  }, [text])

  return (
    <div className="text-xs text-gray-300 font-mono whitespace-pre-line">
      {displayText}
      <span className="animate-pulse">|</span>
    </div>
  )
}

// Helper to fetch Meta App ID and Redirect URI from backend
async function getMetaConfig() {
  const res = await fetch('/api/meta-config');
  if (!res.ok) throw new Error('Failed to fetch Meta config');
  return res.json();
}

export default function Integrations() {
  const { t, isRTL } = useLanguage();
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [businessInfo, setBusinessInfo] = useState({
    business_description: '',
    catalog_text: '',
    business_availability: '',
    business_location: '',
    business_contact: ''
  })
  const [savingInfo, setSavingInfo] = useState(false)
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [catalogMode, setCatalogMode] = useState('text') // 'text' or 'structured'
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    rating: ''
  })
  const [showProductForm, setShowProductForm] = useState(false)
  const [typingStates, setTypingStates] = useState({
    description: false,
    catalog: false,
    availability: false,
    location: false,
    contact: false
  })

  // Load existing business information on component mount
  useEffect(() => {
    loadBusinessInfo()
  }, [])

  const loadBusinessInfo = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/businesses/my-business`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.business) {
          setBusinessInfo({
            business_description: data.business.business_description || '',
            catalog_text: data.business.catalog_text || '',
            business_availability: data.business.business_availability || '',
            business_location: data.business.business_location || '',
            business_contact: data.business.business_contact || ''
          })
          
          // Load structured products if they exist
          if (data.business.catalog_products) {
            try {
              const parsedProducts = JSON.parse(data.business.catalog_products)
              setProducts(parsedProducts)
              setCatalogMode('structured')
            } catch (e) {
              // If products can't be parsed, keep text mode
              setCatalogMode('text')
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load business info:', error)
    } finally {
      setLoadingInfo(false)
    }
  }

  const handleLinkWhatsApp = async () => {
    setLoading(true)
    try {
      const { appId, redirectUri } = await getMetaConfig();
      const signupUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=whatsapp_business_messaging,whatsapp_business_management,business_management&response_type=code`;
      window.open(signupUrl, '_blank', 'width=600,height=800');
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setToast('Failed to start WhatsApp linking.');
      setTimeout(() => setToast(''), 2000)
    }
  }

  const handleBusinessInfoChange = (field, value) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCatalogModeChange = (mode) => {
    setCatalogMode(mode)
    if (mode === 'text') {
      // Convert products to text format
      const productsText = products.map(p => 
        `${p.name} - ${p.description} - $${p.price}${p.rating ? ` (${p.rating}/5 stars)` : ''}`
      ).join('\n')
      setBusinessInfo(prev => ({ ...prev, catalog_text: productsText }))
    } else {
      // Clear text catalog when switching to structured mode
      setBusinessInfo(prev => ({ ...prev, catalog_text: '' }))
    }
  }

  const addProduct = () => {
    if (newProduct.name && newProduct.description && newProduct.price) {
      const product = {
        id: Date.now(),
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        rating: newProduct.rating || null
      }
      setProducts([...products, product])
      setNewProduct({ name: '', description: '', price: '', rating: '' })
      setShowProductForm(false)
    }
  }

  const removeProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId))
  }

  const handleSaveBusinessInfo = async () => {
    setSavingInfo(true)
    try {
      // Prepare catalog data based on mode
      let catalogTextData = businessInfo.catalog_text
      let catalogProductsData = null
      
      if (catalogMode === 'structured') {
        catalogTextData = products.map(p => 
          `${p.name} - ${p.description} - $${p.price}${p.rating ? ` (${p.rating}/5 stars)` : ''}`
        ).join('\n')
        catalogProductsData = JSON.stringify(products)
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/businesses/business-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          description: businessInfo.business_description,
          catalog_text: catalogTextData,
          catalog_products: catalogProductsData,
          business_availability: businessInfo.business_availability,
          business_location: businessInfo.business_location,
          business_contact: businessInfo.business_contact
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save business information')
      }

      setToast('Business information saved successfully!')
      setTimeout(() => setToast(''), 3000)
    } catch (error) {
      setToast('Failed to save business information: ' + error.message)
      setTimeout(() => setToast(''), 3000)
    } finally {
      setSavingInfo(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadein p-6">
      <h1 className="text-3xl font-bold text-white mb-4">{t('integrations')}</h1>
      <p className="text-gray-400 mb-8 text-center max-w-2xl">{t('integrationsPageDescription')}</p>
      
      {/* WhatsApp Integration Section */}
      <div className="w-full max-w-6xl space-y-8">
        <div className="bg-gray-800 rounded-xl shadow p-8 border border-gray-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl">📱</div>
            <div>
              <h3 className="font-semibold text-white text-xl">{t('whatsappBusinessApi')}</h3>
              <p className="text-sm text-gray-400">{t('whatsappIntegrationDescription')}</p>
            </div>
          </div>
          <button
            onClick={handleLinkWhatsApp}
            className={`px-6 py-3 rounded-lg bg-purple-600 text-white font-medium text-lg shadow hover:bg-purple-500 transition flex items-center gap-2 ${loading || connected ? 'opacity-60 pointer-events-none' : ''}`}
            disabled={loading || connected}
          >
            {connected ? <CheckCircleIcon className="h-6 w-6 text-green-400" /> : null}
            {connected ? t('whatsappLinked') : loading ? t('linking') : t('linkWhatsapp')}
          </button>
        </div>

        {/* Business Information Section */}
        <div className="bg-gray-800 rounded-xl shadow p-8 border border-gray-700">
          <div className="flex items-center gap-4 mb-8">
            <BuildingOfficeIcon className="h-8 w-8 text-purple-400" />
            <div>
              <h3 className="font-semibold text-white text-xl">{t('businessInformation')}</h3>
              <p className="text-sm text-gray-400">{t('businessInformationDescription')}</p>
            </div>
          </div>

          {loadingInfo ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
              <span className="ml-3 text-gray-400">{t('loadingBusinessInformation')}</span>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Description Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5 text-purple-400" />
                  <label className="text-white font-medium">{t('businessDescription')}</label>
                  <div className="relative group">
                    <InformationCircleIcon 
                      className="h-5 w-5 text-gray-400 cursor-help hover:text-purple-400 transition" 
                      onMouseEnter={() => setTypingStates(prev => ({ ...prev, description: true }))}
                      onMouseLeave={() => setTypingStates(prev => ({ ...prev, description: false }))}
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-80">
                      <div className="text-xs font-medium mb-1">{t('example')}</div>
                      {typingStates.description && (
                        <TypingAnimation 
                          text={t('businessDescriptionExample')}
                          speed={30}
                        />
                      )}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
                <textarea
                  value={businessInfo.business_description}
                  onChange={(e) => handleBusinessInfoChange('business_description', e.target.value)}
                  placeholder={t('businessDescriptionPlaceholder')}
                  className="w-full h-32 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Catalog Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="h-5 w-5 text-purple-400" />
                    <label className="text-white font-medium">{t('productsCatalog')}</label>
                    {catalogMode === 'text' && (
                      <div className="relative group">
                        <InformationCircleIcon 
                          className="h-5 w-5 text-gray-400 cursor-help hover:text-purple-400 transition"
                          onMouseEnter={() => setTypingStates(prev => ({ ...prev, catalog: true }))}
                          onMouseLeave={() => setTypingStates(prev => ({ ...prev, catalog: false }))}
                        />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-80">
                          <div className="text-xs font-medium mb-1">{t('example')}</div>
                          {typingStates.catalog && (
                            <TypingAnimation 
                              text={t('productsCatalogExample')}
                              speed={25}
                            />
                          )}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCatalogModeChange('text')}
                      className={`px-3 py-1 rounded text-sm font-medium transition ${catalogMode === 'text' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      {t('textInput')}
                    </button>
                    <button
                      onClick={() => handleCatalogModeChange('structured')}
                      className={`px-3 py-1 rounded text-sm font-medium transition ${catalogMode === 'structured' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      {t('structuredEntry')}
                    </button>
                  </div>
                </div>

                {catalogMode === 'text' ? (
                  <textarea
                    value={businessInfo.catalog_text}
                    onChange={(e) => handleBusinessInfoChange('catalog_text', e.target.value)}
                    placeholder={t('productsCatalogPlaceholder')}
                    className="w-full h-32 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                ) : (
                  <div className="space-y-4">
                    {/* Product List */}
                    {products.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-white font-medium">{t('currentProducts')}</h4>
                        {products.map((product) => (
                          <div key={product.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h5 className="text-white font-medium">{product.name}</h5>
                                  <span className="text-green-400 font-semibold">${product.price}</span>
                                  {product.rating && (
                                    <div className="flex items-center gap-1">
                                      <StarIcon className="h-4 w-4 text-yellow-400" />
                                      <span className="text-yellow-400 text-sm">{product.rating}/5</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-gray-300 text-sm">{product.description}</p>
                              </div>
                              <button
                                onClick={() => removeProduct(product.id)}
                                className="ml-4 p-1 text-gray-400 hover:text-red-400 transition"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Product Form */}
                    {showProductForm ? (
                      <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 space-y-4">
                        <h4 className="text-white font-medium">{t('addNewProduct')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-300 text-sm mb-1">{t('productName')} *</label>
                            <input
                              type="text"
                              value={newProduct.name}
                              onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder={t('enterProductName')}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-300 text-sm mb-1">{t('price')} *</label>
                            <input
                              type="text"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder={t('priceExample')}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm mb-1">{t('description')} *</label>
                          <textarea
                            value={newProduct.description}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full h-20 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            placeholder={t('describeProduct')}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm mb-1">{t('ratingOptional')}</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            step="0.1"
                            value={newProduct.rating}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, rating: e.target.value }))}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder={t('ratingPlaceholder')}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={addProduct}
                            className="px-4 py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-500 transition"
                          >
                            {t('addProduct')}
                          </button>
                          <button
                            onClick={() => {
                              setShowProductForm(false)
                              setNewProduct({ name: '', description: '', price: '', rating: '' })
                            }}
                            className="px-4 py-2 bg-gray-600 text-white rounded font-medium hover:bg-gray-500 transition"
                          >
                            {t('cancel')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowProductForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-500 transition"
                      >
                        <PlusIcon className="h-5 w-5" />
                        {t('addProduct')}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Availability Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-purple-400" />
                  <label className="text-white font-medium">{t('businessHoursAvailability')}</label>
                  <div className="relative group">
                    <InformationCircleIcon 
                      className="h-5 w-5 text-gray-400 cursor-help hover:text-purple-400 transition"
                      onMouseEnter={() => setTypingStates(prev => ({ ...prev, availability: true }))}
                      onMouseLeave={() => setTypingStates(prev => ({ ...prev, availability: false }))}
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-80">
                      <div className="text-xs font-medium mb-1">{t('example')}</div>
                      {typingStates.availability && (
                        <TypingAnimation 
                          text={t('businessHoursExample')}
                          speed={35}
                        />
                      )}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
                <textarea
                  value={businessInfo.business_availability}
                  onChange={(e) => handleBusinessInfoChange('business_availability', e.target.value)}
                  placeholder={t('businessHoursPlaceholder')}
                  className="w-full h-32 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Location Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-purple-400" />
                  <label className="text-white font-medium">{t('locationAddress')}</label>
                  <div className="relative group">
                    <InformationCircleIcon 
                      className="h-5 w-5 text-gray-400 cursor-help hover:text-purple-400 transition"
                      onMouseEnter={() => setTypingStates(prev => ({ ...prev, location: true }))}
                      onMouseLeave={() => setTypingStates(prev => ({ ...prev, location: false }))}
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-80">
                      <div className="text-xs font-medium mb-1">{t('example')}</div>
                      {typingStates.location && (
                        <TypingAnimation 
                          text={t('locationExample')}
                          speed={30}
                        />
                      )}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
                <textarea
                  value={businessInfo.business_location}
                  onChange={(e) => handleBusinessInfoChange('business_location', e.target.value)}
                  placeholder={t('locationPlaceholder')}
                  className="w-full h-32 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Contact Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5 text-purple-400" />
                  <label className="text-white font-medium">{t('contactInformation')}</label>
                  <div className="relative group">
                    <InformationCircleIcon 
                      className="h-5 w-5 text-gray-400 cursor-help hover:text-purple-400 transition"
                      onMouseEnter={() => setTypingStates(prev => ({ ...prev, contact: true }))}
                      onMouseLeave={() => setTypingStates(prev => ({ ...prev, contact: false }))}
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-80">
                      <div className="text-xs font-medium mb-1">{t('example')}</div>
                      {typingStates.contact && (
                        <TypingAnimation 
                          text={t('contactExample')}
                          speed={25}
                        />
                      )}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
                <textarea
                  value={businessInfo.business_contact}
                  onChange={(e) => handleBusinessInfoChange('business_contact', e.target.value)}
                  placeholder={t('contactPlaceholder')}
                  className="w-full h-32 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveBusinessInfo}
              disabled={savingInfo}
              className={`px-8 py-3 rounded-lg bg-purple-600 text-white font-medium shadow hover:bg-purple-500 transition flex items-center gap-2 ${savingInfo ? 'opacity-60 pointer-events-none' : ''}`}
            >
              {savingInfo ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {t('saving')}
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  {t('saveBusinessInformation')}
                </>
              )}
            </button>
          </div>

          {/* Information Note */}
          <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
            <p className="text-sm text-gray-300">
              <strong className="text-purple-400">💡 {t('tip')}</strong> {t('integrationsTip')}
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce max-w-sm" aria-live="polite">
          {t(toast)}
        </div>
      )}
    </div>
  )
} 