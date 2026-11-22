/**
 * Chorbajar - Main Application Core (Vanilla JS)
 * Handles global navbar, footer, toasts, modals, search, and QA test helpers
 */

(function (window) {
  'use strict';

  // SVG Icon definitions for vanilla rendering
  const ICONS = {
    search: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    heart: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>',
    heartFilled: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>',
    shoppingBag: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>',
    user: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    star: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
    package: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"></path><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>',
    trash: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>'
  };

  const App = {
    icons: ICONS,

    // Dynamically calculate base path relative to current HTML location
    getBasePath() {
      const path = (window.location.pathname || '').replace(/\\/g, '/');
      const subdirs = ['/admin/', '/account/', '/auth/', '/shop/', '/legal/'];
      for (const dir of subdirs) {
        if (path.includes(dir)) {
          return '../';
        }
      }
      return './';
    },

    init() {
      this.basePath = this.getBasePath();
      this.ensureToastContainer();
      this.renderHeader();
      this.renderFooter();
      this.setupGlobalEvents();
      this.updateCounters();

      // Listen to storage events to update counters
      window.addEventListener('chorbajar:cart-updated', () => this.updateCounters());
      window.addEventListener('chorbajar:wishlist-updated', () => this.updateCounters());
      window.addEventListener('chorbajar:auth-updated', () => {
        this.renderHeader();
        this.updateCounters();
      });
    },

    // Format currency to INR format
    formatPrice(amount) {
      const num = Number(amount) || 0;
      return '₹ ' + num.toLocaleString('en-IN');
    },

    // Extract query parameter from current URL
    getUrlParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    },

    // Set URL parameter without page reload
    setUrlParam(key, value) {
      const url = new URL(window.location);
      if (value !== null && value !== undefined && value !== '') {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
      window.history.pushState({}, '', url);
    },

    // Toast Container
    ensureToastContainer() {
      if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.setAttribute('data-testid', 'toast-container');
        document.body.appendChild(container);
      }
    },

    showToast(message, type = 'info', duration = 3200) {
      this.ensureToastContainer();
      const container = document.getElementById('toast-container');

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.setAttribute('data-testid', `toast-${type}`);
      toast.innerHTML = `
        <div class="toast-content">${message}</div>
        <button class="toast-close-btn" data-testid="toast-close">&times;</button>
      `;

      toast.querySelector('.toast-close-btn').addEventListener('click', () => {
        toast.remove();
      });

      container.appendChild(toast);

      setTimeout(() => {
        if (toast.parentNode) {
          toast.style.opacity = '0';
          setTimeout(() => toast.remove(), 250);
        }
      }, duration);
    },

    // Modal Confirmation Dialog
    showConfirmModal(title, message, onConfirm) {
      let modalOverlay = document.getElementById('global-confirm-modal');
      if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'global-confirm-modal';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
          <div class="modal-dialog">
            <div class="modal-header">
              <h3 class="modal-title" id="modal-title-text">${title}</h3>
              <button class="btn-sm" id="modal-close-x" style="font-size: 1.25rem;">&times;</button>
            </div>
            <div class="modal-body" id="modal-body-text">${message}</div>
            <div class="modal-footer">
              <button class="btn btn-secondary btn-sm" id="modal-cancel-btn" data-testid="modal-cancel-btn">Cancel</button>
              <button class="btn btn-danger btn-sm" id="modal-confirm-btn" data-testid="modal-confirm-btn">Confirm</button>
            </div>
          </div>
        `;
        document.body.appendChild(modalOverlay);
      }

      document.getElementById('modal-title-text').textContent = title;
      document.getElementById('modal-body-text').innerHTML = message;
      modalOverlay.classList.add('show');

      const close = () => {
        modalOverlay.classList.remove('show');
      };

      document.getElementById('modal-close-x').onclick = close;
      document.getElementById('modal-cancel-btn').onclick = close;

      const confirmBtn = document.getElementById('modal-confirm-btn');
      confirmBtn.onclick = () => {
        close();
        if (typeof onConfirm === 'function') onConfirm();
      };
    },

    // Render Navigation & Header
    renderHeader() {
      const headerElem = document.getElementById('site-header-container');
      if (!headerElem) return;

      const base = this.getBasePath();
      const currentUser = window.ChorbajarStorage.getCurrentUser();
      const isAdmin = currentUser && currentUser.role === 'admin';
      const categories = window.CHORBAJAR_CATEGORIES || [];

      headerElem.innerHTML = `
        <!-- Top Notice Bar for QA Automation & Testing -->
        <div class="qa-banner">
          <div class="qa-banner-left">
            <span class="qa-creds-hint">Customer: <strong>user@test.com / Test@123</strong> | Admin: <strong>admin@test.com / Admin@123</strong></span>
          </div>
          <div class="qa-banner-right">
            <button class="qa-btn-reset" id="btn-qa-reset-demo" data-testid="demo-reset-btn">Reset Demo Data</button>
          </div>
        </div>

        <!-- Main Header -->
        <header class="site-header">
          <div class="container navbar-main">
            <!-- Brand Logo -->
            <a href="${base}index.html" class="brand-logo" data-testid="navbar-logo">
              ${ICONS.package}
              <span>Chorbajar<span class="dot">.</span></span>
            </a>

            <!-- Search Form -->
            <div class="search-container">
              <form class="search-form" id="navbar-search-form" action="${base}shop/search.html" method="GET">
                <input 
                  type="text" 
                  name="q" 
                  class="search-input" 
                  placeholder="Search 180+ authentic products, brands, categories..." 
                  data-testid="navbar-search-input"
                  id="navbar-search-input"
                  value="${this.getUrlParam('q') || ''}"
                  autocomplete="off"
                />
                <button type="submit" class="search-btn" data-testid="navbar-search-btn">
                  ${ICONS.search}
                </button>
              </form>
            </div>

            <!-- Navbar Actions -->
            <div class="navbar-actions">
              <!-- Wishlist -->
              <a href="${base}shop/wishlist.html" class="nav-icon-link" data-testid="navbar-wishlist-btn" title="Wishlist">
                ${ICONS.heart}
                <span class="badge-count" id="wishlist-badge" data-testid="wishlist-count">0</span>
                <span>Wishlist</span>
              </a>

              <!-- Cart -->
              <a href="${base}shop/cart.html" class="nav-icon-link" data-testid="navbar-cart-btn" title="Shopping Cart">
                ${ICONS.shoppingBag}
                <span class="badge-count" id="cart-badge" data-testid="cart-count">0</span>
                <span>Cart</span>
              </a>

              <!-- User Account / Login -->
              ${currentUser ? `
                <div class="account-menu">
                  <button class="account-btn" id="navbar-account-toggle" data-testid="navbar-user-btn">
                    <img src="${base}${currentUser.avatar || 'assets/harshit.png'}" alt="${currentUser.name}">
                    <span>${currentUser.name.split(' ')[0]}</span>
                    <span style="font-size: 0.7rem;">▼</span>
                  </button>
                  <div class="dropdown-menu" id="account-dropdown-menu">
                    <div class="dropdown-header">
                      <div class="user-name">${currentUser.name}</div>
                      <div class="user-role">${currentUser.role === 'admin' ? 'Administrator' : 'Verified Customer'}</div>
                    </div>
                    ${isAdmin ? `
                      <a href="${base}admin/dashboard.html" class="dropdown-item" data-testid="nav-admin-dashboard">Admin Dashboard</a>
                      <a href="${base}admin/products.html" class="dropdown-item" data-testid="nav-admin-products">Manage Products</a>
                      <a href="${base}admin/orders.html" class="dropdown-item" data-testid="nav-admin-orders">Manage Orders</a>
                      <a href="${base}admin/users.html" class="dropdown-item" data-testid="nav-admin-users">Manage Users</a>
                      <a href="${base}admin/settings.html" class="dropdown-item" data-testid="nav-admin-settings">Admin Settings</a>
                      <div class="dropdown-divider"></div>
                    ` : `
                      <a href="${base}account/profile.html" class="dropdown-item" data-testid="nav-account-profile">My Profile</a>
                      <a href="${base}account/orders.html" class="dropdown-item" data-testid="nav-account-orders">My Orders</a>
                      <a href="${base}account/addresses.html" class="dropdown-item" data-testid="nav-account-addresses">Saved Addresses</a>
                      <a href="${base}account/settings.html" class="dropdown-item" data-testid="nav-account-settings">Account Settings</a>
                      <div class="dropdown-divider"></div>
                    `}
                    <button class="dropdown-item" id="nav-logout-btn" data-testid="navbar-logout-btn" style="color: var(--danger); width: 100%; text-align: left;">
                      Logout
                    </button>
                  </div>
                </div>
              ` : `
                <a href="${base}auth/login.html" class="btn btn-outline-primary btn-sm" data-testid="navbar-login-btn">
                  ${ICONS.user}
                  <span>Sign In</span>
                </a>
              `}
            </div>
          </div>

          <!-- Category Navigation Strip -->
          <div class="category-nav-bar">
            <div class="container cat-strip-inner">
              <a href="${base}shop/products.html" class="cat-link all-deals" data-testid="cat-link-all">🔥 All Products</a>
              ${categories.map(cat => `
                <a href="${base}shop/category.html?name=${encodeURIComponent(cat.slug)}" class="cat-link" data-testid="cat-link-${cat.slug}">
                  ${cat.name}
                </a>
              `).join('')}
            </div>
          </div>
        </header>
      `;

      // Attach reset button
      document.getElementById('btn-qa-reset-demo').onclick = () => {
        this.showConfirmModal(
          'Reset Demo Data?',
          'This will restore all 180 products, coupons, default customer Harshit Joshi, admin account, initial orders and addresses back to factory mock settings.',
          () => {
            window.ChorbajarStorage.resetToDefaults();
            this.showToast('Demo data reset to factory defaults successfully!', 'success');
            setTimeout(() => window.location.reload(), 600);
          }
        );
      };

      // Toggle dropdown menu
      const accountToggle = document.getElementById('navbar-account-toggle');
      const dropdownMenu = document.getElementById('account-dropdown-menu');
      if (accountToggle && dropdownMenu) {
        accountToggle.onclick = (e) => {
          e.stopPropagation();
          dropdownMenu.classList.toggle('show');
        };
        document.addEventListener('click', () => {
          dropdownMenu.classList.remove('show');
        });
      }

      // Logout handler
      const logoutBtn = document.getElementById('nav-logout-btn');
      if (logoutBtn) {
        logoutBtn.onclick = () => {
          window.ChorbajarStorage.logout();
          this.showToast('Logged out successfully.', 'info');
          setTimeout(() => {
            window.location.href = `${base}index.html`;
          }, 400);
        };
      }
    },

    // Render Global Footer
    renderFooter() {
      const footerElem = document.getElementById('site-footer-container');
      if (!footerElem) return;

      const base = this.getBasePath();

      footerElem.innerHTML = `
        <footer class="site-footer">
          <div class="container">
            <div class="footer-grid">
              <div class="footer-col">
                <a href="${base}index.html" class="brand-logo" style="color: #ffffff; margin-bottom: 1rem; display: inline-flex;">
                  ${ICONS.package}
                  <span>Chorbajar<span class="dot" style="color: var(--accent);">.</span></span>
                </a>
                <p style="font-size: 0.85rem; line-height: 1.6; margin-bottom: 1rem;">
                  Chorbajar is an authentic, modern e-commerce testing playground crafted specifically for Manual QA, Playwright automated testing, and Cross-Browser automation suites.
                </p>
              </div>

              <div class="footer-col">
                <h5>Categories</h5>
                <ul class="footer-links">
                  <li><a href="${base}shop/category.html?name=electronics">Electronics</a></li>
                  <li><a href="${base}shop/category.html?name=mobile-phones">Mobile Phones</a></li>
                  <li><a href="${base}shop/category.html?name=laptops-computers">Laptops & Computers</a></li>
                  <li><a href="${base}shop/category.html?name=clothing">Fashion & Clothing</a></li>
                  <li><a href="${base}shop/category.html?name=shoes">Shoes & Footwear</a></li>
                  <li><a href="${base}shop/category.html?name=watches">Watches</a></li>
                </ul>
              </div>

              <div class="footer-col">
                <h5>Quick Links</h5>
                <ul class="footer-links">
                  <li><a href="${base}shop/products.html">All Products</a></li>
                  <li><a href="${base}shop/wishlist.html">My Wishlist</a></li>
                  <li><a href="${base}shop/cart.html">Shopping Cart</a></li>
                  <li><a href="${base}auth/login.html">Sign In / Register</a></li>
                  <li><a href="${base}account/orders.html">Track Order</a></li>
                  <li><a href="${base}admin/dashboard.html">Admin Portal</a></li>
                </ul>
              </div>

              <div class="footer-col">
                <h5>Playwright Automation Ready</h5>
                <p style="font-size: 0.85rem; margin-bottom: 12px;">
                  Every single interactive input, button, table row, card, and state is mapped to clean and unique <code>data-testid</code> selectors.
                </p>
                <div style="font-size: 0.8rem; color: #cbd5e1;">
                  <strong>Available Coupons:</strong><br>
                  • <code>WELCOME10</code> (10% off)<br>
                  • <code>SAVE200</code> (₹200 off &gt; ₹999)<br>
                  • <code>INVALID</code> (Tests error handling)
                </div>
              </div>
            </div>

            <div class="footer-bottom">
              <div>&copy; 2026 Chorbajar Marketplace. Designed for Quality Assurance & Test Automation.</div>
              <div style="display: flex; gap: 1rem;">
                <a href="${base}legal/privacy.html" style="color: #94a3b8;">Privacy Policy</a>
                <a href="${base}legal/terms.html" style="color: #94a3b8;">Terms of Service</a>
                <a href="javascript:void(0)" onclick="window.ChorbajarStorage.resetToDefaults(); location.reload();" style="color: #38bdf8;">Reset App State</a>
              </div>
            </div>
          </div>
        </footer>
      `;
    },

    // Update Cart and Wishlist Count Badges
    updateCounters() {
      const cartBadge = document.getElementById('cart-badge');
      if (cartBadge) {
        const count = window.ChorbajarStorage.getCartCount();
        cartBadge.textContent = count;
        cartBadge.style.display = count > 0 ? 'flex' : 'none';
      }

      const wishlistBadge = document.getElementById('wishlist-badge');
      if (wishlistBadge) {
        const wishlist = window.ChorbajarStorage.getWishlist();
        wishlistBadge.textContent = wishlist.length;
        wishlistBadge.style.display = wishlist.length > 0 ? 'flex' : 'none';
      }
    },

    // Render Star Rating UI
    renderStars(rating) {
      const fullStars = Math.floor(rating);
      let starsHtml = '';
      for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
          starsHtml += ICONS.star;
        } else {
          starsHtml += `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#cbd5e1" stroke="#cbd5e1" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
        }
      }
      return `<div style="display: inline-flex; align-items: center; gap: 2px;">${starsHtml}</div>`;
    },

    // Render Product Card
    renderProductCard(product) {
      const base = this.getBasePath();
      const isWishlisted = window.ChorbajarStorage.isInWishlist(product.id);
      return `
        <div class="product-card" data-testid="product-card" data-product-id="${product.id}">
          <div class="product-card-img-wrap">
            <span class="product-badge-discount">-${product.discount}%</span>
            <button 
              class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" 
              data-testid="add-to-wishlist"
              data-id="${product.id}"
              title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
              onclick="window.ChorbajarApp.handleToggleWishlist(${product.id}, this, event)"
            >
              ${isWishlisted ? ICONS.heartFilled : ICONS.heart}
            </button>
            <a href="${base}shop/product-details.html?id=${product.id}">
              <img src="${base}${product.image}" alt="${product.name}" loading="lazy" />
            </a>
          </div>

          <div class="product-card-body">
            <div class="product-card-brand">${product.brand}</div>
            <h3 class="product-card-title">
              <a href="${base}shop/product-details.html?id=${product.id}" title="${product.name}">${product.name}</a>
            </h3>

            <div class="product-card-rating">
              <span class="rating-pill">★ ${product.rating}</span>
              <span class="rating-reviews-count">(${product.reviewsCount})</span>
            </div>

            <div class="product-card-pricing">
              <span class="price-current">${this.formatPrice(product.price)}</span>
              <span class="price-original">${this.formatPrice(product.originalPrice)}</span>
            </div>

            <div class="product-card-action">
              ${product.stock > 0 ? `
                <button 
                  class="btn-add-cart" 
                  data-testid="add-to-cart"
                  onclick="window.ChorbajarApp.handleAddToCart(${product.id}, event)"
                >
                  ${ICONS.shoppingBag} Add to Cart
                </button>
              ` : `
                <button class="btn-add-cart out-of-stock" disabled data-testid="out-of-stock-btn">
                  Out of Stock
                </button>
              `}
            </div>
          </div>
        </div>
      `;
    },

    handleAddToCart(productId, event) {
      if (event) event.preventDefault();
      const res = window.ChorbajarStorage.addToCart(productId, 1);
      if (res.success) {
        this.showToast(res.message, 'success');
      } else {
        this.showToast(res.message, 'warning');
      }
    },

    handleToggleWishlist(productId, btnElem, event) {
      if (event) event.preventDefault();
      const added = window.ChorbajarStorage.toggleWishlist(productId);
      if (btnElem) {
        btnElem.classList.toggle('active', added);
        btnElem.innerHTML = added ? ICONS.heartFilled : ICONS.heart;
        btnElem.title = added ? 'Remove from Wishlist' : 'Add to Wishlist';
      }
      this.showToast(added ? 'Added to your Wishlist!' : 'Removed from Wishlist.', added ? 'success' : 'info');
    },

    // Route guards
    requireAuth(allowedRole = null) {
      const base = this.getBasePath();
      const user = window.ChorbajarStorage.getCurrentUser();
      if (!user) {
        this.showToast('Please sign in to access this page.', 'warning');
        window.location.href = `${base}auth/login.html?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        return false;
      }
      if (allowedRole && user.role !== allowedRole) {
        this.showToast('Unauthorized access. Admin role required.', 'danger');
        window.location.href = `${base}index.html`;
        return false;
      }
      return true;
    },

    setupGlobalEvents() {
      // Global keybindings or helpers
    }
  };

  // Run on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });

  window.ChorbajarApp = App;
})(window);
