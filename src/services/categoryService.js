class CategoryService {
  constructor() {
    this.clearCorruptedData();
    // Only initialize if localStorage is completely empty
    // This prevents overwriting admin-added categories
    this.initializeDataOnce();
  }

  initializeDataOnce() {
    const storedCategories = localStorage.getItem('categories');
    if (!storedCategories || storedCategories === 'undefined') {
      // Set a flag that we've initialized to prevent re-initialization
      if (!localStorage.getItem('categories_initialized')) {
        this.initializeData();
        localStorage.setItem('categories_initialized', 'true');
      }
    }
  }

  clearCorruptedData() {
    try {
      const categories = localStorage.getItem('categories');
      if (categories && categories !== 'undefined') {
        JSON.parse(categories);
      }
    } catch (error) {
      console.warn('Clearing corrupted categories data:', error);
      localStorage.removeItem('categories');
    }
  }

  initializeData() {
    // Initialize with default categories that match the constants
    const defaultCategories = [
      {
        id: '1',
        name: 'Fruits & Vegetables',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&h=200&fit=crop&q=80',
        status: 'active',
        productsCount: 20
      },
      {
        id: '2',
        name: 'Dairy & Breakfast',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop&q=80',
        status: 'active',
        productsCount: 15
      },
      {
        id: '3',
        name: 'Beverages',
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop&q=80',
        status: 'active',
        productsCount: 15
      },
      {
        id: '4',
        name: 'Snacks & Munchies',
        image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&h=200&fit=crop&q=80',
        status: 'active',
        productsCount: 15
      },
      {
        id: '5',
        name: 'Bakery & Biscuits',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&q=80',
        status: 'active',
        productsCount: 10
      },
      {
        id: '6',
        name: 'Personal Care',
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop&q=80',
        status: 'active',
        productsCount: 10
      },
      {
        id: '7',
        name: 'Home Care',
        image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200&h=200&fit=crop&q=80',
        status: 'active',
        productsCount: 10
      },
      {
        id: '8',
        name: 'Baby Care',
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop&q=80',
        status: 'active',
        productsCount: 5
      }
    ];
    localStorage.setItem('categories', JSON.stringify(defaultCategories));
  }

  initializeWithConstants(constantsCategories) {
    // This method is kept for backwards compatibility but should not override existing data
    const storedCategories = localStorage.getItem('categories');
    if (!storedCategories || storedCategories === 'undefined') {
      // Only initialize if no data exists
      localStorage.setItem('categories', JSON.stringify(constantsCategories));
      this.triggerCategoriesUpdate();
    }
    // If data exists, don't override it - preserve user-added categories
  }

  getAllCategories() {
    const categories = localStorage.getItem('categories');
    if (!categories || categories === 'undefined') {
      return [];
    }
    
    try {
      const parsed = JSON.parse(categories);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Invalid categories JSON, returning empty array:', error);
      return [];
    }
  }

  getCategoryById(id) {
    const categories = this.getAllCategories();
    return categories.find(category => category.id === id);
  }

  getActiveCategories() {
    const categories = this.getAllCategories();
    return categories.filter(category => category.status === 'active');
  }

  createCategory(categoryData) {
    const categories = this.getAllCategories();
    const newCategory = {
      id: this.generateCategoryId(),
      ...categoryData,
      status: 'active', // Ensure new categories are active
      productsCount: 0,
      createdAt: new Date().toISOString()
    };
    
    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));
    console.log('✅ New category created:', newCategory);
    console.log('📋 All categories after creation:', categories);
    
    // Trigger custom event to notify other components
    this.triggerCategoriesUpdate();
    
    return newCategory;
  }

  updateCategory(categoryId, updateData) {
    const categories = this.getAllCategories();
    const categoryIndex = categories.findIndex(category => category.id === categoryId);
    
    if (categoryIndex !== -1) {
      const oldCategory = categories[categoryIndex];
      const newCategory = {
        ...oldCategory,
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      console.log('🔄 Updating category:', {
        oldName: oldCategory.name,
        newName: updateData.name,
        hasNameChange: updateData.name && oldCategory.name !== updateData.name
      });
      
      // If the category name is being changed, update all products that reference this category
      if (updateData.name && oldCategory.name !== updateData.name) {
        console.log('📝 Category name changed, updating products...');
        this.updateProductsCategory(oldCategory.name, updateData.name);
      }
      
      categories[categoryIndex] = newCategory;
      localStorage.setItem('categories', JSON.stringify(categories));
      
      // Trigger custom event to notify other components
      this.triggerCategoriesUpdate();
      
      return categories[categoryIndex];
    }
    
    return null;
  }

  deleteCategory(categoryId) {
    console.log('🗑️ deleteCategory called with ID:', categoryId, 'Type:', typeof categoryId);
    const categories = this.getAllCategories();
    console.log('Current categories before delete:', categories);
    
    // Convert both to string for consistent comparison
    const idToDelete = String(categoryId);
    console.log('ID to delete (as string):', idToDelete);
    
    const initialLength = categories.length;
    
    const filteredCategories = categories.filter(category => {
      const categoryIdStr = String(category.id);
      const isMatch = categoryIdStr === idToDelete;
      console.log(`Comparing category ID: "${categoryIdStr}" with delete ID: "${idToDelete}" - Match: ${isMatch}`);
      return !isMatch; // Keep categories that DON'T match
    });
    
    console.log('Filtered categories after delete:', filteredCategories);
    console.log(`Categories count: ${initialLength} -> ${filteredCategories.length}`);
    
    if (filteredCategories.length < initialLength) {
      localStorage.setItem('categories', JSON.stringify(filteredCategories));
      console.log('✅ Category successfully deleted');
      
      // Trigger custom event to notify other components
      this.triggerCategoriesUpdate();
      
      return { success: true, message: 'Category deleted successfully' };
    } else {
      console.log('❌ No category was deleted - ID not found');
      return { success: false, error: 'Category not found' };
    }
  }

  updateProductCount(categoryId, count) {
    const categories = this.getAllCategories();
    const categoryIndex = categories.findIndex(category => category.id === categoryId);
    
    if (categoryIndex !== -1) {
      categories[categoryIndex].productsCount = count;
      localStorage.setItem('categories', JSON.stringify(categories));
      return categories[categoryIndex];
    }
    
    return null;
  }

  generateCategoryId() {
    return 'cat' + Date.now() + Math.random().toString(36).substr(2, 5);
  }

  triggerCategoriesUpdate() {
    // Trigger a custom event to notify components that categories have been updated
    const event = new CustomEvent('categoriesUpdated');
    window.dispatchEvent(event);
  }

  updateProductsCategory(oldCategoryName, newCategoryName) {
    console.log('🔄 updateProductsCategory called:', { oldCategoryName, newCategoryName });
    
    // Update all products that reference the old category name
    const products = localStorage.getItem('products');
    console.log('📦 Products in localStorage:', products ? 'Found' : 'Not found');
    
    if (products) {
      try {
        const productsArray = JSON.parse(products);
        console.log('📦 Total products:', productsArray.length);
        
        const productsToUpdate = productsArray.filter(product => product.category === oldCategoryName);
        console.log('📦 Products matching old category name:', productsToUpdate.length);
        
        const updatedProducts = productsArray.map(product => {
          if (product.category === oldCategoryName) {
            console.log('🔄 Updating product:', product.name, 'from', oldCategoryName, 'to', newCategoryName);
            return { ...product, category: newCategoryName };
          }
          return product;
        });
        
        const updatedCount = updatedProducts.filter(p => p.category === newCategoryName).length;
        console.log('✅ Products now in new category:', updatedCount);
        
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        console.log(`✅ Updated ${updatedCount} products from category "${oldCategoryName}" to "${newCategoryName}"`);
      } catch (error) {
        console.error('❌ Error updating products category:', error);
      }
    }
  }

  getCategoryStats() {
    const categories = this.getAllCategories();
    const totalProducts = categories.reduce((sum, category) => sum + (category.productsCount || 0), 0);
    
    return {
      totalCategories: categories.length,
      activeCategories: categories.filter(c => c.status === 'active').length,
      totalProducts,
      averageProductsPerCategory: categories.length > 0 ? Math.round(totalProducts / categories.length) : 0
    };
  }
}

export default new CategoryService();