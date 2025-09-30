import React, { useState, useEffect } from 'react';
import bannerService from '../../../services/bannerService';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    linkUrl: '',
    type: 'promotion',
    status: 'active',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [imageUploadType, setImageUploadType] = useState('url');

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = () => {
    const allBanners = bannerService.getAllBanners();
    setBanners(allBanners);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleAddBanner = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image) {
      alert('Title and image are required');
      return;
    }
    
    bannerService.createBanner(formData);
    setFormData({
      title: '',
      description: '',
      image: '',
      linkUrl: '',
      type: 'promotion',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setShowAddModal(false);
    loadBanners();
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      image: banner.image,
      linkUrl: banner.linkUrl,
      type: banner.type,
      status: banner.status,
      startDate: banner.startDate,
      endDate: banner.endDate
    });
    setShowEditModal(true);
  };

  const handleUpdateBanner = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image) {
      alert('Title and image are required');
      return;
    }
    
    bannerService.updateBanner(editingBanner.id, formData);
    setFormData({
      title: '',
      description: '',
      image: '',
      linkUrl: '',
      type: 'promotion',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setShowEditModal(false);
    setEditingBanner(null);
    loadBanners();
  };

  const handleDeleteBanner = (bannerId) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      bannerService.deleteBanner(bannerId);
      loadBanners();
    }
  };

  const toggleBannerStatus = (bannerId) => {
    const banner = banners.find(b => b.id === bannerId);
    const newStatus = banner.status === 'active' ? 'inactive' : 'active';
    bannerService.updateBanner(bannerId, { status: newStatus });
    loadBanners();
  };

  const getBannerTypeColor = (type) => {
    switch (type) {
      case 'promotion': return 'bg-warning';
      case 'announcement': return 'bg-info';
      case 'product': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const isUpcoming = (startDate) => {
    return new Date(startDate) > new Date();
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Banner Management</h2>
          <p className="text-muted">Manage promotional banners and announcements</p>
        </div>
        <button 
          className="btn btn-warning"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus me-2"></i>Add Banner
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
                      <th>Preview</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Position</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banners.map(banner => (
                      <tr key={banner.id}>
                        <td>
                          <img 
                            src={banner.image} 
                            alt={banner.title}
                            style={{ width: '80px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        </td>
                        <td>
                          <div className="fw-bold">{banner.title}</div>
                          <div className="text-muted small">{banner.description}</div>
                        </td>
                        <td>
                          <span className={`badge ${getBannerTypeColor(banner.type)}`}>
                            {banner.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <div className="small">
                            <div>Start: {new Date(banner.startDate).toLocaleDateString()}</div>
                            <div>End: {new Date(banner.endDate).toLocaleDateString()}</div>
                            {isExpired(banner.endDate) && <span className="badge bg-danger">Expired</span>}
                            {isUpcoming(banner.startDate) && <span className="badge bg-info">Upcoming</span>}
                          </div>
                        </td>
                        <td>
                          <span 
                            className={`badge ${banner.status === 'active' ? 'bg-success' : 'bg-secondary'}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => toggleBannerStatus(banner.id)}
                          >
                            {banner.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-primary">#{banner.position}</span>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditBanner(banner)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteBanner(banner.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {banners.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="text-muted">
                            <i className="fas fa-images fa-3x mb-3"></i>
                            <p>No banners found. Add your first banner!</p>
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

      {/* Add Banner Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Banner</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddBanner}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Banner Title</label>
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
                        <label className="form-label">Link URL (optional)</label>
                        <input
                          type="url"
                          className="form-control"
                          name="linkUrl"
                          value={formData.linkUrl}
                          onChange={handleInputChange}
                          placeholder="/category/fruits"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Banner Type</label>
                        <select
                          className="form-control"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                        >
                          <option value="promotion">Promotion</option>
                          <option value="announcement">Announcement</option>
                          <option value="product">Product</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Image Upload Type</label>
                        <div className="btn-group w-100" role="group">
                          <input 
                            type="radio" 
                            className="btn-check" 
                            name="uploadType" 
                            id="banner-url-type"
                            checked={imageUploadType === 'url'}
                            onChange={() => setImageUploadType('url')}
                          />
                          <label className="btn btn-outline-primary" htmlFor="banner-url-type">Image URL</label>
                          
                          <input 
                            type="radio" 
                            className="btn-check" 
                            name="uploadType" 
                            id="banner-upload-type"
                            checked={imageUploadType === 'upload'}
                            onChange={() => setImageUploadType('upload')}
                          />
                          <label className="btn btn-outline-primary" htmlFor="banner-upload-type">Upload File</label>
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
                            placeholder="https://example.com/banner.jpg"
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
                    </div>
                  </div>

                  {formData.image && (
                    <div className="mb-3">
                      <label className="form-label">Banner Preview</label>
                      <div>
                        <img 
                          src={formData.image} 
                          alt="Banner Preview"
                          style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
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
                    Add Banner
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Banner Modal */}
      {showEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Banner</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdateBanner}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Banner Title</label>
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
                        <label className="form-label">Link URL (optional)</label>
                        <input
                          type="url"
                          className="form-control"
                          name="linkUrl"
                          value={formData.linkUrl}
                          onChange={handleInputChange}
                          placeholder="/category/fruits"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Banner Type</label>
                        <select
                          className="form-control"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                        >
                          <option value="promotion">Promotion</option>
                          <option value="announcement">Announcement</option>
                          <option value="product">Product</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Image Upload Type</label>
                        <div className="btn-group w-100" role="group">
                          <input 
                            type="radio" 
                            className="btn-check" 
                            name="editUploadType" 
                            id="edit-banner-url-type"
                            checked={imageUploadType === 'url'}
                            onChange={() => setImageUploadType('url')}
                          />
                          <label className="btn btn-outline-primary" htmlFor="edit-banner-url-type">Image URL</label>
                          
                          <input 
                            type="radio" 
                            className="btn-check" 
                            name="editUploadType" 
                            id="edit-banner-upload-type"
                            checked={imageUploadType === 'upload'}
                            onChange={() => setImageUploadType('upload')}
                          />
                          <label className="btn btn-outline-primary" htmlFor="edit-banner-upload-type">Upload File</label>
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
                            placeholder="https://example.com/banner.jpg"
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
                    </div>
                  </div>

                  {formData.image && (
                    <div className="mb-3">
                      <label className="form-label">Banner Preview</label>
                      <div>
                        <img 
                          src={formData.image} 
                          alt="Banner Preview"
                          style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
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
                    Update Banner
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

export default BannerManagement;