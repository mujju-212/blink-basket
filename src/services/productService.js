import { PRODUCTS, CATEGORIES } from '../utils/constants';

class ProductService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    const storedProducts = localStorage.getItem('products');
    const storedCategories = localStorage.getItem('categories');

    if (!storedProducts) {
      localStorage.setItem('products', JSON.stringify(PRODUCTS));
    }

    if (!storedCategories) {
      localStorage.setItem('categories', JSON.stringify(CATEGORIES));
    }
  }

  getAllProducts() {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : PRODUCTS;
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
    const categories = localStorage.getItem('categories');
    return categories ? JSON.parse(categories) : CATEGORIES;
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
    const categories = this.getAllCategories();
    const newCategory = {
      id: Date.now(),
      ...category,
      products: 0
    };
    
    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));
    return newCategory;
  }

  updateCategory(id, updatedCategory) {
    const categories = this.getAllCategories();
    const index = categories.findIndex(category => category.id === id);
    
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updatedCategory };
      localStorage.setItem('categories', JSON.stringify(categories));
      return categories[index];
    }
    
    return null;
  }

  deleteCategory(id) {
    const categories = this.getAllCategories();
    const filteredCategories = categories.filter(category => category.id !== id);
    localStorage.setItem('categories', JSON.stringify(filteredCategories));
    return true;
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