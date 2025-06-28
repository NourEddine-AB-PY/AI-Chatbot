from flask import Flask, request, jsonify
from flask_cors import CORS
from twilio.twiml.messaging_response import MessagingResponse
import cohere
import os
import requests
from dotenv import load_dotenv
import logging
from datetime import datetime
import json

# Load environment variables
load_dotenv()

# Configure logging to file
log_filename = f"ai_agent_{datetime.now().strftime('%Y%m%d')}.log"
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_filename, encoding='utf-8'),
        logging.StreamHandler()  # Also print to console
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize Cohere client
co = cohere.Client(os.getenv('COHERE_API_KEY'))

# Twilio configuration
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')

# Backend API configuration
BACKEND_API_URL = os.getenv('BACKEND_API_URL', 'http://localhost:5000')
BACKEND_API_KEY = os.getenv('BACKEND_API_KEY')

class CustomerSupportAgent:
    def __init__(self):
        self.conversation_history = {}
        self.business_configs = {}
        
    def log_message(self, direction, phone_number, message, response=None, error=None, business_id=None):
        """Log all messages with timestamps"""
        timestamp = datetime.now().isoformat()
        log_entry = {
            "timestamp": timestamp,
            "direction": direction,  # "incoming" or "outgoing"
            "phone_number": phone_number,
            "message": message,
            "response": response,
            "error": error,
            "business_id": business_id
        }
        
        # Log to file
        logger.info(f"MESSAGE_LOG: {json.dumps(log_entry, ensure_ascii=False)}")
        
        # Also save to a dedicated message log file
        message_log_file = f"messages_{datetime.now().strftime('%Y%m%d')}.log"
        with open(message_log_file, 'a', encoding='utf-8') as f:
            f.write(f"{json.dumps(log_entry, ensure_ascii=False)}\n")
        
    def get_business_config(self, business_id):
        """Get business configuration from backend"""
        try:
            if business_id in self.business_configs:
                return self.business_configs[business_id]
            
            response = requests.get(
                f"{BACKEND_API_URL}/api/setup/status/{business_id}",
                headers={
                    "Authorization": f"Bearer {BACKEND_API_KEY}",
                    "Content-Type": "application/json"
                }
            )
            
            if response.status_code == 200:
                business_data = response.json()
                config = {
                    'name': business_data.get('name', 'Business'),
                    'tone': 'professional',
                    'language': 'English',
                    'specialties': '',
                    'business_hours': '24/7'
                }
                
                # Get bot config if available
                if business_data.get('bot_configs'):
                    bot_config = business_data['bot_configs'][0]
                    config.update({
                        'tone': bot_config.get('tone', 'professional'),
                        'language': bot_config.get('language', 'English'),
                        'specialties': bot_config.get('specialties', ''),
                        'business_hours': bot_config.get('businessHours', '24/7')
                    })
                
                self.business_configs[business_id] = config
                return config
            else:
                logger.warning(f"Failed to get business config: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error getting business config: {str(e)}")
            return None
        
    def generate_response(self, user_message, phone_number, business_id=None):
        """Generate AI response using Cohere with business-specific context"""
        try:
            logger.info(f"Generating AI response for {phone_number} (business: {business_id}): {user_message[:50]}...")
            
            # Get business configuration
            business_config = self.get_business_config(business_id) if business_id else None
            
            # Build conversation context
            if business_config:
                context = f"""You are a helpful customer support agent for {business_config['name']}. 
                Business Context: {business_config['specialties']}
                Communication Style: {business_config['tone']}
                Language: {business_config['language']}
                Business Hours: {business_config['business_hours']}
                
                Please provide helpful, professional, and friendly responses to customer inquiries.
                Keep responses concise but informative."""
            else:
                context = f"""You are a helpful customer support agent for a business. 
                Please provide helpful, professional, and friendly responses to customer inquiries.
                Keep responses concise but informative."""
            
            # Get conversation history for this user
            history = self.conversation_history.get(phone_number, [])
            
            # Prepare messages for Cohere
            messages = []
            if history:
                messages.extend(history)
            messages.append({"role": "user", "message": user_message})
            
            # Generate response using Cohere
            response = co.chat(
                message=user_message,
                conversation_id=f"{business_id}_{phone_number}" if business_id else phone_number,
                temperature=0.7,
                max_tokens=200
            )
            
            ai_response = response.text
            logger.info(f"AI response generated for {phone_number}: {ai_response[:50]}...")
            
            # Update conversation history
            if phone_number not in self.conversation_history:
                self.conversation_history[phone_number] = []
            
            self.conversation_history[phone_number].append({
                "role": "user", 
                "message": user_message
            })
            self.conversation_history[phone_number].append({
                "role": "assistant", 
                "message": ai_response
            })
            
            # Keep only last 20 messages to manage memory
            if len(self.conversation_history[phone_number]) > 20:
                self.conversation_history[phone_number] = self.conversation_history[phone_number][-20:]
            
            return ai_response
            
        except Exception as e:
            error_msg = f"Error generating response: {str(e)}"
            logger.error(error_msg)
            self.log_message("error", phone_number, user_message, error=error_msg, business_id=business_id)
            return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment."

    def save_conversation(self, phone_number, user_message, ai_response, business_id=None):
        """Save conversation to backend database"""
        try:
            if BACKEND_API_KEY:
                conversation_data = {
                    "phone_number": phone_number,
                    "user_message": user_message,
                    "ai_response": ai_response,
                    "business_id": business_id,
                    "timestamp": "now()"
                }
                
                response = requests.post(
                    f"{BACKEND_API_URL}/api/conversations",
                    json=conversation_data,
                    headers={
                        "Authorization": f"Bearer {BACKEND_API_KEY}",
                        "Content-Type": "application/json"
                    }
                )
                
                if response.status_code == 201:
                    logger.info(f"Conversation saved for {phone_number} (business: {business_id})")
                else:
                    logger.warning(f"Failed to save conversation: {response.status_code} - {response.text}")
                    
        except Exception as e:
            logger.error(f"Error saving conversation: {str(e)}")

