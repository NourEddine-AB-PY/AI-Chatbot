import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_gemini_api():
    """Test Gemini API with a simple conversation"""
    
    # Get API key from environment
    api_key = os.getenv('GEMINI_API_KEY')
    
    if not api_key:
        print("❌ GEMINI_API_KEY not found in environment variables")
        print("Please add your Gemini API key to .env file:")
        print("GEMINI_API_KEY=your_api_key_here")
        return
    
    try:
        # Configure the API
        genai.configure(api_key=api_key)
        
        print("🔍 Testing Gemini API...\n")
        
        # First, let's check available models
        print("1. Checking available models...")
        try:
            models = genai.list_models()
            print("✅ Available models:")
            for model in models:
                if 'generateContent' in model.supported_generation_methods:
                    print(f"   - {model.name}")
        except Exception as e:
            print(f"⚠️  Could not list models: {str(e)}")
        
        # Try different model names
        model_names = [
            'gemini-1.5-pro',
            'gemini-1.5-flash',
            'gemini-pro',
            'gemini-1.0-pro'
        ]
        
        model = None
        for model_name in model_names:
            try:
                print(f"\n2. Trying model: {model_name}")
                model = genai.GenerativeModel(model_name)
                # Test with a simple prompt
                response = model.generate_content("Hello!")
                print(f"✅ Model {model_name} works!")
                break
            except Exception as e:
                print(f"❌ Model {model_name} failed: {str(e)}")
                continue
        
        if not model:
            print("\n❌ No working model found")
            print("Available models might be:")
            print("- gemini-1.5-pro")
            print("- gemini-1.5-flash")
            print("- gemini-pro")
            return
        
        # Test 1: Simple text generation
        print("\n3. Testing simple text generation...")
        response = model.generate_content("Hello! Can you introduce yourself briefly?")
        print("✅ Response received:")
        print(response.text)
        print()
        
        # Test 2: Chat conversation
        print("4. Testing chat conversation...")
        chat = model.start_chat(history=[])
        
        # First message
        response1 = chat.send_message("Hi! I'm testing a chatbot integration. Can you help me with customer support?")
        print("✅ First response:")
        print(response1.text)
        print()
        
        # Follow-up message
        response2 = chat.send_message("A customer asks: 'What are your business hours?'")
        print("✅ Second response:")
        print(response2.text)
        print()
        
        # Test 3: Business context
        print("5. Testing business context...")
        business_prompt = """
        You are a helpful customer service chatbot for a tech company. 
        A customer asks: "I have a problem with my order #12345. Can you help me?"
        Please provide a professional and helpful response.
        """
        
        response3 = model.generate_content(business_prompt)
        print("✅ Business response:")
        print(response3.text)
        print()
        
        # Test 4: Character count
        print("6. Testing character count...")
        long_prompt = "Write a brief explanation of how to troubleshoot common computer problems."
        response4 = model.generate_content(long_prompt)
        
        print(f"✅ Long response generated:")
        print(f"Character count: {len(response4.text)}")
        print(f"First 200 characters: {response4.text[:200]}...")
        print()
        
        print("7. Testing Darija (Moroccan Arabic) capability...")
        darija_prompt = "Can you talk in Darija (Moroccan Arabic)? If yes, say something in Darija."
        response5 = model.generate_content(darija_prompt)
        print("✅ Darija test response:")
        print(response5.text)
        print()
        
        print("🎉 All Gemini API tests completed successfully!")
        print("✅ Text generation: WORKING")
        print("✅ Chat conversation: WORKING")
        print("✅ Business context: WORKING")
        print("✅ Long responses: WORKING")
        
    except Exception as e:
        print(f"❌ Error testing Gemini API: {str(e)}")
        print("\n💡 Troubleshooting:")
        print("1. Check if your API key is correct")
        print("2. Verify you have internet connection")
        print("3. Check if you have remaining quota")
        print("4. Try again in a few minutes")
        print("5. Check if your API key has access to Gemini models")

def test_gemini_vision():
    """Test Gemini Vision API (if you want to test image processing)"""
    
    api_key = os.getenv('GEMINI_API_KEY')
    
    if not api_key:
        print("❌ GEMINI_API_KEY not found")
        return
    
    try:
        genai.configure(api_key=api_key)
        
        # Try different vision models
        vision_models = [
            'gemini-1.5-pro',
            'gemini-1.5-flash',
            'gemini-pro-vision'
        ]
        
        for model_name in vision_models:
            try:
                model = genai.GenerativeModel(model_name)
                print(f"✅ Vision model {model_name} available")
                break
            except:
                continue
        
        print("🔍 Testing Gemini Vision API...")
        print("Note: This requires an image file to test properly")
        print("You can add image processing functionality later")
        
    except Exception as e:
        print(f"❌ Error testing Gemini Vision: {str(e)}")

if __name__ == "__main__":
    print("🚀 Starting Gemini API Tests...\n")
    
    # Test text generation
    test_gemini_api()
    
    print("\n" + "="*50 + "\n")
    
    # Test vision (optional)
    # test_gemini_vision()
    
    print("✨ Test completed!") 