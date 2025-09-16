from flask import Flask, jsonify
from flask_cors import CORS
import time
import sys
import os

# Add parent directory to Python path so we can import backend modules
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from backend.config.config import Config
from backend.routes.auth_routes import auth_bp

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)
    
    # Enable CORS for all routes
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api')
    
    return app

# Create Flask app instance
app = create_app()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    sms_services = Config.validate_sms_config()
    
    return jsonify({
        'success': True,
        'message': 'Blinkit Backend API is running',
        'services': {
            'sms': sms_services,
            'database': False,  # TODO: Add database check
            'payments': False,  # TODO: Add payment gateway check
        },
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
        'version': '1.0.0'
    })

@app.route('/api', methods=['GET'])
def api_info():
    """API information endpoint"""
    return jsonify({
        'message': 'Blinkit Backend API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health',
            'auth': {
                'send_otp': '/api/send-otp',
                'verify_otp': '/api/verify-otp',
                'otp_status': '/api/otp-status/<phone_number>'
            },
            'future_endpoints': {
                'products': '/api/products',
                'orders': '/api/orders',
                'payments': '/api/payments',
                'users': '/api/users'
            }
        }
    })

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'message': 'Endpoint not found',
        'error': 'Not Found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'message': 'Internal server error',
        'error': 'Internal Server Error'
    }), 500

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 Starting Blinkit Backend Server...")
    print("=" * 50)
    
    # Validate SMS configuration
    sms_config = Config.validate_sms_config()
    print(f"📱 Twilio configured: {'✅ Yes' if sms_config['twilio'] else '❌ No'}")
    print(f"📱 Fast2SMS configured: {'✅ Yes' if sms_config['fast2sms'] else '❌ No'}")
    
    if not any(sms_config.values()):
        print("⚠️  Warning: No SMS services configured!")
    
    print(f"🌐 Server will run on: http://{Config.API_HOST}:{Config.API_PORT}")
    print(f"🔍 Health check: http://{Config.API_HOST}:{Config.API_PORT}/api/health")
    print("=" * 50)
    
    # Run the Flask application
    app.run(
        debug=Config.DEBUG,
        host=Config.API_HOST,
        port=Config.API_PORT
    )