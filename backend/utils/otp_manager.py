import time

class OTPManager:
    """Manage OTP storage and validation"""
    
    def __init__(self):
        # In-memory storage (use Redis in production)
        self.otp_store = {}
        self.otp_expiry_time = 300  # 5 minutes
    
    def store_otp(self, phone_number, otp):
        """Store OTP with expiration time"""
        self.otp_store[phone_number] = {
            'otp': otp,
            'expires': time.time() + self.otp_expiry_time
        }
        print(f"OTP stored for {phone_number}: {otp} (expires in {self.otp_expiry_time}s)")
    
    def verify_otp(self, phone_number, otp):
        """Verify OTP and return result"""
        # Clean expired OTPs first
        self.clean_expired_otps()
        
        if phone_number not in self.otp_store:
            return {
                'success': False,
                'message': 'OTP not found or expired'
            }
        
        stored_data = self.otp_store[phone_number]
        
        if time.time() > stored_data['expires']:
            del self.otp_store[phone_number]
            return {
                'success': False,
                'message': 'OTP has expired'
            }
        
        if stored_data['otp'] != otp:
            return {
                'success': False,
                'message': 'Invalid OTP'
            }
        
        # OTP is valid, remove it from store
        del self.otp_store[phone_number]
        
        return {
            'success': True,
            'message': 'OTP verified successfully'
        }
    
    def clean_expired_otps(self):
        """Remove expired OTPs from store"""
        current_time = time.time()
        expired_keys = [phone for phone, data in self.otp_store.items() 
                       if current_time > data['expires']]
        for key in expired_keys:
            del self.otp_store[key]
            print(f"Expired OTP removed for {key}")
    
    def get_otp_status(self, phone_number):
        """Get OTP status for a phone number"""
        self.clean_expired_otps()
        
        if phone_number in self.otp_store:
            expires_in = self.otp_store[phone_number]['expires'] - time.time()
            return {
                'exists': True,
                'expires_in': max(0, int(expires_in))
            }
        
        return {
            'exists': False,
            'expires_in': 0
        }