import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const productsData = productService.getAllProducts();
        const categoriesData = productService.getAllCategories();
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Listen for real-time product updates from admin
    const handleProductsUpdate = (event) => {
      console.log('🔄 User-end: Products updated from admin', event.detail.products.length);
      setProducts(event.detail.products);
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);

    // Cleanup event listener
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, []);

  const searchProducts = (query) => {
    return productService.searchProducts(query);
  };

  const getProductsByCategory = (category) => {
    return productService.getProductsByCategory(category);
  };

  const getFeaturedProducts = (limit) => {
    return productService.getFeaturedProducts(limit);
  };

  return {
    products,
    categories,
    loading,
    error,
    searchProducts,
    getProductsByCategory,
    getFeaturedProducts
  };
};

export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = productService.getProductById(parseInt(id));
        const related = productService.getRelatedProducts(parseInt(id));
        
        setProduct(productData);
        setRelatedProducts(related);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  return {
    product,
    relatedProducts,
    loading,
    error
  };
};