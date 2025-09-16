import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <AdminHeader />
      
      <Container fluid className="p-4">
        <Row>
          <Col md={3} lg={2}>
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </Col>
          
          <Col md={9} lg={10}>
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLayout;