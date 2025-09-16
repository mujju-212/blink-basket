import React, { useState } from 'react';
import CategoriesList from './CategoriesList';
import CategoryForm from './CategoryForm';

const Categories = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <div>
      <CategoriesList 
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
      />
      
      <CategoryForm
        show={showForm}
        onHide={handleCloseForm}
        category={editingCategory}
      />
    </div>
  );
};

export default Categories;