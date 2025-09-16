from flask import Blueprint, request, jsonify
from backend.services.sms_service import SMSService
from backend.utils.otp_manager import OTPManager

# Create blueprint for authentication routes
auth_bp = Blueprint('auth', __name__)

# Initialize services
sms_service = SMSService()
otp_manager = OTPManager()

@auth_bp.route('/send-otp', methods=['POST'])
def send_otp():
    """Send OTP to phone number"""
    try:
        data = request.get_json()
        phone_number = data.get('phoneNumber')
        
        if not phone_number:
            return jsonify({
                'success': False,
                'message': 'Phone number is required'
            }), 400
        
        # Send OTP via SMS
        result = sms_service.send_otp_sms(phone_number)
        
        if result['success']:
            # Store OTP for verification
            otp_manager.store_otp(phone_number, result['otp'])
            
            # Don't send OTP in response for security (except in development)
            response_data = {
                'success': True,
                'message': result['message'],
                'provider': result['provider']
            }
            
            # Add additional data based on provider
            if result['provider'] == 'twilio':
                response_data['sid'] = result.get('sid')
            elif result['provider'] == 'none':
                # Development mode - show OTP in console and optionally in response
                print(f"🔔 DEVELOPMENT MODE: OTP for {phone_number} is: {result['otp']}")
                response_data['development_mode'] = True
                response_data['otp'] = result['otp']  # Only for development
                response_data['message'] = f"Development Mode: OTP is {result['otp']}"
            
            return jsonify(response_data)
        else:
            # SMS failed, fallback to development mode
            print(f"🔔 DEVELOPMENT MODE: OTP for {phone_number} is: {result['otp']}")
            otp_manager.store_otp(phone_number, result['otp'])
            
            return jsonify({
                'success': True,
                'message': f"Development Mode: OTP is {result['otp']}",
                'development_mode': True,
                'otp': result['otp'],
                'provider': 'development'
            })
            
    except Exception as e:
        print(f"Send OTP Error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@auth_bp.route('/verify-otp', methods=['POST'])
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
        
        # Verify OTP
        result = otp_manager.verify_otp(phone_number, otp)
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 400
            
    except Exception as e:
        print(f"Verify OTP Error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@auth_bp.route('/otp-status/<phone_number>', methods=['GET'])
def get_otp_status(phone_number):
    """Get OTP status for a phone number"""
    try:
        status = otp_manager.get_otp_status(phone_number)
        return jsonify({
            'success': True,
            'data': status
        })
    except Exception as e:
        print(f"OTP Status Error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500