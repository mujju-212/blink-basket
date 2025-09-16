import React, { useState } from 'react';
import ProductsList from './ProductsList';
import ProductForm from './ProductForm';

const Products = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div>
      <ProductsList 
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
      />
      
      <ProductForm
        show={showForm}
        onHide={handleCloseForm}
        product={editingProduct}
      />
    </div>
  );
};

export default Products;