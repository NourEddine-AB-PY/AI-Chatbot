#!/usr/bin/env python3
"""
Test script for the AI Customer Support Agent
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get('http://localhost:8000/health')
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {str(e)}")

def test_ai_response():
    """Test the AI response endpoint"""
    test_messages = [
        "Hello, I need help with my order",
        "What are your business hours?",
        "I have a complaint about your service",
        "How can I track my delivery?",
        "Thank you for your help"
    ]
    
    for message in test_messages:
        try:
            data = {
                "message": message,
                "phone_number": "test_user_123"
            }
            
            response = requests.post(
                'http://localhost:8000/test',
                json=data,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Test passed for: '{message}'")
                print(f"   AI Response: {result['ai_response'][:100]}...")
            else:
                print(f"❌ Test failed for: '{message}' - Status: {response.status_code}")
                print(f"   Error: {response.text}")
                
        except Exception as e:
            print(f"❌ Test error for '{message}': {str(e)}")
        
        print("-" * 50)

def test_cohere_api():
    """Test Cohere API directly"""
    try:
        import cohere
        
        co = cohere.Client(os.getenv('COHERE_API_KEY'))
        
        response = co.chat(
            message="Hello, this is a test message",
            temperature=0.7,
            max_tokens=50
        )
        
        print("✅ Cohere API test passed")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"❌ Cohere API test failed: {str(e)}")

def main():
    """Run all tests"""
    print("🤖 AI Agent Test Suite")
    print("=" * 50)
    
    # Check if server is running
    print("\n1. Testing server health...")
    test_health_check()
    
    # Test AI responses
    print("\n2. Testing AI responses...")
    test_ai_response()
    
    # Test Cohere API directly
    print("\n3. Testing Cohere API...")
    test_cohere_api()
    
    print("\n" + "=" * 50)
    print("🎉 Test suite completed!")

if __name__ == "__main__":
    main() 