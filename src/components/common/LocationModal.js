import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, ListGroup, Alert, Badge } from 'react-bootstrap';

const LocationModal = ({ show, onHide, onLocationSelect, currentLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentLocations, setRecentLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const popularLocations = [
    'Koramangala, Bengaluru',
    'Indiranagar, Bengaluru',
    'Whitefield, Bengaluru',
    'HSR Layout, Bengaluru',
    'Electronic City, Bengaluru',
    'Marathahalli, Bengaluru',
    'BTM Layout, Bengaluru',
    'Jayanagar, Bengaluru',
    'Rajajinagar, Bengaluru',
    'Yelahanka, Bengaluru'
  ];

  useEffect(() => {
    const stored = localStorage.getItem('recentLocations');
    if (stored) {
      setRecentLocations(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const filtered = popularLocations.filter(location =>
        location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleLocationSelect = (location) => {
    onLocationSelect(location);
    
    // Add to recent locations
    const updated = [location, ...recentLocations.filter(l => l !== location)].slice(0, 5);
    setRecentLocations(updated);
    localStorage.setItem('recentLocations', JSON.stringify(updated));
    
    onHide();
    setSearchQuery('');
  };

  const detectCurrentLocation = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate reverse geocoding
          const locations = [
            'Koramangala, Bengaluru',
            'Indiranagar, Bengaluru',
            'Whitefield, Bengaluru'
          ];
          const randomLocation = locations[Math.floor(Math.random() * locations.length)];
          handleLocationSelect(randomLocation);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
          alert('Unable to detect location. Please search manually.');
        }
      );
    } else {
      setLoading(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-map-marker-alt me-2 text-primary"></i>
          Choose Location
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="info" className="small">
          <i className="fas fa-info-circle me-2"></i>
          We deliver to your location in 10-15 minutes
        </Alert>

        <Button
          variant="outline-primary"
          className="w-100 mb-3"
          onClick={detectCurrentLocation}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Detecting...
            </>
          ) : (
            <>
              <i className="fas fa-location-arrow me-2"></i>
              Use My Current Location
            </>
          )}
        </Button>

        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search for area, street name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </Form.Group>

        {suggestions.length > 0 && (
          <div className="mb-3">
            <h6 className="text-muted small mb-2">SEARCH RESULTS</h6>
            <ListGroup variant="flush">
              {suggestions.map((location, index) => (
                <ListGroup.Item
                  key={index}
                  action
                  onClick={() => handleLocationSelect(location)}
                  className="d-flex align-items-center"
                >
                  <i className="fas fa-map-marker-alt text-muted me-3"></i>
                  <div>
                    <div className="fw-semibold">{location.split(',')[0]}</div>
                    <div className="text-muted small">{location}</div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        {recentLocations.length > 0 && (
          <div className="mb-3">
            <h6 className="text-muted small mb-2">RECENT LOCATIONS</h6>
            <ListGroup variant="flush">
              {recentLocations.map((location, index) => (
                <ListGroup.Item
                  key={index}
                  action
                  onClick={() => handleLocationSelect(location)}
                  className="d-flex align-items-center"
                >
                  <i className="fas fa-clock text-muted me-3"></i>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{location.split(',')[0]}</div>
                    <div className="text-muted small">{location}</div>
                  </div>
                  {location === currentLocation && (
                    <Badge bg="success">Current</Badge>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        <div>
          <h6 className="text-muted small mb-2">POPULAR LOCATIONS</h6>
          <ListGroup variant="flush">
            {popularLocations.slice(0, 5).map((location, index) => (
              <ListGroup.Item
                key={index}
                action
                onClick={() => handleLocationSelect(location)}
                className="d-flex align-items-center"
              >
                <i className="fas fa-fire text-warning me-3"></i>
                <div>
                  <div className="fw-semibold">{location.split(',')[0]}</div>
                  <div className="text-muted small">{location}</div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LocationModal;