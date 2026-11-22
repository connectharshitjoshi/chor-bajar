# Chorbajar – Frontend-Only E-Commerce Testing Platform

**Chorbajar** is a modern, responsive, frontend-only e-commerce application developed specifically to serve as an authentic practice environment for:
- Manual QA & Functional Testing
- Playwright End-to-End Test Automation
- Cross-Browser & Multi-Device Testing
- CI/CD Automated Test Pipeline Execution

Built with **pure HTML5, CSS3, and Vanilla JavaScript (ES6+)**, Chorbajar operates without external server dependencies or build tooling. Every page and action can be run directly from disk or via any lightweight static web server.

---

## 1. Quick Start & Execution

### Option A: Direct Browser Execution (Zero Dependencies)
Simply double-click or open `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari):
```bash
# Windows
start index.html
```

### Option B: Local Static Server (Recommended for Playwright CI)
```bash
# Using npx serve (Port 3000)
npm start

# Or using Python's built-in HTTP server
python -m http.server 3000
```
Then visit: `http://localhost:3000/index.html`

---

## 2. Product Dataset & Category Architecture

The application is powered by the **`assets/ecommerce-products/`** local dataset containing **180 real products with 180 authentic 800×800 JPG images**:

| Category | Item Count | Image Folder |
| :--- | :--- | :--- |
| **Electronics** | 15 products | `assets/ecommerce-products/electronics/` |
| **Mobile Phones** | 15 products | `assets/ecommerce-products/mobile-phones/` |
| **Laptops & Computers** | 15 products | `assets/ecommerce-products/laptops-computers/` |
| **Clothing** | 15 products | `assets/ecommerce-products/clothing/` |
| **Shoes & Footwear** | 15 products | `assets/ecommerce-products/shoes/` |
| **Watches** | 15 products | `assets/ecommerce-products/watches/` |
| **Home & Kitchen** | 15 products | `assets/ecommerce-products/home-kitchen/` |
| **Furniture** | 15 products | `assets/ecommerce-products/furniture/` |
| **Beauty & Personal Care** | 15 products | `assets/ecommerce-products/beauty-personal-care/` |
| **Sports & Fitness** | 15 products | `assets/ecommerce-products/sports-fitness/` |
| **Bags & Accessories** | 15 products | `assets/ecommerce-products/bags-accessories/` |
| **Books & Stationery** | 15 products | `assets/ecommerce-products/books-stationery/` |

---

## 3. Application Pages & Structured Folder Map

```text
chorbajar/
├── index.html                      # Storefront Homepage
├── assets/harshit.png                     # Default User & Admin Avatar
├── package.json                    # Project metadata & start scripts
├── README.md                       # Documentation
├── css/
│   └── styles.css                  # Master stylesheet
├── js/
│   ├── app.js                      # Core UI, dynamic path resolution & helpers
│   ├── storage.js                  # Centralized localStorage manager
│   └── products-data.js            # Initial dataset (180 products, coupons, users)
├── assets/ecommerce-products/             # 180 authentic 800×800 JPG images (12 categories)
├── admin/                          # Admin Management Portal
│   ├── dashboard.html              # Analytics & summary KPI metrics
│   ├── products.html               # Product catalog management
│   ├── product-add.html            # Add / Edit product form
│   ├── orders.html                 # Order fulfillment & status updates
│   ├── users.html                  # User directory & account status
│   └── settings.html               # Store rules & factory reset
├── account/                        # Customer Account Pages (Harshit Joshi)
│   ├── profile.html                # Personal information & avatar upload
│   ├── orders.html                 # Order history & status filters
│   ├── order-details.html          # Order tracking timeline & print invoice
│   ├── addresses.html              # Address book with Indian PIN code validation
│   └── settings.html               # Password changes & notifications
├── auth/                           # Authentication & Verification
│   ├── login.html                  # Sign in with quick demo fill buttons
│   ├── register.html               # New account registration
│   ├── forgot-password.html        # Password reset initiation
│   ├── verify-otp.html             # 6-digit OTP with 60s countdown timer
│   ├── verify-email.html           # Email verification status simulation
│   └── reset-password.html         # New password with live strength meter
├── shop/                           # Storefront & Checkout Flow
│   ├── products.html               # Catalog with multi-facet filters & pagination
│   ├── product-details.html        # Product gallery, variants, and reviews
│   ├── category.html               # Category specific listing & filters
│   ├── search.html                 # Search results & keyword matching
│   ├── wishlist.html               # Saved wishlist items
│   ├── cart.html                   # Cart & promo coupon engine
│   ├── checkout.html               # 3-step shipping & payment checkout
│   └── order-success.html          # Order confirmation & receipt
└── legal/                          # Information & Policy Pages
    ├── privacy.html                # QA testing data isolation & privacy notice
    └── terms.html                  # Terms of service
```

