/**
 * Chorbajar - Centralized Storage and State Management
 * Pure Vanilla JavaScript utilizing localStorage & sessionStorage
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    INIT: 'chorbajar_initialized',
    PRODUCTS: 'chorbajar_products',
    USERS: 'chorbajar_users',
    CURRENT_USER: 'chorbajar_current_user',
    REMEMBER_ME: 'chorbajar_remember_me',
    CART: 'chorbajar_cart',
    WISHLIST: 'chorbajar_wishlist',
    ORDERS: 'chorbajar_orders',
    ADDRESSES: 'chorbajar_addresses',
    COUPONS: 'chorbajar_coupons',
    SETTINGS: 'chorbajar_settings'
  };

  // Helper to safely get parsed JSON
  function getJSON(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('Storage Read Error for ' + key, e);
      return defaultValue;
    }
  }

  // Helper to safely set JSON
  function setJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage Write Error for ' + key, e);
    }
  }

  const Storage = {
    // Initialize default data if not already present
    init() {
      const initialized = localStorage.getItem(STORAGE_KEYS.INIT);
      if (!initialized) {
        this.resetToDefaults();
      } else {
        // Upgrade avatar to harshit.png and name to Harshit Joshi if previously saved with old defaults
        const users = this.getUsers();
        let changed = false;
        users.forEach(u => {
          if (u.name === 'Rahul Sharma') {
            u.name = 'Harshit Joshi';
            changed = true;
          }
          if (!u.avatar || u.avatar.includes('unsplash.com')) {
            u.avatar = 'assets/harshit.png';
            changed = true;
          }
        });
        if (changed) setJSON(STORAGE_KEYS.USERS, users);

        const current = this.getCurrentUser();
        if (current) {
          let currChanged = false;
          if (current.name === 'Rahul Sharma') {
            current.name = 'Harshit Joshi';
            currChanged = true;
          }
          if (!current.avatar || current.avatar.includes('unsplash.com')) {
            current.avatar = 'assets/harshit.png';
            currChanged = true;
          }
          if (currChanged) this.setCurrentUser(current, true);
        }

        // Migrate addresses if any had old default name
        const addresses = getJSON(STORAGE_KEYS.ADDRESSES, []);
        let addrChanged = false;
        addresses.forEach(a => {
          if (a.fullName && a.fullName.includes('Rahul Sharma')) {
            a.fullName = a.fullName.replace('Rahul Sharma', 'Harshit Joshi');
            addrChanged = true;
          }
        });
        if (addrChanged) setJSON(STORAGE_KEYS.ADDRESSES, addresses);

        // Migrate orders if any had old default name
        const orders = getJSON(STORAGE_KEYS.ORDERS, []);
        let ordersChanged = false;
        orders.forEach(o => {
          if (o.customerName === 'Rahul Sharma') {
            o.customerName = 'Harshit Joshi';
            ordersChanged = true;
          }
          if (o.shippingAddress && o.shippingAddress.fullName && o.shippingAddress.fullName.includes('Rahul Sharma')) {
            o.shippingAddress.fullName = o.shippingAddress.fullName.replace('Rahul Sharma', 'Harshit Joshi');
            ordersChanged = true;
          }
        });
        if (ordersChanged) setJSON(STORAGE_KEYS.ORDERS, orders);
      }
    },

    // Reset everything back to original mock data
    resetToDefaults() {
      localStorage.clear();
      sessionStorage.clear();

      setJSON(STORAGE_KEYS.PRODUCTS, window.CHORBAJAR_DEFAULT_PRODUCTS || []);
      setJSON(STORAGE_KEYS.USERS, window.CHORBAJAR_DEFAULT_USERS || []);
      setJSON(STORAGE_KEYS.ADDRESSES, window.CHORBAJAR_DEFAULT_ADDRESSES || []);
      setJSON(STORAGE_KEYS.ORDERS, window.CHORBAJAR_DEFAULT_ORDERS || []);
      setJSON(STORAGE_KEYS.COUPONS, window.CHORBAJAR_DEFAULT_COUPONS || []);
      setJSON(STORAGE_KEYS.SETTINGS, {
        storeName: 'Chorbajar',
        storeEmail: 'support@chorbajar.in',
        storePhone: '+91 1800-CHORBAJAR',
        shippingFee: 49,
        freeShippingThreshold: 500,
        taxPercent: 5,
        currency: '₹'
      });
      setJSON(STORAGE_KEYS.CART, []);
      setJSON(STORAGE_KEYS.WISHLIST, []);

      // Auto login default customer for seamless testing convenience
      const defaultUser = (window.CHORBAJAR_DEFAULT_USERS || [])[0];
      if (defaultUser) {
        this.setCurrentUser(defaultUser);
      }

      localStorage.setItem(STORAGE_KEYS.INIT, 'true');
      console.log('Chorbajar mock storage successfully reset to default state.');
    },

    // PRODUCTS
    getProducts() {
      return getJSON(STORAGE_KEYS.PRODUCTS, window.CHORBAJAR_DEFAULT_PRODUCTS || []);
    },

    getProductById(id) {
      const products = this.getProducts();
      return products.find(p => String(p.id) === String(id)) || null;
    },

    addProduct(product) {
      const products = this.getProducts();
      const newId = products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;
      const newProduct = {
        ...product,
        id: newId,
        reviewsCount: product.reviewsCount || 0,
        rating: product.rating || 4.5,
        images: product.images || [product.image]
      };
      products.unshift(newProduct);
      setJSON(STORAGE_KEYS.PRODUCTS, products);
      return newProduct;
    },

    updateProduct(id, updates) {
      const products = this.getProducts();
      const index = products.findIndex(p => String(p.id) === String(id));
      if (index !== -1) {
        products[index] = { ...products[index], ...updates };
        setJSON(STORAGE_KEYS.PRODUCTS, products);
        return products[index];
      }
      return null;
    },

    deleteProduct(id) {
      let products = this.getProducts();
      products = products.filter(p => String(p.id) !== String(id));
      setJSON(STORAGE_KEYS.PRODUCTS, products);
    },

    // CART
    getCart() {
      return getJSON(STORAGE_KEYS.CART, []);
    },

    saveCart(cart) {
      setJSON(STORAGE_KEYS.CART, cart);
      window.dispatchEvent(new CustomEvent('chorbajar:cart-updated', { detail: cart }));
    },

    addToCart(productId, quantity = 1, variant = null) {
      const product = this.getProductById(productId);
      if (!product) return { success: false, message: 'Product not found' };
      if (product.stock <= 0) return { success: false, message: 'Product is out of stock' };

      const cart = this.getCart();
      const existingItem = cart.find(item => item.productId === Number(productId) && item.variant === variant);

      if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        if (newQty > product.stock) {
          return { success: false, message: `Only ${product.stock} items in stock.` };
        }
        existingItem.quantity = newQty;
      } else {
        if (quantity > product.stock) {
          return { success: false, message: `Only ${product.stock} items in stock.` };
        }
        cart.push({
          productId: Number(productId),
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          brand: product.brand,
          variant: variant,
          quantity: quantity,
          stock: product.stock
        });
      }

      this.saveCart(cart);
      return { success: true, message: `Added ${product.name} to cart!` };
    },

    updateCartQty(productId, quantity, variant = null) {
      const cart = this.getCart();
      const item = cart.find(i => i.productId === Number(productId) && i.variant === variant);
      if (item) {
        const product = this.getProductById(productId);
        const maxStock = product ? product.stock : 99;
        if (quantity <= 0) {
          return this.removeFromCart(productId, variant);
        }
        item.quantity = Math.min(quantity, maxStock);
        this.saveCart(cart);
      }
      return cart;
    },

    removeFromCart(productId, variant = null) {
      let cart = this.getCart();
      cart = cart.filter(i => !(i.productId === Number(productId) && i.variant === variant));
      this.saveCart(cart);
      return cart;
    },

    clearCart() {
      this.saveCart([]);
    },

    getCartCount() {
      const cart = this.getCart();
      return cart.reduce((sum, item) => sum + item.quantity, 0);
    },

    // WISHLIST
    getWishlist() {
      return getJSON(STORAGE_KEYS.WISHLIST, []);
    },

    saveWishlist(list) {
      setJSON(STORAGE_KEYS.WISHLIST, list);
      window.dispatchEvent(new CustomEvent('chorbajar:wishlist-updated', { detail: list }));
    },

    isInWishlist(productId) {
      const list = this.getWishlist();
      return list.includes(Number(productId));
    },

    toggleWishlist(productId) {
      let list = this.getWishlist();
      const id = Number(productId);
      const exists = list.includes(id);
      if (exists) {
        list = list.filter(item => item !== id);
      } else {
        list.push(id);
      }
      this.saveWishlist(list);
      return !exists; // returns true if added, false if removed
    },

    // USERS & AUTH
    getUsers() {
      return getJSON(STORAGE_KEYS.USERS, window.CHORBAJAR_DEFAULT_USERS || []);
    },

    getCurrentUser() {
      // Check session storage first, then local storage
      let user = null;
      try {
        const sUser = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (sUser) return JSON.parse(sUser);
        const lUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (lUser) return JSON.parse(lUser);
      } catch (e) {
        console.error(e);
      }
      return null;
    },

    setCurrentUser(user, remember = true) {
      if (!user) {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      } else {
        if (remember) {
          setJSON(STORAGE_KEYS.CURRENT_USER, user);
        } else {
          sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        }
      }
      window.dispatchEvent(new CustomEvent('chorbajar:auth-updated', { detail: user }));
    },

    login(email, password, remember = true) {
      const users = this.getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!user) {
        return { success: false, message: 'No account found with this email address.' };
      }
      if (user.password !== password) {
        return { success: false, message: 'Invalid password. Please check and try again.' };
      }
      if (user.status === 'Blocked') {
        return { success: false, message: 'Your account has been deactivated. Please contact support.' };
      }
      this.setCurrentUser(user, remember);
      return { success: true, user: user };
    },

    register(name, email, phone, password) {
      const users = this.getUsers();
      const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (existing) {
        return { success: false, message: 'An account with this email already exists.' };
      }
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      const newUser = {
        id: newId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password: password,
        role: 'customer',
        avatar: 'assets/harshit.png',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'Active'
      };
      users.push(newUser);
      setJSON(STORAGE_KEYS.USERS, users);
      this.setCurrentUser(newUser, true);
      return { success: true, user: newUser };
    },

    updateUserProfile(updates) {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return null;
      const users = this.getUsers();
      const idx = users.findIndex(u => u.id === currentUser.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        setJSON(STORAGE_KEYS.USERS, users);
        this.setCurrentUser(users[idx], true);
        return users[idx];
      }
      return null;
    },

    logout() {
      this.setCurrentUser(null);
    },

    // ADDRESSES
    getAddresses(userId) {
      const all = getJSON(STORAGE_KEYS.ADDRESSES, window.CHORBAJAR_DEFAULT_ADDRESSES || []);
      if (!userId) return all;
      return all.filter(a => a.userId === Number(userId));
    },

    saveAddress(address) {
      const addresses = getJSON(STORAGE_KEYS.ADDRESSES, window.CHORBAJAR_DEFAULT_ADDRESSES || []);
      if (address.id) {
        const index = addresses.findIndex(a => a.id === address.id);
        if (index !== -1) {
          addresses[index] = { ...addresses[index], ...address };
        }
      } else {
        const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 101;
        const newAddr = { ...address, id: newId };
        if (newAddr.isDefault) {
          addresses.forEach(a => { if (a.userId === newAddr.userId) a.isDefault = false; });
        }
        addresses.push(newAddr);
      }
      setJSON(STORAGE_KEYS.ADDRESSES, addresses);
      return addresses;
    },

    deleteAddress(addressId) {
      let addresses = getJSON(STORAGE_KEYS.ADDRESSES, []);
      addresses = addresses.filter(a => a.id !== Number(addressId));
      setJSON(STORAGE_KEYS.ADDRESSES, addresses);
      return addresses;
    },

    setDefaultAddress(addressId, userId) {
      const addresses = getJSON(STORAGE_KEYS.ADDRESSES, []);
      addresses.forEach(a => {
        if (a.userId === Number(userId)) {
          a.isDefault = a.id === Number(addressId);
        }
      });
      setJSON(STORAGE_KEYS.ADDRESSES, addresses);
      return addresses;
    },

    // ORDERS
    getOrders(userId = null) {
      const all = getJSON(STORAGE_KEYS.ORDERS, window.CHORBAJAR_DEFAULT_ORDERS || []);
      if (!userId) return all;
      return all.filter(o => o.userId === Number(userId));
    },

    getOrderById(orderId) {
      const orders = this.getOrders();
      return orders.find(o => String(o.id).toUpperCase() === String(orderId).toUpperCase()) || null;
    },

    createOrder(orderData) {
      const orders = getJSON(STORAGE_KEYS.ORDERS, []);
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const newOrder = {
        id: `CHOR-${randomNum}`,
        orderDate: new Date().toISOString(),
        timeline: [
          { status: 'Order Placed', time: new Date().toLocaleString(), done: true },
          { status: 'Confirmed', time: 'Pending', done: false },
          { status: 'Shipped', time: 'Pending', done: false },
          { status: 'Out for Delivery', time: 'Pending', done: false },
          { status: 'Delivered', time: 'Pending', done: false }
        ],
        status: 'Order Placed',
        ...orderData
      };
      orders.unshift(newOrder);
      setJSON(STORAGE_KEYS.ORDERS, orders);

      // Decrement stock in products
      if (Array.isArray(orderData.items)) {
        orderData.items.forEach(item => {
          const product = this.getProductById(item.productId);
          if (product) {
            const newStock = Math.max(0, product.stock - item.quantity);
            this.updateProduct(item.productId, { stock: newStock });
          }
        });
      }

      this.clearCart();
      return newOrder;
    },

    updateOrderStatus(orderId, newStatus) {
      const orders = getJSON(STORAGE_KEYS.ORDERS, []);
      const order = orders.find(o => o.id === orderId);
      if (order) {
        order.status = newStatus;
        if (order.timeline) {
          const statuses = ['Order Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
          const currentIndex = statuses.indexOf(newStatus);
          if (currentIndex !== -1) {
            order.timeline.forEach((step, idx) => {
              if (idx <= currentIndex) {
                step.done = true;
                if (step.time === 'Pending') {
                  step.time = new Date().toLocaleString();
                }
              }
            });
          }
        }
        setJSON(STORAGE_KEYS.ORDERS, orders);
      }
      return order;
    },

    // COUPONS
    getCoupons() {
      return getJSON(STORAGE_KEYS.COUPONS, window.CHORBAJAR_DEFAULT_COUPONS || []);
    },

    validateCoupon(code, subtotal) {
      const coupons = this.getCoupons();
      const coupon = coupons.find(c => c.code.toUpperCase() === (code || '').trim().toUpperCase());
      if (!coupon) {
        return { valid: false, message: 'Invalid coupon code.' };
      }
      if (subtotal < coupon.minPurchase) {
        return {
          valid: false,
          message: `Minimum purchase of ₹${coupon.minPurchase} required for coupon ${coupon.code}.`
        };
      }
      let discountAmount = 0;
      if (coupon.discountType === 'percentage') {
        discountAmount = Math.round((subtotal * coupon.value) / 100);
      } else {
        discountAmount = coupon.value;
      }
      return {
        valid: true,
        coupon: coupon,
        discountAmount: Math.min(discountAmount, subtotal),
        message: `Coupon ${coupon.code} applied successfully!`
      };
    },

    // SETTINGS
    getSettings() {
      return getJSON(STORAGE_KEYS.SETTINGS, {
        storeName: 'Chorbajar',
        shippingFee: 49,
        freeShippingThreshold: 500,
        taxPercent: 5,
        currency: '₹'
      });
    },

    saveSettings(newSettings) {
      setJSON(STORAGE_KEYS.SETTINGS, newSettings);
    }
  };

  // Auto-init on script load
  Storage.init();

  window.ChorbajarStorage = Storage;
})(window);
