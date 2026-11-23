const { test, expect } = require('@playwright/test');

test.describe('Chorbajar E-Commerce Core Test Suite', () => {

  test('TC1: Homepage loads successfully with branding and search bar', async ({ page }) => {
    await page.goto('index.html');
    await expect(page).toHaveTitle(/Chorbajar/i);

    const logo = page.locator('[data-testid="navbar-logo"]');
    await expect(logo).toBeVisible();
    await expect(logo).toContainText('Chorbajar');

    const searchInput = page.locator('[data-testid="navbar-search-input"]');
    await expect(searchInput).toBeVisible();
  });

  test('TC2: Featured products render with valid image sources and details', async ({ page }) => {
    await page.goto('index.html');

    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();

    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);

    // Verify first product image src has assets path
    const firstImg = productCards.first().locator('img');
    await expect(firstImg).toBeVisible();
    const imgSrc = await firstImg.getAttribute('src');
    expect(imgSrc).toContain('assets/ecommerce-products/');

    // Verify price is formatted in INR
    const price = productCards.first().locator('.price-current');
    await expect(price).toBeVisible();
    await expect(price).toContainText('₹');
  });

  test('TC3: Category showcase navigation displays filtered category products', async ({ page }) => {
    await page.goto('shop/category.html?name=electronics');

    const title = page.locator('#category-title');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('Electronics');

    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();

    const breadcrumbs = page.locator('[data-testid="breadcrumbs"]');
    await expect(breadcrumbs).toContainText('Electronics');
  });

  test('TC4: Search function finds products matching query', async ({ page }) => {
    await page.goto('index.html');

    const searchInput = page.locator('[data-testid="navbar-search-input"]');
    await searchInput.fill('Headphones');
    await page.locator('[data-testid="navbar-search-btn"]').click();

    // Verify search page loads
    await expect(page).toHaveURL(/shop\/search\.html/);

    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();
    const firstTitle = await productCards.first().locator('.product-card-title').textContent();
    expect(firstTitle.toLowerCase()).toContain('headphones');
  });

  test('TC5: Product details page renders title, price, gallery, and stock status', async ({ page }) => {
    await page.goto('shop/product-details.html?id=1');

    await expect(page.locator('#product-title')).toBeVisible();
    await expect(page.locator('#product-price')).toContainText('₹');
    await expect(page.locator('#product-stock-badge')).toBeVisible();
    await expect(page.locator('#main-product-img')).toBeVisible();

    const mainImgSrc = await page.locator('#main-product-img').getAttribute('src');
    expect(mainImgSrc).toContain('assets/ecommerce-products/');

    const addToCartBtn = page.locator('#btn-add-cart-detail');
    await expect(addToCartBtn).toBeVisible();
  });

  test('TC6: Adding an item to cart increments cart counter and shows in cart page', async ({ page }) => {
    await page.goto('shop/product-details.html?id=1');

    // Click Add to Cart
    await page.locator('#btn-add-cart-detail').click();

    // Verify toast notification appears
    const toast = page.locator('[data-testid="toast-container"]');
    await expect(toast).toBeVisible();

    // Verify cart badge count is updated to at least 1
    const cartBadge = page.locator('#cart-badge');
    await expect(cartBadge).toBeVisible();
    const count = Number(await cartBadge.textContent());
    expect(count).toBeGreaterThanOrEqual(1);

    // Navigate to cart page and verify item exists
    await page.goto('shop/cart.html');
    const cartItems = page.locator('[data-testid^="cart-item-"]');
    await expect(cartItems.first()).toBeVisible();
  });

  test('TC7: Wishlist toggling adds item to wishlist and reflects in wishlist page', async ({ page }) => {
    await page.goto('index.html');

    // Toggle wishlist on first product
    const wishlistBtn = page.locator('[data-testid="add-to-wishlist"]').first();
    await wishlistBtn.click();

    // Verify wishlist badge is visible with count >= 1
    const wishlistBadge = page.locator('#wishlist-badge');
    await expect(wishlistBadge).toBeVisible();

    // Navigate to wishlist page
    await page.goto('shop/wishlist.html');
    const wishlistCard = page.locator('[data-testid^="wishlist-card-"]');
    await expect(wishlistCard.first()).toBeVisible();
  });

});
