import React, { useState, useEffect } from 'react';
import offersService from '../../../services/offersService';
import categoryService from '../../../services/categoryService';

const OffersManagement = () => {
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    minOrderValue: 0,
    maxDiscountAmount: 0,
    image: '',
    status: 'active',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 100,
    applicableCategories: ['all'],
    type: 'general'
  });
  const [imageUploadType, setImageUploadType] = useState('url');

  useEffect(() => {
    loadOffers();
    loadCategories();
  }, []);

  const loadOffers = () => {
    const allOffers = offersService.getAllOffers();
    setOffers(allOffers);
  };

  const loadCategories = () => {
    const allCategories = categoryService.getAllCategories();
    setCategories(allCategories);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCategoriesChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      applicableCategories: checked 
        ? [...prev.applicableCategories.filter(cat => cat !== 'all'), value]
        : prev.applicableCategories.filter(cat => cat !== value)
    }));
  };

  const handleAllCategoriesChange = (e) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      applicableCategories: checked ? ['all'] : []
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderValue: 0,
      maxDiscountAmount: 0,
      image: '',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: 100,
      applicableCategories: ['all'],
      type: 'general'
    });
  };

  const handleAddOffer = (e) => {
    e.preventDefault();
    try {
      if (!formData.title.trim() || !formData.code.trim()) {
        alert('Title and code are required');
        return;
      }
      
      offersService.createOffer(formData);
      resetForm();
      setShowAddModal(false);
      loadOffers();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      code: offer.code,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      minOrderValue: offer.minOrderValue,
      maxDiscountAmount: offer.maxDiscountAmount,
      image: offer.image,
      status: offer.status,
      startDate: offer.startDate,
      endDate: offer.endDate,
      usageLimit: offer.usageLimit,
      applicableCategories: offer.applicableCategories,
      type: offer.type
    });
    setShowEditModal(true);
  };

  const handleUpdateOffer = (e) => {
    e.preventDefault();
    try {
      if (!formData.title.trim() || !formData.code.trim()) {
        alert('Title and code are required');
        return;
      }
      
      offersService.updateOffer(editingOffer.id, formData);
      resetForm();
      setShowEditModal(false);
      setEditingOffer(null);
      loadOffers();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteOffer = (offerId) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      offersService.deleteOffer(offerId);
      loadOffers();
    }
  };

  const toggleOfferStatus = (offerId) => {
    const offer = offers.find(o => o.id === offerId);
    const newStatus = offer.status === 'active' ? 'inactive' : 'active';
    offersService.updateOffer(offerId, { status: newStatus });
    loadOffers();
  };

  const getDiscountTypeColor = (type) => {
    switch (type) {
      case 'percentage': return 'bg-success';
      case 'fixed': return 'bg-warning';
      case 'free_delivery': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  const getOfferTypeColor = (type) => {
    switch (type) {
      case 'first_order': return 'bg-primary';
      case 'category_specific': return 'bg-warning';
      case 'weekend_special': return 'bg-info';
      case 'delivery_offer': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const isUpcoming = (startDate) => {
    return new Date(startDate) > new Date();
  };

  const getUsagePercentage = (used, limit) => {
    return Math.round((used / limit) * 100);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Offers Management</h2>
          <p className="text-muted">Manage discount codes and promotional offers</p>
        </div>
        <button 
          className="btn btn-warning"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus me-2"></i>Add Offer
        </button>
      </div>
      
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Offer Details</th>
                      <th>Code</th>
                      <th>Discount</th>
                      <th>Usage</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map(offer => (
                      <tr key={offer.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {offer.image && (
                              <img 
                                src={offer.image} 
                                alt={offer.title}
                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}
                                className="me-3"
                              />
                            )}
                            <div>
                              <div className="fw-bold">{offer.title}</div>
                              <div className="text-muted small">{offer.description}</div>
                              <span className={`badge ${getOfferTypeColor(offer.type)} mt-1`}>
                                {offer.type.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-dark fs-6">{offer.code}</span>
                        </td>
                        <td>
                          <div>
                            <span className={`badge ${getDiscountTypeColor(offer.discountType)}`}>
                              {offer.discountType === 'percentage' 
                                ? `${offer.discountValue}% OFF`
                                : offer.discountType === 'fixed'
                                ? `₹${offer.discountValue} OFF`
                                : 'FREE DELIVERY'
                              }
                            </span>
                            <div className="small text-muted">
                              Min: ₹{offer.minOrderValue} | Max: ₹{offer.maxDiscountAmount}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="small">
                              {offer.usedCount} / {offer.usageLimit}
                            </div>
                            <div className="progress" style={{ height: '5px' }}>
                              <div 
                                className={`progress-bar ${getUsagePercentage(offer.usedCount, offer.usageLimit) > 80 ? 'bg-danger' : 'bg-success'}`}
                                style={{ width: `${getUsagePercentage(offer.usedCount, offer.usageLimit)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="small">
                            <div>Start: {new Date(offer.startDate).toLocaleDateString()}</div>
                            <div>End: {new Date(offer.endDate).toLocaleDateString()}</div>
                            {isExpired(offer.endDate) && <span className="badge bg-danger">Expired</span>}
                            {isUpcoming(offer.startDate) && <span className="badge bg-info">Upcoming</span>}
                          </div>
                        </td>
                        <td>
                          <span 
                            className={`badge ${offer.status === 'active' ? 'bg-success' : 'bg-secondary'}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => toggleOfferStatus(offer.id)}
                          >
                            {offer.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditOffer(offer)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteOffer(offer.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {offers.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="text-muted">
                            <i className="fas fa-tags fa-3x mb-3"></i>
                            <p>No offers found. Add your first offer!</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Offer Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Offer</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddOffer}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Offer Title</label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          name="description"
                          rows="3"
                          value={formData.description}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Offer Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="code"
                          value={formData.code}
                          onChange={handleInputChange}
                          placeholder="e.g., SAVE50"
                          style={{ textTransform: 'uppercase' }}
                          required
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Discount Type</label>
                            <select
                              className="form-control"
                              name="discountType"
                              value={formData.discountType}
                              onChange={handleInputChange}
                            >
                              <option value="percentage">Percentage</option>
                              <option value="fixed">Fixed Amount</option>
                              <option value="free_delivery">Free Delivery</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              {formData.discountType === 'percentage' ? 'Discount %' : 'Discount ₹'}
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              name="discountValue"
                              value={formData.discountValue}
                              onChange={handleInputChange}
                              min="0"
                              disabled={formData.discountType === 'free_delivery'}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Min Order Value</label>
                            <input
                              type="number"
                              className="form-control"
                              name="minOrderValue"
                              value={formData.minOrderValue}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Max Discount Amount</label>
                            <input
                              type="number"
                              className="form-control"
                              name="maxDiscountAmount"
                              value={formData.maxDiscountAmount}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Usage Limit</label>
                        <input
                          type="number"
                          className="form-control"
                          name="usageLimit"
                          value={formData.usageLimit}
                          onChange={handleInputChange}
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Offer Type</label>
                        <select
                          className="form-control"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                        >
                          <option value="general">General</option>
                          <option value="first_order">First Order</option>
                          <option value="category_specific">Category Specific</option>
                          <option value="weekend_special">Weekend Special</option>
                          <option value="delivery_offer">Delivery Offer</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Image Upload Type</label>
                        <div className="btn-group w-100" role="group">
                          <input 
                            type="radio" 
                            className="btn-check" 
                            name="uploadType" 
                            id="offer-url-type"
                            checked={imageUploadType === 'url'}
                            onChange={() => setImageUploadType('url')}
                          />
                          <label className="btn btn-outline-primary" htmlFor="offer-url-type">Image URL</label>
                          
                          <input 
                            type="radio" 
                            className="btn-check" 
                            name="uploadType" 
                            id="offer-upload-type"
                            checked={imageUploadType === 'upload'}
                            onChange={() => setImageUploadType('upload')}
                          />
                          <label className="btn btn-outline-primary" htmlFor="offer-upload-type">Upload File</label>
                        </div>
                      </div>

                      {imageUploadType === 'url' ? (
                        <div className="mb-3">
                          <label className="form-label">Image URL</label>
                          <input
                            type="url"
                            className="form-control"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            placeholder="https://example.com/offer.jpg"
                          />
                        </div>
                      ) : (
                        <div className="mb-3">
                          <label className="form-label">Upload Image</label>
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </div>
                      )}

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Start Date</label>
                            <input
                              type="date"
                              className="form-control"
                              name="startDate"
                              value={formData.startDate}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">End Date</label>
                            <input
                              type="date"
                              className="form-control"
                              name="endDate"
                              value={formData.endDate}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select
                          className="form-control"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Applicable Categories</label>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={formData.applicableCategories.includes('all')}
                            onChange={handleAllCategoriesChange}
                          />
                          <label className="form-check-label">All Categories</label>
                        </div>
                        {!formData.applicableCategories.includes('all') && categories.map(category => (
                          <div key={category.id} className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              value={category.id}
                              checked={formData.applicableCategories.includes(category.id)}
                              onChange={handleCategoriesChange}
                            />
                            <label className="form-check-label">{category.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {formData.image && (
                    <div className="mb-3">
                      <label className="form-label">Offer Preview</label>
                      <div>
                        <img 
                          src={formData.image} 
                          alt="Offer Preview"
                          style={{ width: '200px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning">
                    Add Offer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Offer Modal - Similar structure but with update functionality */}
      {showEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Offer</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdateOffer}>
                <div className="modal-body">
                  {/* Same form structure as Add Modal */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Offer Title</label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          name="description"
                          rows="3"
                          value={formData.description}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Offer Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="code"
                          value={formData.code}
                          onChange={handleInputChange}
                          placeholder="e.g., SAVE50"
                          style={{ textTransform: 'uppercase' }}
                          required
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Discount Type</label>
                            <select
                              className="form-control"
                              name="discountType"
                              value={formData.discountType}
                              onChange={handleInputChange}
                            >
                              <option value="percentage">Percentage</option>
                              <option value="fixed">Fixed Amount</option>
                              <option value="free_delivery">Free Delivery</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              {formData.discountType === 'percentage' ? 'Discount %' : 'Discount ₹'}
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              name="discountValue"
                              value={formData.discountValue}
                              onChange={handleInputChange}
                              min="0"
                              disabled={formData.discountType === 'free_delivery'}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Min Order Value</label>
                            <input
                              type="number"
                              className="form-control"
                              name="minOrderValue"
                              value={formData.minOrderValue}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Max Discount Amount</label>
                            <input
                              type="number"
                              className="form-control"
                              name="maxDiscountAmount"
                              value={formData.maxDiscountAmount}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Usage Limit</label>
                        <input
                          type="number"
                          className="form-control"
                          name="usageLimit"
                          value={formData.usageLimit}
                          onChange={handleInputChange}
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Offer Type</label>
                        <select
                          className="form-control"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                        >
                          <option value="general">General</option>
                          <option value="first_order">First Order</option>
                          <option value="category_specific">Category Specific</option>
                          <option value="weekend_special">Weekend Special</option>
                          <option value="delivery_offer">Delivery Offer</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Image Upload Type</label>
                        <div className="btn-group w-100" role="group">
                          <input 
                            type="radio" 
                            className="btn-check" 
                            name="editUploadType" 
                            id="edit-offer-url-type"
                            checked={imageUploadType === 'url'}
                            onChange={() => setImageUploadType('url')}
                          />
                          <label className="btn btn-outline-primary" htmlFor="edit-offer-url-type">Image URL</label>
                          
                          <input 
                            type="radio" 
                            className="btn-check" 
                            name="editUploadType" 
                            id="edit-offer-upload-type"
                            checked={imageUploadType === 'upload'}
                            onChange={() => setImageUploadType('upload')}
                          />
                          <label className="btn btn-outline-primary" htmlFor="edit-offer-upload-type">Upload File</label>
                        </div>
                      </div>

                      {imageUploadType === 'url' ? (
                        <div className="mb-3">
                          <label className="form-label">Image URL</label>
                          <input
                            type="url"
                            className="form-control"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            placeholder="https://example.com/offer.jpg"
                          />
                        </div>
                      ) : (
                        <div className="mb-3">
                          <label className="form-label">Upload Image</label>
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </div>
                      )}

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Start Date</label>
                            <input
                              type="date"
                              className="form-control"
                              name="startDate"
                              value={formData.startDate}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">End Date</label>
                            <input
                              type="date"
                              className="form-control"
                              name="endDate"
                              value={formData.endDate}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select
                          className="form-control"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Applicable Categories</label>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={formData.applicableCategories.includes('all')}
                            onChange={handleAllCategoriesChange}
                          />
                          <label className="form-check-label">All Categories</label>
                        </div>
                        {!formData.applicableCategories.includes('all') && categories.map(category => (
                          <div key={category.id} className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              value={category.id}
                              checked={formData.applicableCategories.includes(category.id)}
                              onChange={handleCategoriesChange}
                            />
                            <label className="form-check-label">{category.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {formData.image && (
                    <div className="mb-3">
                      <label className="form-label">Offer Preview</label>
                      <div>
                        <img 
                          src={formData.image} 
                          alt="Offer Preview"
                          style={{ width: '200px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning">
                    Update Offer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersManagement;