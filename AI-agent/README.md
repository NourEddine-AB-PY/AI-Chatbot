# AI Customer Support Agent

A Python-based AI customer support agent that integrates Twilio for WhatsApp messaging and Cohere for intelligent responses.

## Features

- 🤖 **AI-Powered Responses**: Uses Cohere API for intelligent conversation handling
- 📱 **WhatsApp Integration**: Connects to WhatsApp Business via Twilio
- 💬 **Conversation History**: Maintains context across conversations
- 🔗 **Backend Integration**: Saves conversations to your existing backend
- 🧪 **Testing Endpoints**: Built-in testing and health check endpoints

## Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Environment Variables
Create a `.env` file in the AI-agent directory with:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_whatsapp_number_here

# Cohere AI Configuration
COHERE_API_KEY=your_cohere_api_key_here

# Backend API Configuration
BACKEND_API_URL=http://localhost:5000
BACKEND_API_KEY=your_backend_api_key_here

# Server Configuration
PORT=8000
```

### 3. Run the Agent
```bash
python app.py
```

The agent will start on `http://localhost:8000`

## API Endpoints

### 1. Webhook (Twilio)
- **URL**: `/webhook`
- **Method**: `POST`
- **Purpose**: Receives incoming WhatsApp messages from Twilio
- **Response**: TwiML response for Twilio

### 2. Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Purpose**: Check if the service is running
- **Response**: `{"status": "healthy", "service": "ai-agent"}`

### 3. Test AI Response
- **URL**: `/test`
- **Method**: `POST`
- **Purpose**: Test AI responses without Twilio
- **Body**:
  ```json
  {
    "message": "Hello, I need help with my order",
    "phone_number": "test_user"
  }
  ```
- **Response**:
  ```json
  {
    "user_message": "Hello, I need help with my order",
    "ai_response": "Hello! I'd be happy to help you with your order...",
    "success": true
  }
  ```

## Twilio Setup

### 1. Create Twilio Account
- Sign up at [twilio.com](https://twilio.com)
- Get your Account SID and Auth Token

### 2. WhatsApp Business API
- In Twilio Console, go to Messaging > Try it out > Send a WhatsApp message
- Get your WhatsApp number

### 3. Configure Webhook
- In Twilio Console, go to Messaging > Settings > WhatsApp Sandbox
- Set the webhook URL to: `https://your-domain.com/webhook`
- For local testing, use ngrok: `ngrok http 8000`

## Testing

### 1. Test AI Response
```bash
curl -X POST http://localhost:8000/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, I need help", "phone_number": "test_user"}'
```

### 2. Test Health Check
```bash
curl http://localhost:8000/health
```

## Integration with Your Backend

The agent automatically saves conversations to your backend when `BACKEND_API_KEY` is set. It sends POST requests to:

```
POST {BACKEND_API_URL}/api/conversations
```

With the following data:
```json
{
  "phone_number": "+1234567890",
  "user_message": "Customer message",
  "ai_response": "AI response",
  "business_id": "optional_business_id",
  "timestamp": "now()"
}
```

## Customization

### 1. Business Context
Modify the `business_context` parameter in the `generate_response` method to customize AI responses for specific businesses.

### 2. Response Style
Adjust the Cohere parameters in the `generate_response` method:
- `temperature`: Controls creativity (0.0-1.0)
- `max_tokens`: Maximum response length
- `preamble`: System instructions for the AI

### 3. Conversation History
The agent keeps the last 20 messages per phone number. Adjust this limit in the `generate_response` method.

## Deployment

### Using Gunicorn
```bash
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

### Using Docker
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]
```

## Troubleshooting

### Common Issues

1. **Twilio Webhook Not Receiving Messages**
   - Check if your webhook URL is publicly accessible
   - Use ngrok for local testing
   - Verify Twilio phone number configuration

2. **Cohere API Errors**
   - Check your API key in the `.env` file
   - Verify your Cohere account has sufficient credits

3. **Backend Integration Fails**
   - Check if your backend is running
   - Verify the `BACKEND_API_URL` and `BACKEND_API_KEY`
   - Check backend logs for errors

### Logs
The agent logs all activities. Check the console output for debugging information.

## Support

For issues or questions:
1. Check the logs in your terminal
2. Verify all environment variables are set correctly
3. Test individual components (Twilio, Cohere, Backend) separately 