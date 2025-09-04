import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState('Nagawara, Bengaluru');
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const storedLocation = localStorage.getItem('currentLocation');
    const storedAddresses = localStorage.getItem('addresses');
    
    if (storedLocation) {
      setCurrentLocation(storedLocation);
    }
    
    if (storedAddresses) {
      setAddresses(JSON.parse(storedAddresses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currentLocation', currentLocation);
  }, [currentLocation]);

  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(addresses));
  }, [addresses]);

  const updateLocation = (location) => {
    setCurrentLocation(location);
  };

  const addAddress = (address) => {
    const newAddress = {
      id: Date.now(),
      ...address
    };
    setAddresses(prev => [...prev, newAddress]);
    return newAddress;
  };

  const updateAddress = (id, updatedAddress) => {
    setAddresses(prev => 
      prev.map(addr => 
        addr.id === id ? { ...addr, ...updatedAddress } : addr
      )
    );
  };

  const deleteAddress = (id) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const value = {
    currentLocation,
    addresses,
    updateLocation,
    addAddress,
    updateAddress,
    deleteAddress
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};