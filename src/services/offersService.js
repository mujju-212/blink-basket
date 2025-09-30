import { OFFERS } from '../utils/constants';

class OffersService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    const storedOffers = localStorage.getItem('offers');
    if (!storedOffers) {
      // Initialize with offers from constants
      const defaultOffers = OFFERS.map((offer, index) => ({
        id: `offer${offer.id}`,
        title: offer.title,
        description: offer.description,
        code: offer.code,
        discountType: offer.type === 'percentage' ? 'percentage' : offer.type === 'fixed' ? 'fixed' : 'free_delivery',
        discountValue: offer.discount,
        minOrderValue: offer.minOrder,
        maxDiscountAmount: offer.type === 'percentage' ? Math.floor(offer.minOrder * (offer.discount / 100)) : offer.discount,
        image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-12/paan-corner_web.png',
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: 1000,
        usedCount: Math.floor(Math.random() * 100),
        applicableCategories: ['all'],
        type: offer.type === 'free_delivery' ? 'free_delivery' : 'general'
      }));
      localStorage.setItem('offers', JSON.stringify(defaultOffers));
    }
  }

  getAllOffers() {
    const offers = localStorage.getItem('offers');
    return offers ? JSON.parse(offers) : [];
  }

  getOfferById(id) {
    const offers = this.getAllOffers();
    return offers.find(offer => offer.id === id);
  }

  getOfferByCode(code) {
    const offers = this.getAllOffers();
    return offers.find(offer => offer.code === code);
  }

  getActiveOffers() {
    const offers = this.getAllOffers();
    const now = new Date().toISOString().split('T')[0];
    return offers.filter(offer => 
      offer.status === 'active' && 
      offer.startDate <= now && 
      offer.endDate >= now &&
      offer.usedCount < offer.usageLimit
    );
  }

  createOffer(offerData) {
    const offers = this.getAllOffers();
    
    // Check if code already exists
    const existingOffer = offers.find(offer => offer.code === offerData.code);
    if (existingOffer) {
      throw new Error('Offer code already exists');
    }
    
    const newOffer = {
      id: this.generateOfferId(),
      ...offerData,
      usedCount: 0,
      createdAt: new Date().toISOString()
    };
    
    offers.push(newOffer);
    localStorage.setItem('offers', JSON.stringify(offers));
    return newOffer;
  }

  updateOffer(offerId, updateData) {
    const offers = this.getAllOffers();
    const offerIndex = offers.findIndex(offer => offer.id === offerId);
    
    if (offerIndex !== -1) {
      // Check if code already exists (excluding current offer)
      if (updateData.code) {
        const existingOffer = offers.find(offer => offer.code === updateData.code && offer.id !== offerId);
        if (existingOffer) {
          throw new Error('Offer code already exists');
        }
      }
      
      offers[offerIndex] = {
        ...offers[offerIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('offers', JSON.stringify(offers));
      return offers[offerIndex];
    }
    
    return null;
  }

  deleteOffer(offerId) {
    const offers = this.getAllOffers();
    const filteredOffers = offers.filter(offer => offer.id !== offerId);
    localStorage.setItem('offers', JSON.stringify(filteredOffers));
    return true;
  }

  validateOffer(code, orderValue, categoryId = null) {
    const offer = this.getOfferByCode(code);
    
    if (!offer) {
      return { valid: false, message: 'Invalid offer code' };
    }
    
    if (offer.status !== 'active') {
      return { valid: false, message: 'Offer is not active' };
    }
    
    const now = new Date().toISOString().split('T')[0];
    if (offer.startDate > now || offer.endDate < now) {
      return { valid: false, message: 'Offer has expired or not started yet' };
    }
    
    if (offer.usedCount >= offer.usageLimit) {
      return { valid: false, message: 'Offer usage limit reached' };
    }
    
    if (orderValue < offer.minOrderValue) {
      return { 
        valid: false, 
        message: `Minimum order value should be ₹${offer.minOrderValue}` 
      };
    }
    
    if (categoryId && !offer.applicableCategories.includes('all') && !offer.applicableCategories.includes(categoryId)) {
      return { valid: false, message: 'Offer not applicable for selected items' };
    }
    
    // Calculate discount
    let discountAmount = 0;
    if (offer.discountType === 'percentage') {
      discountAmount = Math.min((orderValue * offer.discountValue) / 100, offer.maxDiscountAmount);
    } else if (offer.discountType === 'fixed') {
      discountAmount = Math.min(offer.discountValue, orderValue);
    }
    
    return { 
      valid: true, 
      discountAmount, 
      offer,
      message: `Offer applied successfully! You saved ₹${discountAmount}` 
    };
  }

  incrementUsage(offerId) {
    const offers = this.getAllOffers();
    const offerIndex = offers.findIndex(offer => offer.id === offerId);
    
    if (offerIndex !== -1) {
      offers[offerIndex].usedCount += 1;
      localStorage.setItem('offers', JSON.stringify(offers));
      return offers[offerIndex];
    }
    
    return null;
  }

  generateOfferId() {
    return 'offer' + Date.now() + Math.random().toString(36).substr(2, 5);
  }

  getOfferStats() {
    const offers = this.getAllOffers();
    const activeOffers = this.getActiveOffers();
    const totalUsage = offers.reduce((sum, offer) => sum + offer.usedCount, 0);
    
    return {
      totalOffers: offers.length,
      activeOffers: activeOffers.length,
      expiredOffers: offers.filter(o => new Date(o.endDate) < new Date()).length,
      totalUsage,
      averageUsagePerOffer: offers.length > 0 ? Math.round(totalUsage / offers.length) : 0
    };
  }
}

export default new OffersService();