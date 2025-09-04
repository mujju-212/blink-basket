import { authService } from './authService';

class AddressService {
  getAddresses() {
    const addresses = localStorage.getItem('addresses');
    return addresses ? JSON.parse(addresses) : [];
  }

  saveAddresses(addresses) {
    localStorage.setItem('addresses', JSON.stringify(addresses));
  }

  addAddress(address) {
    const addresses = this.getAddresses();
    const newAddress = {
      id: Date.now(),
      ...address
    };
    
    addresses.push(newAddress);
    this.saveAddresses(addresses);
    return newAddress;
  }

  updateAddress(id, updatedAddress) {
    const addresses = this.getAddresses();
    const index = addresses.findIndex(addr => addr.id === id);
    
    if (index !== -1) {
      addresses[index] = { ...addresses[index], ...updatedAddress };
      this.saveAddresses(addresses);
      return addresses[index];
    }
    
    return null;
  }

  deleteAddress(id) {
    const addresses = this.getAddresses();
    const filteredAddresses = addresses.filter(addr => addr.id !== id);
    this.saveAddresses(filteredAddresses);
    return true;
  }
}

export default new AddressService();