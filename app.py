from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import random
import time
import os
from dotenv import load_dotenv
from twilio.rest import Client

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Twilio configuration (Primary SMS service)
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')

# Fast2SMS configuration (Backup)
FAST2SMS_API_KEY = os.getenv('REACT_APP_FAST2SMS_API_KEY')
FAST2SMS_URL = 'https://www.fast2sms.com/dev/bulkV2'

# In-memory OTP storage (use Redis in production)
otp_store = {}

def generate_otp():
    """Generate a random 6-digit OTP"""
    return str(random.randint(100000, 999999))

def clean_expired_otps():
    """Remove expired OTPs from store"""
    current_time = time.time()
    expired_keys = [phone for phone, data in otp_store.items() 
                   if current_time > data['expires']]
    for key in expired_keys:
        del otp_store[key]

def send_twilio_sms(phone_number, message):
    """Send SMS using Twilio"""
    try:
        if not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER]):
            return False, "Twilio credentials not configured"
        
        # Initialize Twilio client
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        # Format phone number for international format
        if phone_number.startswith('91'):
            formatted_phone = f"+{phone_number}"
        elif phone_number.startswith('+91'):
            formatted_phone = phone_number
        elif phone_number.startswith('0'):
            # Remove leading 0 and add +91
            formatted_phone = f"+91{phone_number[1:]}"
        else:
            # Assume it's an Indian number without country code
            formatted_phone = f"+91{phone_number}"
        
        print(f"Sending SMS to: {formatted_phone}")
        
        # Send SMS
        message_instance = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=formatted_phone
        )
        
        print(f"Twilio SMS sent successfully. SID: {message_instance.sid}")
        return True, message_instance.sid
        
    except Exception as e:
        print(f"Twilio Error: {str(e)}")
        return False, str(e)

def send_fast2sms(phone_number, message):
    """Send SMS using Fast2SMS (backup)"""
    try:
        # Try different Fast2SMS routes
        routes_to_try = ['q', 'dlt', 'p']
        
        for route in routes_to_try:
            params = {
                'authorization': FAST2SMS_API_KEY,
                'route': route,
                'message': message,
                'language': 'english',
                'flash': 0,
                'numbers': phone_number
            }
            
            response = requests.get(FAST2SMS_URL, params=params)
            response_data = response.json()
            
            print(f"Fast2SMS Route '{route}' Response: {response_data}")
            
            if response_data.get('return'):
                return True, f"SMS sent via Fast2SMS route '{route}'"
        
        return False, "All Fast2SMS routes failed"
        
    except Exception as e:
        return False, str(e)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'Flask SMS server is running',
        'services': {
            'twilio': {
                'configured': bool(TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN),
                'phone_number': TWILIO_PHONE_NUMBER
            },
            'fast2sms': {
                'configured': bool(FAST2SMS_API_KEY)
            }
        },
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
    })

@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    """Send OTP to phone number using Twilio, Fast2SMS, or development mode"""
    try:
        data = request.get_json()
        phone_number = data.get('phoneNumber')
        
        if not phone_number:
            return jsonify({
                'success': False,
                'message': 'Phone number is required'
            }), 400
        
        # Clean expired OTPs
        clean_expired_otps()
        
        # Generate new OTP
        otp = generate_otp()
        
        # Store OTP with 5-minute expiration
        otp_store[phone_number] = {
            'otp': otp,
            'expires': time.time() + 300  # 5 minutes
        }
        
        message = f"Your Blinkit verification code is: {otp}. Valid for 5 minutes. Do not share this code with anyone."
        
        # Try Twilio first (most reliable)
        if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER:
            print("Attempting to send SMS via Twilio...")
            success, result = send_twilio_sms(phone_number, message)
            if success:
                return jsonify({
                    'success': True,
                    'message': 'OTP sent successfully via Twilio',
                    'provider': 'twilio',
                    'sid': result
                })
            else:
                print(f"Twilio failed: {result}")
        
        # Try Fast2SMS as backup
        if FAST2SMS_API_KEY:
            print("Attempting to send SMS via Fast2SMS...")
            success, result = send_fast2sms(phone_number, message)
            if success:
                return jsonify({
                    'success': True,
                    'message': 'OTP sent successfully via Fast2SMS',
                    'provider': 'fast2sms'
                })
            else:
                print(f"Fast2SMS failed: {result}")
        
        # Fallback to development mode
        print(f"🔔 DEVELOPMENT MODE: OTP for {phone_number} is: {otp}")
        print(f"⏰ OTP expires at: {time.strftime('%H:%M:%S', time.localtime(time.time() + 300))}")
        
        return jsonify({
            'success': True,
            'message': f'Development Mode: OTP is {otp}',
            'development_mode': True,
            'otp': otp,
            'provider': 'development'
        })
            
    except Exception as e:
        print(f"SMS Error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    """Verify OTP entered by user"""
    try:
        data = request.get_json()
        phone_number = data.get('phoneNumber')
        otp = data.get('otp')
        
        if not phone_number or not otp:
            return jsonify({
                'success': False,
                'message': 'Phone number and OTP are required'
            }), 400
        
        # Clean expired OTPs
        clean_expired_otps()
        
        if phone_number not in otp_store:
            return jsonify({
                'success': False,
                'message': 'OTP not found or expired'
            }), 400
        
        stored_data = otp_store[phone_number]
        
        if time.time() > stored_data['expires']:
            del otp_store[phone_number]
            return jsonify({
                'success': False,
                'message': 'OTP has expired'
            }), 400
        
        if stored_data['otp'] != otp:
            return jsonify({
                'success': False,
                'message': 'Invalid OTP'
            }), 400
        
        # OTP is valid, remove it from store
        del otp_store[phone_number]
        
        return jsonify({
            'success': True,
            'message': 'OTP verified successfully'
        })
        
    except Exception as e:
        print(f"Verify OTP Error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

if __name__ == '__main__':
    print("Starting Flask SMS server...")
    print(f"Twilio configured: {'Yes' if TWILIO_ACCOUNT_SID else 'No'}")
    print(f"Fast2SMS configured: {'Yes' if FAST2SMS_API_KEY else 'No'}")
    app.run(debug=True, host='0.0.0.0', port=5000)