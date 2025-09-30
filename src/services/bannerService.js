import { BANNER_SLIDES } from '../utils/constants';

class BannerService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    const storedBanners = localStorage.getItem('banners');
    if (!storedBanners) {
      // Initialize with banners from constants
      const defaultBanners = BANNER_SLIDES.map((slide, index) => ({
        id: `banner${slide.id}`,
        title: slide.title,
        description: slide.subtitle,
        image: slide.image,
        linkUrl: '#',
        buttonText: slide.buttonText,
        status: 'active',
        position: index + 1,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'promotion'
      }));
      localStorage.setItem('banners', JSON.stringify(defaultBanners));
    }
  }

  getAllBanners() {
    const banners = localStorage.getItem('banners');
    return banners ? JSON.parse(banners).sort((a, b) => a.position - b.position) : [];
  }

  getBannerById(id) {
    const banners = this.getAllBanners();
    return banners.find(banner => banner.id === id);
  }

  getActiveBanners() {
    const banners = this.getAllBanners();
    const now = new Date().toISOString().split('T')[0];
    return banners.filter(banner => 
      banner.status === 'active' && 
      banner.startDate <= now && 
      banner.endDate >= now
    );
  }

  createBanner(bannerData) {
    const banners = this.getAllBanners();
    const newBanner = {
      id: this.generateBannerId(),
      ...bannerData,
      position: banners.length + 1,
      createdAt: new Date().toISOString()
    };
    
    banners.push(newBanner);
    localStorage.setItem('banners', JSON.stringify(banners));
    return newBanner;
  }

  updateBanner(bannerId, updateData) {
    const banners = this.getAllBanners();
    const bannerIndex = banners.findIndex(banner => banner.id === bannerId);
    
    if (bannerIndex !== -1) {
      banners[bannerIndex] = {
        ...banners[bannerIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('banners', JSON.stringify(banners));
      return banners[bannerIndex];
    }
    
    return null;
  }

  deleteBanner(bannerId) {
    const banners = this.getAllBanners();
    const filteredBanners = banners.filter(banner => banner.id !== bannerId);
    localStorage.setItem('banners', JSON.stringify(filteredBanners));
    return true;
  }

  updateBannerPosition(bannerId, newPosition) {
    const banners = this.getAllBanners();
    const bannerIndex = banners.findIndex(banner => banner.id === bannerId);
    
    if (bannerIndex !== -1) {
      banners[bannerIndex].position = newPosition;
      localStorage.setItem('banners', JSON.stringify(banners));
      return banners[bannerIndex];
    }
    
    return null;
  }

  generateBannerId() {
    return 'banner' + Date.now() + Math.random().toString(36).substr(2, 5);
  }

  getBannerStats() {
    const banners = this.getAllBanners();
    const activeBanners = this.getActiveBanners();
    
    return {
      totalBanners: banners.length,
      activeBanners: activeBanners.length,
      expiredBanners: banners.filter(b => new Date(b.endDate) < new Date()).length,
      upcomingBanners: banners.filter(b => new Date(b.startDate) > new Date()).length
    };
  }
}

export default new BannerService();