# Initialize the agent
agent = CustomerSupportAgent()

@app.route('/webhook/<business_id>', methods=['POST'])
def business_webhook(business_id):
    """Client-specific webhook endpoint for incoming messages"""
    try:
        # Get message details from Twilio
        incoming_message = request.values.get('Body', '').strip()
        from_number = request.values.get('From', '')
        to_number = request.values.get('To', '')
        
        logger.info(f"=== BUSINESS WEBHOOK RECEIVED ===")
        logger.info(f"Business ID: {business_id}")
        logger.info(f"From: {from_number}")
        logger.info(f"To: {to_number}")
        logger.info(f"Message: {incoming_message}")
        
        # Log incoming message
        agent.log_message("incoming", from_number, incoming_message, business_id=business_id)
        
        # Generate AI response with business context
        ai_response = agent.generate_response(incoming_message, from_number, business_id)
        
        # Log outgoing message
        agent.log_message("outgoing", from_number, ai_response, response=ai_response, business_id=business_id)
        
        # Save conversation to backend
        agent.save_conversation(from_number, incoming_message, ai_response, business_id)
        
        # Create Twilio response
        resp = MessagingResponse()
        resp.message(ai_response)
        
        logger.info(f"=== BUSINESS WEBHOOK RESPONSE SENT ===")
        logger.info(f"Response: {ai_response}")
        
        return str(resp)
        
    except Exception as e:
        error_msg = f"Error in business webhook: {str(e)}"
        logger.error(error_msg)
        
        # Log the error
        from_number = request.values.get('From', 'unknown')
        incoming_message = request.values.get('Body', 'unknown')
        agent.log_message("error", from_number, incoming_message, error=error_msg, business_id=business_id)
        
        resp = MessagingResponse()
        resp.message("I apologize, but I'm having trouble processing your request right now. Please try again in a moment.")
        return str(resp)

@app.route('/webhook', methods=['POST'])
def webhook():
    """Legacy webhook endpoint for backward compatibility"""
    return business_webhook(None)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "ai-agent",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/test', methods=['POST'])
def test_ai():
    """Test AI response without Twilio"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        phone_number = data.get('phone_number', 'test_user')
        business_id = data.get('business_id')
        
        if not message:
            return jsonify({"error": "Message is required"}), 400
        
        # Generate AI response
        ai_response = agent.generate_response(message, phone_number, business_id)
        
        # Save conversation if business_id is provided
        if business_id:
            agent.save_conversation(phone_number, message, ai_response, business_id)
        
        return jsonify({
            "user_message": message,
            "ai_response": ai_response,
            "success": True,
            "business_id": business_id
        })
        
    except Exception as e:
        logger.error(f"Error in test endpoint: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/logs', methods=['GET'])
def get_logs():
    """Get recent logs"""
    try:
        with open(log_filename, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            return jsonify({
                "logs": lines[-50:],  # Last 50 lines
                "total_lines": len(lines)
            })
    except FileNotFoundError:
        return jsonify({"logs": [], "total_lines": 0})

@app.route('/messages', methods=['GET'])
def get_messages():
    """Get recent messages"""
    try:
        message_log_file = f"messages_{datetime.now().strftime('%Y%m%d')}.log"
        with open(message_log_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            messages = [json.loads(line.strip()) for line in lines[-20:]]  # Last 20 messages
            return jsonify({
                "messages": messages,
                "total_messages": len(lines)
            })
    except FileNotFoundError:
        return jsonify({"messages": [], "total_messages": 0})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 8000))) 