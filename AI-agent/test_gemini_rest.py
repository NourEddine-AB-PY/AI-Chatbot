import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_gemini_rest_api():
    """Test Gemini API using direct REST calls"""
    
    api_key = os.getenv('GEMINI_API_KEY')
    
    if not api_key:
        print("❌ GEMINI_API_KEY not found")
        return
    
    # Gemini API endpoint
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    print("🔍 Testing Gemini REST API...\n")
    
    # Test 1: Simple generation
    print("1. Testing simple text generation...")
    
    data = {
        "contents": [{
            "parts": [{
                "text": "Hello! Can you introduce yourself briefly?"
            }]
        }]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        
        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                text = result['candidates'][0]['content']['parts'][0]['text']
                print("✅ Response received:")
                print(text)
            else:
                print("❌ No response content found")
                print("Response:", result)
        else:
            print(f"❌ Error: {response.status_code}")
            print("Response:", response.text)
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    print("\n2. Testing chat conversation...")
    
    # Test 2: Chat conversation
    chat_data = {
        "contents": [{
            "parts": [{
                "text": "Hi! I'm testing a chatbot integration. Can you help me with customer support?"
            }]
        }]
    }
    
    try:
        response = requests.post(url, headers=headers, json=chat_data)
        
        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                text = result['candidates'][0]['content']['parts'][0]['text']
                print("✅ Chat response:")
                print(text)
            else:
                print("❌ No chat response found")
        else:
            print(f"❌ Chat error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Chat error: {str(e)}")
    
    print("\n3. Testing business context...")
    
    # Test 3: Business context
    business_data = {
        "contents": [{
            "parts": [{
                "text": """You are a helpful customer service chatbot for a tech company. 
                A customer asks: "I have a problem with my order #12345. Can you help me?"
                Please provide a professional and helpful response."""
            }]
        }]
    }
    
    try:
        response = requests.post(url, headers=headers, json=business_data)
        
        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                text = result['candidates'][0]['content']['parts'][0]['text']
                print("✅ Business response:")
                print(text)
            else:
                print("❌ No business response found")
        else:
            print(f"❌ Business error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Business error: {str(e)}")

if __name__ == "__main__":
    print("🚀 Starting Gemini REST API Tests...\n")
    test_gemini_rest_api()
    print("\n✨ REST API test completed!") 