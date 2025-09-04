import React, { useState } from 'react';
import { Card, Form, Button, Badge, Accordion } from 'react-bootstrap';

const SearchFilters = ({ onFiltersChange, categories }) => {
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 1000],
    rating: 0,
    inStock: false,
    discount: false
  });

  const handleCategoryChange = (categoryName, checked) => {
    const updatedCategories = checked
      ? [...filters.categories, categoryName]
      : filters.categories.filter(cat => cat !== categoryName);
    
    const newFilters = { ...filters, categories: updatedCategories };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceChange = (field, value) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[field] = parseInt(value) || 0;
    
    const newFilters = { ...filters, priceRange: newPriceRange };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      categories: [],
      priceRange: [0, 1000],
      rating: 0,
      inStock: false,
      discount: false
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.rating > 0) count++;
    if (filters.inStock) count++;
    if (filters.discount) count++;
    return count;
  };

  return (
    <Card className="filters-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <h6 className="mb-0">Filters</h6>
          {getActiveFiltersCount() > 0 && (
            <Badge bg="primary">{getActiveFiltersCount()}</Badge>
          )}
        </div>
        <Button variant="link" size="sm" onClick={clearFilters} className="p-0">
          Clear All
        </Button>
      </Card.Header>
      
      <Card.Body className="p-0">
        <Accordion defaultActiveKey={['0', '1']} alwaysOpen>
          {/* Categories Filter */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>Categories</Accordion.Header>
            <Accordion.Body>
              {categories.map(category => (
                <Form.Check
                  key={category.id}
                  type="checkbox"
                  id={`category-${category.id}`}
                  label={category.name}
                  checked={filters.categories.includes(category.name)}
                  onChange={(e) => handleCategoryChange(category.name, e.target.checked)}
                  className="mb-2"
                />
              ))}
            </Accordion.Body>
          </Accordion.Item>

          {/* Price Range Filter */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>Price Range</Accordion.Header>
            <Accordion.Body>
              <div className="d-flex gap-2 mb-3">
                <Form.Control
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(0, e.target.value)}
                  size="sm"
                />
                <Form.Control
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  size="sm"
                />
              </div>
              <Form.Range
                min={0}
                max={1000}
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
              />
              <div className="d-flex justify-content-between small text-muted">
                <span>₹{filters.priceRange[0]}</span>
                <span>₹{filters.priceRange[1]}</span>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          {/* Rating Filter */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>Customer Rating</Accordion.Header>
            <Accordion.Body>
              {[4, 3, 2, 1].map(rating => (
                <Form.Check
                  key={rating}
                  type="radio"
                  name="rating"
                  id={`rating-${rating}`}
                  label={
                    <div className="d-flex align-items-center">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${i < rating ? 'text-warning' : 'text-muted'} me-1`}
                        />
                      ))}
                      <span className="ms-1">& above</span>
                    </div>
                  }
                  checked={filters.rating === rating}
                  onChange={() => handleFilterChange('rating', rating)}
                  className="mb-2"
                />
              ))}
            </Accordion.Body>
          </Accordion.Item>

          {/* Availability Filter */}
          <Accordion.Item eventKey="3">
            <Accordion.Header>Availability</Accordion.Header>
            <Accordion.Body>
              <Form.Check
                type="checkbox"
                id="in-stock"
                label="In Stock Only"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="mb-2"
              />
              <Form.Check
                type="checkbox"
                id="discount"
                label="On Sale"
                checked={filters.discount}
                onChange={(e) => handleFilterChange('discount', e.target.checked)}
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>
    </Card>
  );
};

export default SearchFilters;