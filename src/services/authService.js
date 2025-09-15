import smsService from './smsService';

class AuthService {
  async sendOTP(phone) {
    try {
      const result = await smsService.sendOTP(phone);
      return result;
    } catch (error) {
      console.error('Auth Service - Send OTP Error:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      };
    }
  }

  async verifyOTPAndLogin(phone, otp) {
    try {
      const verificationResult = await smsService.verifyOTP(phone, otp);
      
      if (verificationResult.success) {
        // Create user object and store in localStorage
        const user = {
          name: 'User', // You can enhance this later to get actual user data
          phone: phone,
          email: `${phone}@example.com`, // Temporary email
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        return {
          success: true,
          user: user,
          message: 'Login successful'
        };
      } else {
        return verificationResult;
      }
    } catch (error) {
      console.error('Auth Service - Verify OTP Error:', error);
      return {
        success: false,
        message: 'Failed to verify OTP. Please try again.'
      };
    }
  }

  login(phone) {
    const user = {
      name: 'John Doe',
      phone: phone,
      email: 'john@example.com'
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }

  adminLogin(username, password) {
    if (username === 'admin' && password === 'admin123') {
      const adminUser = {
        name: 'Admin',
        role: 'admin'
      };
      
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      localStorage.setItem('isAdmin', 'true');
      return adminUser;
    }
    return null;
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
  }

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  isAdmin() {
    return localStorage.getItem('isAdmin') === 'true';
  }

  verifyOTP(otp) {
    // Legacy method - kept for backward compatibility
    return otp.length === 6;
  }

  getOTPRemainingTime(phone) {
    return smsService.getOTPRemainingTime(phone);
  }
}

export default new AuthService();