import cohere
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Load your Cohere API key from environment variable
api_key = os.getenv('COHERE_API_KEY')
if not api_key:
    raise ValueError('COHERE_API_KEY not found in environment variables.')

co = cohere.Client(api_key)

try:
    response = co.chat(message="Hello, how are you?")
    print('Cohere response:', response.text)
except Exception as e:
    print('Error communicating with Cohere:', e) 