import React, { createContext, useContext, useState } from 'react'
import { ar } from '../locales/ar'
import { en } from '../locales/en'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ar')
  
  const translations = language === 'ar' ? ar : en
  
  const t = (key) => {
    return translations[key] || key
  }
  
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
    // Set document direction for RTL support
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLanguage
  }
  
  const value = {
    language,
    changeLanguage,
    t,
    isRTL: language === 'ar'
  }
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
} 