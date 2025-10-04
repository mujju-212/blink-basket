import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Form, InputGroup, Dropdown, Badge, Button, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../common/ToastSystem';
import './AdvancedSearch.css';

const AdvancedSearch = ({ onSearchResults, placeholder = "Search for products..." }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    priceRange: '',
    brand: '',
    sortBy: 'relevance',
    inStock: false,
    offers: false
  });
  const [voiceSearchSupported, setVoiceSearchSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const searchInputRef = useRef(null);
  const suggestionTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize voice search
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSearchSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        handleSearch(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.showError('Voice search failed. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Debounced search suggestions
  const debouncedGetSuggestions = useCallback(
    (query) => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }

      suggestionTimeoutRef.current = setTimeout(async () => {
        if (query.length >= 2) {
          setIsLoading(true);
          try {
            const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
            if (response.ok) {
              const data = await response.json();
              setSuggestions(data.suggestions || []);
              setShowSuggestions(true);
            }
          } catch (error) {
            console.error('Error fetching suggestions:', error);
          } finally {
            setIsLoading(false);
          }
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 300);
    },
    []
  );

  // Handle search input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedGetSuggestions(value);
  };

  // Handle search execution
  const handleSearch = useCallback(async (query = searchQuery, filters = selectedFilters) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // Save to recent searches
      const updatedRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
      setRecentSearches(updatedRecent);
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));

      // Build search parameters
      const searchParams = new URLSearchParams({
        q: query,
        ...filters,
        category: filters.category || '',
        priceRange: filters.priceRange || '',
        brand: filters.brand || '',
        sortBy: filters.sortBy || 'relevance',
        inStock: filters.inStock ? 'true' : '',
        offers: filters.offers ? 'true' : ''
      });

      // Navigate to search results
      navigate(`/search?${searchParams.toString()}`);

      // Fetch results
      const response = await fetch(`/api/search?${searchParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        onSearchResults?.(data);
      } else {
        toast.showError('Search failed. Please try again.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.showError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedFilters, recentSearches, navigate, onSearchResults, toast]);

  // Handle voice search
  const handleVoiceSearch = () => {
    if (!voiceSearchSupported) {
      toast.showWarning('Voice search is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    
    if (suggestion.type === 'product') {
      navigate(`/product/${suggestion.id}`);
    } else {
      handleSearch(suggestion.text);
    }
  };

  // Handle filter change
  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...selectedFilters, [filterKey]: value };
    setSelectedFilters(newFilters);
    
    // Auto-search if there's a query
    if (searchQuery.trim()) {
      handleSearch(searchQuery, newFilters);
    }
  };

  // Clear filters
  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      priceRange: '',
      brand: '',
      sortBy: 'relevance',
      inStock: false,
      offers: false
    };
    setSelectedFilters(clearedFilters);
    
    if (searchQuery.trim()) {
      handleSearch(searchQuery, clearedFilters);
    }
  };

  // Quick filters
  const quickFilters = [
    { key: 'offers', label: 'On Sale', icon: 'fas fa-tags' },
    { key: 'inStock', label: 'In Stock', icon: 'fas fa-check-circle' }
  ];

  // Price ranges
  const priceRanges = [
    { value: '', label: 'Any Price' },
    { value: '0-100', label: 'Under ₹100' },
    { value: '100-500', label: '₹100 - ₹500' },
    { value: '500-1000', label: '₹500 - ₹1000' },
    { value: '1000+', label: 'Over ₹1000' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popularity', label: 'Popularity' }
  ];

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.values(selectedFilters).filter(value => 
      value && value !== 'relevance' && value !== ''
    ).length;
  }, [selectedFilters]);

  return (
    <div className="advanced-search-container">
      {/* Main Search Bar */}
      <div className="search-bar-wrapper">
        <InputGroup className="search-input-group">
          <Form.Control
            ref={searchInputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
            autoComplete="off"
          />
          
          {/* Voice Search Button */}
          {voiceSearchSupported && (
            <Button
              variant={isListening ? "danger" : "outline-secondary"}
              onClick={handleVoiceSearch}
              className="voice-search-btn"
              title="Voice Search"
            >
              <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
            </Button>
          )}
          
          {/* Search Button */}
          <Button
            variant="primary"
            onClick={() => handleSearch()}
            disabled={isLoading}
            className="search-btn"
          >
            {isLoading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              <i className="fas fa-search"></i>
            )}
          </Button>
        </InputGroup>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <i className={`fas ${suggestion.type === 'product' ? 'fa-box' : 'fa-search'} suggestion-icon`}></i>
                <span className="suggestion-text">{suggestion.text}</span>
                {suggestion.category && (
                  <span className="suggestion-category">in {suggestion.category}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Recent Searches */}
        {!showSuggestions && searchQuery === '' && recentSearches.length > 0 && (
          <div className="recent-searches">
            <div className="recent-searches-header">
              <span>Recent Searches</span>
              <button 
                className="clear-recent-btn"
                onClick={() => {
                  setRecentSearches([]);
                  localStorage.removeItem('recentSearches');
                }}
              >
                Clear
              </button>
            </div>
            {recentSearches.map((search, index) => (
              <div
                key={index}
                className="recent-search-item"
                onClick={() => {
                  setSearchQuery(search);
                  handleSearch(search);
                }}
              >
                <i className="fas fa-history recent-icon"></i>
                <span>{search}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Filters */}
      <div className="quick-filters">
        {quickFilters.map((filter) => (
          <Button
            key={filter.key}
            variant={selectedFilters[filter.key] ? "primary" : "outline-primary"}
            size="sm"
            className="quick-filter-btn"
            onClick={() => handleFilterChange(filter.key, !selectedFilters[filter.key])}
          >
            <i className={filter.icon}></i>
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="advanced-filters">
        <div className="filters-row">
          {/* Price Range */}
          <Form.Select
            size="sm"
            value={selectedFilters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="filter-select"
          >
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </Form.Select>

          {/* Sort By */}
          <Form.Select
            size="sm"
            value={selectedFilters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="filter-select"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={clearFilters}
              className="clear-filters-btn"
            >
              Clear Filters
              <Badge bg="secondary" className="ms-1">{activeFiltersCount}</Badge>
            </Button>
          )}
        </div>
      </div>

      {/* Voice Search Feedback */}
      {isListening && (
        <div className="voice-feedback">
          <div className="listening-indicator">
            <div className="pulse-ring"></div>
            <div className="pulse-ring"></div>
            <div className="pulse-ring"></div>
            <i className="fas fa-microphone"></i>
          </div>
          <span>Listening... Speak now</span>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;