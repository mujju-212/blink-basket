# Blinkit Backend

A modular Flask-based backend for the Blinkit clone application.

## 📁 Project Structure

```
backend/
├── app.py                  # Main Flask application
├── config/
│   ├── __init__.py
│   └── config.py          # Configuration management
├── routes/
│   ├── __init__.py
│   └── auth_routes.py     # Authentication endpoints
├── services/
│   ├── __init__.py
│   └── sms_service.py     # SMS service (Twilio + Fast2SMS)
└── utils/
    ├── __init__.py
    └── otp_manager.py     # OTP storage and validation
```

## 🚀 Getting Started

### Prerequisites
- Python 3.7+
- Flask
- Twilio account (optional)
- Fast2SMS account (optional)

### Installation

1. Install dependencies:
```bash
pip install flask flask-cors requests twilio python-dotenv
```

2. Set up environment variables in `.env`:
```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# Fast2SMS Configuration
REACT_APP_FAST2SMS_API_KEY=your_fast2sms_key

# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your_secret_key
```

3. Start the server:
```bash
cd backend
python app.py
```

## 📡 API Endpoints

### Health Check
- **GET** `/api/health` - Server health status

### Authentication
- **POST** `/api/send-otp` - Send OTP to phone number
- **POST** `/api/verify-otp` - Verify OTP
- **GET** `/api/otp-status/<phone>` - Get OTP status

### API Information
- **GET** `/api` - API documentation

## 🔧 Services

### SMS Service
- **Primary**: Twilio (most reliable)
- **Backup**: Fast2SMS
- **Fallback**: Development mode (console output)

### OTP Manager
- In-memory storage (use Redis in production)
- 5-minute expiration
- Automatic cleanup of expired OTPs

## 🔮 Future Enhancements

This modular structure is ready for:
- **Database Integration** (SQLAlchemy)
- **Payment Gateway** (Razorpay/Stripe)
- **Email Service** (SendGrid/SMTP)
- **Product Management**
- **Order Processing**
- **User Management**
- **Authentication (JWT)**

## 🛡️ Security Features

- CORS enabled
- Input validation
- Error handling
- Rate limiting (frontend)
- OTP expiration

## 📱 SMS Flow

1. User requests OTP → `/api/send-otp`
2. System tries Twilio → Success/Fail
3. If failed, tries Fast2SMS → Success/Fail
4. If both fail, development mode
5. User enters OTP → `/api/verify-otp`
6. System validates and responds

## 🔍 Monitoring

- Health check endpoint shows service status
- Console logging for debugging
- Error handling with proper HTTP codes