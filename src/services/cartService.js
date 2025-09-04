class CartService {
  getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  addToCart(product, quantity = 1) {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    this.saveCart(cart);
    return cart;
  }

  removeFromCart(productId) {
    const cart = this.getCart();
    const filteredCart = cart.filter(item => item.id !== productId);
    this.saveCart(filteredCart);
    return filteredCart;
  }

  updateQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      }
      item.quantity = quantity;
      this.saveCart(cart);
    }
    
    return cart;
  }

  clearCart() {
    localStorage.removeItem('cart');
    return [];
  }

  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartItemsCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
}

export default new CartService();