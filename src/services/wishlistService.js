class WishlistService {
  getWishlist() {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  }

  saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }

  addToWishlist(product) {
    const wishlist = this.getWishlist();
    const exists = wishlist.find(item => item.id === product.id);
    
    if (!exists) {
      wishlist.push(product);
      this.saveWishlist(wishlist);
    }
    
    return wishlist;
  }

  removeFromWishlist(productId) {
    const wishlist = this.getWishlist();
    const filteredWishlist = wishlist.filter(item => item.id !== productId);
    this.saveWishlist(filteredWishlist);
    return filteredWishlist;
  }

  toggleWishlist(product) {
    const wishlist = this.getWishlist();
    const exists = wishlist.find(item => item.id === product.id);
    
    if (exists) {
      return this.removeFromWishlist(product.id);
    } else {
      return this.addToWishlist(product);
    }
  }

  isInWishlist(productId) {
    const wishlist = this.getWishlist();
    return wishlist.some(item => item.id === productId);
  }
}

export default new WishlistService();