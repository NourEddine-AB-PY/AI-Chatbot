const axios = require('axios');

class WhatsAppConfig {
  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
    this.verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
  }

  // Validate WhatsApp configuration
  validateConfig() {
    const errors = [];
    
    if (!this.accessToken) {
      errors.push('WHATSAPP_ACCESS_TOKEN is required');
    }
    
    if (!this.phoneNumberId) {
      errors.push('WHATSAPP_PHONE_NUMBER_ID is required');
    }
    
    if (!this.businessAccountId) {
      errors.push('WHATSAPP_BUSINESS_ACCOUNT_ID is required');
    }
    
    if (!this.verifyToken) {
      errors.push('WHATSAPP_VERIFY_TOKEN is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Test WhatsApp API connection
  async testConnection() {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v19.0/${this.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // Get phone number details
  async getPhoneNumberDetails() {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v19.0/${this.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );
      
      return {
        success: true,
        phoneNumber: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // Get business account details
  async getBusinessAccountDetails() {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v19.0/${this.businessAccountId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );
      
      return {
        success: true,
        businessAccount: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // Verify webhook configuration
  async verifyWebhook(webhookUrl) {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v19.0/${this.phoneNumberId}/webhooks`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );
      
      const webhooks = response.data.data;
      const matchingWebhook = webhooks.find(webhook => webhook.callback_url === webhookUrl);
      
      return {
        success: true,
        isConfigured: !!matchingWebhook,
        webhooks: webhooks
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // Generate webhook verification token
  generateVerifyToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Format phone number for WhatsApp API
  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present (assuming +1 for US)
    if (!cleaned.startsWith('1') && cleaned.length === 10) {
      cleaned = '1' + cleaned;
    }
    
    return cleaned;
  }

  // Validate phone number format
  validatePhoneNumber(phoneNumber) {
    const formatted = this.formatPhoneNumber(phoneNumber);
    return formatted.length >= 10 && formatted.length <= 15;
  }
}

module.exports = WhatsAppConfig; 