class AuthService {
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
    // Simulate OTP verification
    return otp.length === 6;
  }
}

export default new AuthService();