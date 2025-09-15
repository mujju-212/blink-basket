const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Fast2SMS configuration
const FAST2SMS_API_KEY = process.env.REACT_APP_FAST2SMS_API_KEY;
const FAST2SMS_URL = 'https://www.fast2sms.com/dev/bulkV2';

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// API Routes

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with expiration (5 minutes)
    otpStore.set(phoneNumber, {
      otp,
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    // Prepare Fast2SMS request
    const message = `Your Blinkit OTP is: ${otp}. Valid for 5 minutes. Do not share with anyone.`;
    
    const params = {
      authorization: FAST2SMS_API_KEY,
      variables_values: otp,
      route: 'otp',
      numbers: phoneNumber,
      message: message
    };

    // Make request to Fast2SMS
    const response = await axios.get(FAST2SMS_URL, {
      params,
      headers: {
        'cache-control': 'no-cache'
      }
    });

    console.log('Fast2SMS Response:', response.data);

    if (response.data.return) {
      res.json({
        success: true,
        message: 'OTP sent successfully',
        requestId: response.data.request_id
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to send OTP',
        error: response.data
      });
    }

  } catch (error) {
    console.error('SMS Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.response?.data || error.message
    });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    const storedOTP = otpStore.get(phoneNumber);

    if (!storedOTP) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    if (Date.now() > storedOTP.expires) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // OTP is valid, remove it from store
    otpStore.delete(phoneNumber);

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});