### A. Customer-Facing Storefront (`shop/`)
1. **Home Page (`index.html`)**: Hero deals carousel, category cards, featured picks, promotional guarantee strip, trending items, and newsletter subscription form.
2. **Product Catalog (`shop/products.html`)**: Multi-facet filter sidebar (categories, brands, price range, ratings, in-stock toggle), sorting, and pagination.
3. **Product Details (`shop/product-details.html?id=...`)**: Image gallery with interactive thumbnails, stock indicators, size/color variant selection, quantity increment/decrement, specs table, and customer review submission.
4. **Search Results (`shop/search.html?q=...`)**: Full-text search across titles, brands, and categories with no-results fallback and popular search suggestions.
5. **Category Showcase (`shop/category.html?name=...`)**: Category banners, category-specific brand filters, and filtered catalog items.
6. **Wishlist (`shop/wishlist.html`)**: Saved favorites, item removal, and instant "Move to Cart" workflow.
7. **Shopping Cart (`shop/cart.html`)**: Real-time quantity steppers bounded by stock limits, coupon discount engine, dynamic free shipping calculation, and line item removal.
8. **Checkout (`shop/checkout.html`)**: 3-step checkout flow (Contact details, shipping address with Indian PIN code validation, payment method selector, and duplicate submission prevention).
9. **Order Success (`shop/order-success.html?orderId=...`)**: Order confirmation, unique demo Order ID, shipping destination, cost breakdown, and printable invoice layout.

### B. Authentication & Verification Flows (`auth/`)
10. **Login (`auth/login.html`)**: Email & password authentication with show/hide password toggle, remember me, quick-fill demo login buttons, and form validation.
11. **Registration (`auth/register.html`)**: Full name, email, 10-digit Indian mobile validation, password confirmation, duplicate email detection, and terms acceptance.
12. **Forgot Password (`auth/forgot-password.html`)**: Email validation and simulated password reset link generation.
13. **OTP Verification (`auth/verify-otp.html`)**: 6-digit OTP code verification, 60-second live countdown timer, and simulated resend functionality.
14. **Email Verification (`auth/verify-email.html`)**: Email verification status badge with simulated verification link.
15. **Reset Password (`auth/reset-password.html`)**: New password creation with real-time strength meter (Weak / Medium / Strong) and password confirmation matching.

### C. Customer Account Portal (`account/`)
16. **My Profile (`account/profile.html`)**: View & update personal information, phone number, and simulated avatar photo reader.
17. **Order History (`account/orders.html`)**: List of customer orders with status filter pills and live ID search.
18. **Order Details & Tracking (`account/order-details.html?id=...`)**: Visual order tracking timeline (*Order Placed &rarr; Confirmed &rarr; Shipped &rarr; Out for Delivery &rarr; Delivered*), itemized receipt, order cancellation, and invoice printout.
19. **Address Book (`account/addresses.html`)**: Add, edit, delete, and set default shipping addresses with Indian postal PIN code validation.
20. **Account Settings (`account/settings.html`)**: Change password form, notification toggles (SMS, Promotional, WhatsApp), and simulated account deactivation.

### D. Admin Management Portal (`admin/`)
21. **Admin Analytics Dashboard (`admin/dashboard.html`)**: KPI stat counters (Active Products, Orders, Simulated Revenue, Registered Users), category inventory breakdown, and recent orders feed.
22. **Product Catalog Manager (`admin/products.html`)**: Comprehensive product table with search, category filter, in-stock badges, pagination, edit links, and deletion dialogs.
23. **Add / Edit Product (`admin/product-add.html`)**: Full product CRUD form with live image preview and validation.
24. **Order Fulfillment (`admin/orders.html`)**: Order status management with instant dropdown status updates (*Placed &rarr; Confirmed &rarr; Shipped &rarr; Delivered &rarr; Cancelled*).
25. **Customer Directory (`admin/users.html`)**: Registered user accounts table with search and simulated account block/activate actions.
26. **Store Settings (`admin/settings.html`)**: Configure store name, contact info, shipping fees, free delivery threshold, and full factory demo reset.

### E. Legal & Policies (`legal/`)
27. **Privacy Policy (`legal/privacy.html`)**: Local storage isolation and QA test environment notice.
28. **Terms of Service (`legal/terms.html`)**: Platform usage disclaimer.

