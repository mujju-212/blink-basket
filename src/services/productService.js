import { PRODUCTS, CATEGORIES } from '../utils/constants';
import categoryService from './categoryService';

class ProductService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    const storedProducts = localStorage.getItem('products');

    if (!storedProducts) {
      localStorage.setItem('products', JSON.stringify(PRODUCTS));
    }

    // Initialize categories using categoryService
    const constantsCategories = CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.name,
      image: cat.image,
      products: cat.products,
      status: 'active'
    }));
    categoryService.initializeWithConstants(constantsCategories);
  }

  getAllProducts() {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : PRODUCTS;
  }

  // Force reload all products from constants (for debugging/reset)
  reloadFromConstants() {
    console.log('🔄 Forcing reload from constants...');
    console.log('📦 PRODUCTS constant has', PRODUCTS.length, 'products');
    
    // Clear localStorage completely
    localStorage.removeItem('products');
    localStorage.removeItem('categories');
    
    // Force set new data
    localStorage.setItem('products', JSON.stringify(PRODUCTS));
    
    // Verify what was stored
    const stored = localStorage.getItem('products');
    const parsed = stored ? JSON.parse(stored) : [];
    console.log('✅ Stored in localStorage:', parsed.length, 'products');
    console.log('📋 Sample stored products:', parsed.slice(0, 3).map(p => ({ id: p.id, name: p.name })));
    
    return PRODUCTS;
  }

  getProductById(id) {
    const products = this.getAllProducts();
    return products.find(product => product.id === parseInt(id));
  }

  getProductsByCategory(category) {
    const products = this.getAllProducts();
    return products.filter(product => product.category === category);
  }

  searchProducts(query) {
    const products = this.getAllProducts();
    const searchTerm = query.toLowerCase();
    
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }

  getAllCategories() {
    return categoryService.getAllCategories();
  }

  addProduct(product) {
    const products = this.getAllProducts();
    const newProduct = {
      id: Date.now(),
      ...product
    };
    
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    return newProduct;
  }

  updateProduct(id, updatedProduct) {
    const products = this.getAllProducts();
    const index = products.findIndex(product => product.id === id);
    
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
      localStorage.setItem('products', JSON.stringify(products));
      return products[index];
    }
    
    return null;
  }

  deleteProduct(id) {
    const products = this.getAllProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    localStorage.setItem('products', JSON.stringify(filteredProducts));
    return true;
  }

  addCategory(category) {
    return categoryService.createCategory(category);
  }

  updateCategory(id, updatedCategory) {
    return categoryService.updateCategory(id, updatedCategory);
  }

  deleteCategory(id) {
    return categoryService.deleteCategory(id);
  }

  getFeaturedProducts(limit = 20) {
    const products = this.getAllProducts();
    return products.slice(0, limit);
  }

  getRelatedProducts(productId, limit = 4) {
    const product = this.getProductById(productId);
    if (!product) return [];
    
    const products = this.getAllProducts();
    return products
      .filter(p => p.category === product.category && p.id !== productId)
      .slice(0, limit);
  }
}

export default new ProductService();