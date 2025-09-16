import React from 'react';
import { Card, Nav } from 'react-bootstrap';
import { FaTachometerAlt, FaTags, FaBoxes, FaPercent, FaImage, FaUsers } from 'react-icons/fa';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { key: 'categories', label: 'Categories', icon: FaTags },
    { key: 'products', label: 'Products', icon: FaBoxes },
    { key: 'offers', label: 'Offers', icon: FaPercent },
    { key: 'banners', label: 'Banners', icon: FaImage },
    { key: 'users', label: 'Users', icon: FaUsers }
  ];

  return (
    <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
      <Card.Body className="p-3">
        <Nav variant="pills" className="flex-column">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Nav.Item key={item.key} className="mb-2">
                <Nav.Link 
                  onClick={() => setActiveTab(item.key)}
                  className={`rounded-pill ${activeTab === item.key ? 'text-dark' : 'text-secondary'}`}
                  style={{ 
                    backgroundColor: activeTab === item.key ? '#ffd60a' : 'transparent',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  <IconComponent className="me-2" />
                  {item.label}
                </Nav.Link>
              </Nav.Item>
            );
          })}
        </Nav>
      </Card.Body>
    </Card>
  );
};

export default AdminSidebar;