---

## 4. Predefined Demo Credentials & Test Data

### User Accounts
| Role | Email | Password | Pre-populated Data |
| :--- | :--- | :--- | :--- |
| **Customer** | `user@test.com` | `Test@123` | Name: Harshit Joshi, Orders: 2, Addresses: 2 |
| **Admin** | `admin@test.com` | `Admin@123` | Full access to Admin Dashboard and Management tools |

### Predefined Promo Coupons
| Coupon Code | Discount Rule | Conditions |
| :--- | :--- | :--- |
| `WELCOME10` | 10% percentage discount | Valid on all carts &gt; ₹499 |
| `SAVE200` | Flat ₹200 discount | Minimum cart value of ₹999 |
| `CHOR500` | Flat ₹500 discount | Minimum cart value of ₹2,499 |
| `INVALID` | Rejection scenario | Displays validation error message for negative QA tests |

### OTP Verification
- Valid Demo OTP: **`123456`**

---

## 5. Playwright & Test Automation Selectors

Over **420+ stable `data-testid` attributes** are embedded throughout the DOM.

Key examples:
- `data-testid="navbar-logo"` – Homepage link
- `data-testid="navbar-search-input"` – Global search bar
- `data-testid="navbar-search-btn"` – Search submit button
- `data-testid="cart-count"` – Cart item counter badge
- `data-testid="wishlist-count"` – Wishlist item counter badge
- `data-testid="demo-reset-btn"` – Factory Reset button (located in the top notice bar)
- `data-testid="product-card"` – Product card item container
- `data-testid="add-to-cart"` – Catalog / Details add to cart button
- `data-testid="add-to-wishlist"` – Heart icon toggle button
- `data-testid="coupon-input"` – Cart coupon code text field
- `data-testid="apply-coupon-btn"` – Apply coupon button
- `data-testid="cart-total"` – Grand total display in cart
- `data-testid="proceed-to-checkout"` – Proceed to checkout button
- `data-testid="checkout-phone"` – 10-digit phone field with Indian format validation
- `data-testid="checkout-pincode"` – 6-digit Indian PIN code validation field
- `data-testid="place-order-btn"` – Place order submit button
- `data-testid="order-id"` – Confirmation order identifier
- `data-testid="login-email"` & `data-testid="login-password"` – Sign in inputs
- `data-testid="admin-dashboard"` – Admin panel container

### Example Playwright Test Snippet
```javascript
const { test, expect } = require('@playwright/test');

test('Customer can search product, add to cart, and apply coupon', async ({ page }) => {
  await page.goto('http://localhost:3000/index.html');
  
  // Search for headphones
  await page.fill('[data-testid="navbar-search-input"]', 'Headphones');
  await page.click('[data-testid="navbar-search-btn"]');
  
  // Click first product card
  await page.locator('[data-testid="product-card"]').first().click();
  
  // Add to cart from details
  await page.click('[data-testid="add-to-cart-detail"]');
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
  
  // Navigate to Cart
  await page.click('[data-testid="navbar-cart-btn"]');
  
  // Apply coupon
  await page.fill('[data-testid="coupon-input"]', 'WELCOME10');
  await page.click('[data-testid="apply-coupon-btn"]');
  
  // Verify coupon applied successfully
  await expect(page.locator('[data-testid="coupon-message"]')).toContainText('applied successfully');
});
```

---

## 6. Factory Data Reset Functionality

To ensure isolation between automated test runs, a **"Reset Demo Data"** action is available at:
1. The persistent top notice bar on every page (`data-testid="demo-reset-btn"`).
2. The footer quick links.
3. The Admin Settings page (`data-testid="admin-reset-store-btn"`).
4. Programmatically via browser console or Playwright test evaluate:
```javascript
window.ChorbajarStorage.resetToDefaults();
location.reload();
```

---

## 7. Explicit Technical Limitations (Frontend Demonstration Only)

This application is purposefully designed **without a backend server, database, or payment gateway integration**:
- **Simulated Authentication**: Passwords and session states are evaluated locally within browser storage. This setup is intended for functional QA testing and must never be represented as production security.
- **Simulated Transactions**: Payments and checkout actions decrement local mock stock and generate local order receipts. No banking APIs are called.
- **Browser Scope**: Data mutations persist across refreshes within the same browser origin via `localStorage`.

---

© 2026 Chorbajar. Crafted for Quality Assurance & Test Automation Engineers.
