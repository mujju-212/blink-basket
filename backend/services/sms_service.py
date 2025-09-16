import requests
import random
import time
from twilio.rest import Client
from backend.config.config import Config

class SMSService:
    """Handle SMS operations using Twilio and Fast2SMS"""
    
    def __init__(self):
        self.config = Config()
        
    def generate_otp(self):
        """Generate a random 6-digit OTP"""
        return str(random.randint(100000, 999999))
    
    def send_twilio_sms(self, phone_number, message):
        """Send SMS using Twilio"""
        try:
            if not all([self.config.TWILIO_ACCOUNT_SID, self.config.TWILIO_AUTH_TOKEN, self.config.TWILIO_PHONE_NUMBER]):
                return False, "Twilio credentials not configured"
            
            # Initialize Twilio client
            client = Client(self.config.TWILIO_ACCOUNT_SID, self.config.TWILIO_AUTH_TOKEN)
            
            # Format phone number for international format
            formatted_phone = self._format_phone_number(phone_number)
            
            print(f"Sending SMS via Twilio to: {formatted_phone}")
            
            # Send SMS
            message_instance = client.messages.create(
                body=message,
                from_=self.config.TWILIO_PHONE_NUMBER,
                to=formatted_phone
            )
            
            print(f"Twilio SMS sent successfully. SID: {message_instance.sid}")
            return True, message_instance.sid
            
        except Exception as e:
            print(f"Twilio Error: {str(e)}")
            return False, str(e)
    
    def send_fast2sms(self, phone_number, message):
        """Send SMS using Fast2SMS (backup)"""
        try:
            if not self.config.FAST2SMS_API_KEY:
                return False, "Fast2SMS API key not configured"
                
            # Try different Fast2SMS routes
            routes_to_try = ['q', 'dlt', 'p']
            
            for route in routes_to_try:
                params = {
                    'authorization': self.config.FAST2SMS_API_KEY,
                    'route': route,
                    'message': message,
                    'language': 'english',
                    'flash': 0,
                    'numbers': phone_number
                }
                
                response = requests.get(self.config.FAST2SMS_URL, params=params)
                response_data = response.json()
                
                print(f"Fast2SMS Route '{route}' Response: {response_data}")
                
                if response_data.get('return'):
                    return True, f"SMS sent via Fast2SMS route '{route}'"
            
            return False, "All Fast2SMS routes failed"
            
        except Exception as e:
            return False, str(e)
    
    def send_sms(self, phone_number, message):
        """Send SMS using available services (Twilio first, then Fast2SMS)"""
        # Try Twilio first (most reliable)
        if all([self.config.TWILIO_ACCOUNT_SID, self.config.TWILIO_AUTH_TOKEN, self.config.TWILIO_PHONE_NUMBER]):
            print("Attempting to send SMS via Twilio...")
            success, result = self.send_twilio_sms(phone_number, message)
            if success:
                return {
                    'success': True,
                    'message': 'SMS sent successfully via Twilio',
                    'provider': 'twilio',
                    'sid': result
                }
            else:
                print(f"Twilio failed: {result}")
        
        # Try Fast2SMS as backup
        if self.config.FAST2SMS_API_KEY:
            print("Attempting to send SMS via Fast2SMS...")
            success, result = self.send_fast2sms(phone_number, message)
            if success:
                return {
                    'success': True,
                    'message': 'SMS sent successfully via Fast2SMS',
                    'provider': 'fast2sms'
                }
            else:
                print(f"Fast2SMS failed: {result}")
        
        # Return development mode if all services fail
        return {
            'success': False,
            'message': 'All SMS services failed',
            'provider': 'none'
        }
    
    def send_otp_sms(self, phone_number):
        """Generate and send OTP via SMS"""
        otp = self.generate_otp()
        message = f"Your Blinkit verification code is: {otp}. Valid for 5 minutes. Do not share this code with anyone."
        
        result = self.send_sms(phone_number, message)
        result['otp'] = otp  # Add OTP to result for development mode
        
        return result
    
    def _format_phone_number(self, phone_number):
        """Format phone number for international format (+91)"""
        if phone_number.startswith('91'):
            return f"+{phone_number}"
        elif phone_number.startswith('+91'):
            return phone_number
        elif phone_number.startswith('0'):
            # Remove leading 0 and add +91
            return f"+91{phone_number[1:]}"
        else:
            # Assume it's an Indian number without country code
            return f"+91{phone_number}"