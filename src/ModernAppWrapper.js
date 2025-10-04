import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Import new context providers
import { ToastProvider } from './components/common/ToastSystem';
import { SessionProvider } from './context/SessionContext';
import { WebSocketProvider } from './context/WebSocketContext';

// Import existing providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import { WishlistProvider } from './context/WishlistContext';

// Import styles
import './components/common/LoadingComponents.css';
import './components/common/ToastSystem.css';

function App() {
  return (
    <Router>
      <ToastProvider>
        <SessionProvider>
          <WebSocketProvider>
            <LocationProvider>
              <AuthProvider>
                <CartProvider>
                  <WishlistProvider>
                    {/* Your existing app content */}
                    <div className="App">
                      {/* Routes and components go here */}
                    </div>
                  </WishlistProvider>
                </CartProvider>
              </AuthProvider>
            </LocationProvider>
          </WebSocketProvider>
        </SessionProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;