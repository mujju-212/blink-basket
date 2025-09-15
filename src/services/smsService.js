// SMS Service for Flask backend integration
class SMSService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.otpTimers = new Map(); // Track OTP send times for rate limiting
  }

  // Send OTP via Flask backend
  async sendOTP(phoneNumber) {
    try {
      // Clean phone number
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      
      if (cleanPhone.length !== 10) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Check rate limiting (prevent spam - 1 OTP per minute)
      const lastSent = this.otpTimers.get(cleanPhone);
      if (lastSent && (Date.now() - lastSent < 60000)) {
        const remainingTime = Math.ceil((60000 - (Date.now() - lastSent)) / 1000);
        throw new Error(`Please wait ${remainingTime} seconds before requesting another OTP`);
      }

      // Check if Flask backend is running
      const isBackendHealthy = await this.checkBackendHealth();
      if (!isBackendHealthy) {
        throw new Error('SMS service is temporarily unavailable. Please try again later.');
      }

      const response = await fetch(`${this.baseURL}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: cleanPhone
        })
      });

      const data = await response.json();

      if (data.success) {
        // Track the time OTP was sent
        this.otpTimers.set(cleanPhone, Date.now());
        
        // Handle development mode
        if (data.development_mode && data.otp) {
          console.log(`🔔 DEVELOPMENT MODE: OTP for ${cleanPhone} is: ${data.otp}`);
          alert(`Development Mode: Your OTP is ${data.otp}`);
        }
        
        return {
          success: true,
          message: data.message,
          requestId: data.request_id,
          developmentMode: data.development_mode,
          otp: data.otp
        };
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('SMS Error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send OTP'
      };
    }
  }

  // Verify OTP via Flask backend
  async verifyOTP(phoneNumber, enteredOTP) {
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      
      if (!enteredOTP || enteredOTP.length !== 6) {
        return {
          success: false,
          message: 'Please enter a valid 6-digit OTP'
        };
      }

      const response = await fetch(`${this.baseURL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: cleanPhone,
          otp: enteredOTP
        })
      });

      const data = await response.json();

      if (data.success) {
        // Clear rate limiting on successful verification
        this.otpTimers.delete(cleanPhone);
        
        return {
          success: true,
          message: data.message
        };
      } else {
        return {
          success: false,
          message: data.message
        };
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      return {
        success: false,
        message: 'Error verifying OTP. Please try again.'
      };
    }
  }

  // Resend OTP
  async resendOTP(phoneNumber) {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Clear the rate limiting for resend
    this.otpTimers.delete(cleanPhone);
    
    return await this.sendOTP(phoneNumber);
  }

  // Health check for Flask backend
  async checkBackendHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        timeout: 5000 // 5 second timeout
      });
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }

  // Get remaining time for rate limiting (in seconds)
  getOTPRemainingTime(phoneNumber) {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const lastSent = this.otpTimers.get(cleanPhone);
    
    if (!lastSent) return 0;
    
    const elapsed = Date.now() - lastSent;
    const remaining = 60000 - elapsed; // 1 minute rate limit
    
    return Math.max(0, Math.ceil(remaining / 1000));
  }

  // Clean up old timers (call this periodically)
  cleanupOldTimers() {
    const now = Date.now();
    const expireTime = 60000; // 1 minute

    for (const [phone, timestamp] of this.otpTimers.entries()) {
      if (now - timestamp > expireTime) {
        this.otpTimers.delete(phone);
      }
    }
  }
}

export default new SMSService();