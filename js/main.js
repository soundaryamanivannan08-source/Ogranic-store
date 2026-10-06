/**
 * Stackly - Single Centralized JavaScript Engine
 * Brand: Stackly | Tagline: Fresh From Nature. Good For You.
 * Strict Theme: Primary (#245C3A), Secondary (#FFFFFF), Accent (#E7A93B)
 */

document.addEventListener('DOMContentLoaded', () => {
  initLogoTransparency();
  initNavbar();
  initCart();
  initSearch();
  initQuickView();
  initWishlist();
  initFaqAccordion();
  initForms();
  initAuth();
  initCatalogFilters();
  initCounters();
  initDashboards();
  initFlashCountdown();
  initStorageTabs();
  initGsapAnimations();
});

/* ==========================================================================
   1. Navbar & Mobile Menu Drawer
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobileToggleBtn');
  const mobileClose = document.getElementById('mobileCloseBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');

  // Sticky header transformation on scroll
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile Drawer Toggle
  if (mobileToggle && mobileDrawer && drawerOverlay) {
    const openDrawer = () => {
      mobileDrawer.classList.add('open');
      drawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      mobileDrawer.classList.remove('open');
      drawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', openDrawer);
    if (mobileClose) mobileClose.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);

    // Close mobile menu when clicking any navigation link
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // Active Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   2. Global Shopping Cart System
   ========================================================================== */
let cartState = [
  { id: '1', name: 'Organic Hass Avocado', price: 4.99, image: 'assets/avocado.webp', qty: 2, category: 'Fruits' },
  { id: '2', name: 'Raw Wildflower Honey', price: 12.50, image: 'assets/honey-jar.webp', qty: 1, category: 'Honey' }
];

function initCart() {
  const cartBtn = document.getElementById('cartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const drawerOverlay = document.getElementById('drawerOverlay');

  if (cartBtn && cartDrawer) {
    const openCart = () => {
      cartDrawer.classList.add('open');
      if (drawerOverlay) drawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      renderCartItems();
    };

    const closeCart = () => {
      cartDrawer.classList.remove('open');
      if (drawerOverlay) drawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    cartBtn.addEventListener('click', (e) => {
      window.location.href = '404.html';
    });

    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if (drawerOverlay) {
      drawerOverlay.addEventListener('click', () => {
        if (cartDrawer.classList.contains('open')) closeCart();
      });
    }
  }

  // Add to cart buttons across all pages (excluding dashboards)
  document.addEventListener('click', (e) => {
    if (document.body.classList.contains('dashboard-body') || e.target.closest('.dashboard-wrapper')) {
      return;
    }
    const addBtn = e.target.closest('.product-add-btn, .btn-add-cart, #qvAddBtn, .add-to-basket-btn');
    if (addBtn) {
      e.preventDefault();
      window.location.href = '404.html';
    }
  });

  renderCartItems();
}

function addToCart(item) {
  const existing = cartState.find(p => p.id === item.id || p.name === item.name);
  if (existing) {
    existing.qty += item.qty || 1;
  } else {
    cartState.push({ ...item, qty: item.qty || 1 });
  }
  renderCartItems();
}

function updateCartQty(id, delta) {
  const item = cartState.find(p => p.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cartState = cartState.filter(p => p.id !== id);
    }
  }
  renderCartItems();
}

function removeFromCart(id) {
  cartState = cartState.filter(p => p.id !== id);
  renderCartItems();
}

function renderCartItems() {
  const cartContainer = document.getElementById('cartItemsList');
  const cartBadges = document.querySelectorAll('.cart-count-badge');
  const subtotalEl = document.getElementById('cartSubtotalValue');

  const totalCount = cartState.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartState.reduce((sum, item) => sum + (item.price * item.qty), 0);

  cartBadges.forEach(badge => {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'flex' : 'none';
  });

  if (subtotalEl) {
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  }

  if (!cartContainer) return;

  if (cartState.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-basket-shopping"></i>
        <h4>Your basket is empty</h4>
        <p>Explore our fresh organic harvest and start adding healthy goods!</p>
      </div>
    `;
    return;
  }

  cartContainer.innerHTML = cartState.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/fruits.webp'">
      <div class="cart-item-info">
        <h5 class="cart-item-title">${item.name}</h5>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
          <span style="font-weight: 700; font-size: 0.85rem;">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `).join('');
}

/* ==========================================================================
   3. Global Search Overlay & Live Search
   ========================================================================== */
const storeCatalog = [
  { id: '1', name: 'Organic Hass Avocado', category: 'Fruits', price: 4.99, image: 'assets/avocado.webp', rating: 4.9, desc: 'Creamy, rich in healthy fats, hand-picked from California organic groves.' },
  { id: '2', name: 'Fresh Farm Strawberries', category: 'Fruits', price: 6.49, image: 'assets/strawberries.webp', rating: 5.0, desc: 'Sweet, juicy, sun-ripened organic strawberries freshly harvested.' },
  { id: '3', name: 'Farm Fresh Baby Spinach', category: 'Vegetables', price: 3.99, image: 'assets/spinach.webp', rating: 4.8, desc: 'Tender baby spinach leaves loaded with iron, crisp and pesticide-free.' },
  { id: '4', name: 'Raw Wildflower Honey', category: 'Honey', price: 12.50, image: 'assets/honey-jar.webp', rating: 5.0, desc: '100% pure unfiltered raw honey sourced from pristine forest apiaries.' },
  { id: '5', name: 'Cold-Pressed Virgin Coconut Oil', category: 'Oils', price: 14.99, image: 'assets/coconut-oil.webp', rating: 4.9, desc: 'Centrifuge extracted pure virgin coconut oil for cooking and wellness.' },
  { id: '6', name: 'Organic Brown Basmati Rice', category: 'Grains', price: 8.99, image: 'assets/brown-rice.webp', rating: 4.7, desc: 'Aromatic long-grain whole grain basmati rice rich in natural fiber.' },
  { id: '7', name: 'Raw California Almonds', category: 'Snacks', price: 11.20, image: 'assets/almonds.webp', rating: 4.9, desc: 'Crunchy, non-pasteurized raw organic almonds full of vitamin E.' },
  { id: '8', name: 'Whole Leaf Organic Green Tea', category: 'Beverages', price: 9.50, image: 'assets/green-tea.webp', rating: 4.8, desc: 'High-elevation antioxidant-rich hand-rolled green tea leaves.' },
  { id: '9', name: 'Extra Virgin Cold-Pressed Olive Oil', category: 'Oils', price: 18.50, image: 'assets/olive-oil.webp', rating: 5.0, desc: 'First cold-pressed unrefined Mediterranean extra virgin olive oil.' },
  { id: '10', name: 'Organic Black Chia Seeds', category: 'Grains', price: 7.80, image: 'assets/chia-seeds.webp', rating: 4.9, desc: 'Superfood seeds packed with omega-3s, fiber, and clean protein.' },
  { id: '11', name: 'Crisp Royal Gala Apples', category: 'Fruits', price: 5.40, image: 'assets/apples.webp', rating: 4.8, desc: 'Sweet, crisp apples harvested at peak ripeness from certified orchards.' },
  { id: '12', name: 'Organic Crunchy Farm Carrots', category: 'Vegetables', price: 3.20, image: 'assets/carrots.webp', rating: 4.7, desc: 'Naturally sweet, bright orange soil-grown root carrots.' }
];

function initSearch() {
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const searchInput = document.getElementById('globalSearchInput');
  const searchResults = document.getElementById('searchResultsList');

  if (searchBtn && searchModal) {
    const openSearch = () => {
      searchModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 100);
        renderSearchResults('');
      }
    };

    const closeSearch = () => {
      searchModal.classList.remove('open');
      document.body.style.overflow = '';
      if (searchInput) searchInput.value = '';
    };

    searchBtn.addEventListener('click', (e) => {
      window.location.href = '404.html';
    });

    if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);

    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearch();
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderSearchResults(e.target.value.trim().toLowerCase());
      });
    }
  }

  function renderSearchResults(query) {
    if (!searchResults) return;

    const filtered = query
      ? storeCatalog.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
      : storeCatalog.slice(0, 5);

    if (filtered.length === 0) {
      searchResults.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--text-muted);">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 2rem; color: var(--accent); margin-bottom: 10px;"></i>
          <p>No organic products found matching "<strong>${query}</strong>"</p>
        </div>
      `;
      return;
    }

    searchResults.innerHTML = filtered.map(item => `
      <div class="search-result-item" onclick="window.location.href='404.html'" style="cursor: pointer;">
        <img src="${item.image}" alt="${item.name}">
        <div style="flex: 1;">
          <div class="search-result-title">${item.name}</div>
          <div class="search-result-cat">${item.category} &bull; $${item.price.toFixed(2)}</div>
        </div>
        <i class="fa-solid fa-chevron-right" style="color: var(--accent); font-size: 0.8rem;"></i>
      </div>
    `).join('');
  }
}

/* ==========================================================================
   4. Quick View Product Modal
   ========================================================================== */
function initQuickView() {
  const modal = document.getElementById('quickviewModal');
  const closeBtn = document.getElementById('quickviewCloseBtn');

  if (modal && closeBtn) {
    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('click', (e) => {
    if (document.body.classList.contains('dashboard-body') || e.target.closest('.dashboard-wrapper')) {
      return;
    }
    const trigger = e.target.closest('.product-quickview-trigger');
    if (trigger) {
      e.preventDefault();
      window.location.href = '404.html';
    }
  });
}

function openProductQuickView(id) {
  window.location.href = '404.html';
}

/* ==========================================================================
   5. Wishlist Heart Button
   ========================================================================== */
function initWishlist() {
  document.addEventListener('click', (e) => {
    if (document.body.classList.contains('dashboard-body') || e.target.closest('.dashboard-wrapper')) {
      return;
    }
    const wishBtn = e.target.closest('.product-wishlist-btn');
    if (wishBtn) {
      e.preventDefault();
      window.location.href = '404.html';
    }
  });
}

/* ==========================================================================
   6. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  document.addEventListener('click', (e) => {
    const header = e.target.closest('.faq-accordion-header, .faq-question');
    if (!header) return;
    
    const item = header.closest('.faq-accordion-item, .faq-item');
    if (!item) return;

    const isOpen = item.classList.contains('open') || item.classList.contains('active');
    const container = item.closest('.faq-accordion-container, .faq-wrap') || document;
    const allItems = container.querySelectorAll('.faq-accordion-item, .faq-item');

    // Collapse all items
    allItems.forEach(el => {
      el.classList.remove('open', 'active');
      const btn = el.querySelector('.faq-accordion-header, .faq-question');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });

    // Toggle current item
    if (!isOpen) {
      item.classList.add('open', 'active');
      header.setAttribute('aria-expanded', 'true');
    }
  });
}

/* ==========================================================================
   7. Form Validation (Contact, Newsletter)
   ========================================================================== */
function initForms() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const phone = document.getElementById('contactPhone');
      const subject = document.getElementById('contactSubject');
      const message = document.getElementById('contactMessage');
      let isValid = true;

      const validateField = (input, condition, errorId) => {
        const errEl = document.getElementById(errorId);
        if (!condition) {
          input.classList.add('error');
          if (errEl) errEl.classList.add('visible');
          isValid = false;
        } else {
          input.classList.remove('error');
          if (errEl) errEl.classList.remove('visible');
        }
      };

      if (name) validateField(name, name.value.trim().length >= 2, 'errContactName');
      if (email) validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()), 'errContactEmail');
      if (phone && phone.value.trim()) validateField(phone, phone.value.trim().length >= 7, 'errContactPhone');
      if (subject) validateField(subject, subject.value !== '', 'errContactSubject');
      if (message) validateField(message, message.value.trim().length >= 10, 'errContactMessage');

      if (isValid) {
        contactForm.reset();
        window.location.href = '404.html';
      }
    });
  }

  // Newsletter Subscription
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const errEl = document.getElementById('errNewsletterEmail');
      if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        if (errEl) errEl.style.display = 'none';
        input.classList.remove('error');
        input.value = '';
        window.location.href = '404.html';
      } else if (input) {
        input.classList.add('error');
        if (errEl) errEl.style.display = 'block';
      }
    });
  }
}

/* ==========================================================================
   8. Authentication (Login & Signup)
   ========================================================================== */
function initAuth() {
  let selectedRole = 'customer'; // default

  // Password Visibility Eye Toggle
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = btn.closest('.auth-input-group');
      if (!parent) return;
      const input = parent.querySelector('input');
      const icon = btn.querySelector('i');
      if (!input || !icon) return;

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        btn.setAttribute('aria-label', 'Hide password');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        btn.setAttribute('aria-label', 'Show password');
      }
    });
  });

  const roleBtns = document.querySelectorAll('.role-tab-btn');
  roleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      roleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedRole = btn.dataset.role || 'customer';
    });
  });

  // Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail');
      const pass = document.getElementById('loginPassword');
      let isValid = true;

      const validateInput = (input, condition, errorId) => {
        const err = document.getElementById(errorId);
        if (!condition) {
          input.classList.add('error');
          if (err) err.classList.add('visible');
          isValid = false;
        } else {
          input.classList.remove('error');
          if (err) err.classList.remove('visible');
        }
      };

      if (email) validateInput(email, email.value.trim().length >= 3, 'errLoginEmail');
      if (pass) validateInput(pass, pass.value.length >= 4, 'errLoginPass');

      if (isValid) {
        const enteredEmail = email ? email.value.trim() : '';
        if (enteredEmail) {
          sessionStorage.setItem('stackly_user_email', enteredEmail);
          localStorage.setItem('stackly_user_email', enteredEmail);
          const derivedName = deriveNameFromEmail(enteredEmail);
          sessionStorage.setItem('stackly_user_name', derivedName);
          localStorage.setItem('stackly_user_name', derivedName);
        }

        if (selectedRole === 'admin') {
          window.location.href = 'AdminDashboard.html';
        } else {
          window.location.href = 'CustomerDashboard.html';
        }
      }
    });
  }

  // Signup Form
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName');
      const email = document.getElementById('signupEmail');
      const pass = document.getElementById('signupPassword');
      const confirm = document.getElementById('signupConfirmPassword');
      let isValid = true;

      const validateInput = (input, condition, errorId) => {
        const err = document.getElementById(errorId);
        if (!condition) {
          input.classList.add('error');
          if (err) err.classList.add('visible');
          isValid = false;
        } else {
          input.classList.remove('error');
          if (err) err.classList.remove('visible');
        }
      };

      if (name) validateInput(name, name.value.trim().length >= 2, 'errSignupName');
      if (email) validateInput(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()), 'errSignupEmail');
      if (pass) validateInput(pass, pass.value.length >= 6, 'errSignupPass');
      if (confirm) validateInput(confirm, confirm.value === (pass ? pass.value : '') && confirm.value.length >= 6, 'errSignupConfirm');

      if (isValid) {
        const enteredName = name ? name.value.trim() : '';
        const enteredEmail = email ? email.value.trim() : '';
        if (enteredName) {
          sessionStorage.setItem('stackly_user_name', enteredName);
          localStorage.setItem('stackly_user_name', enteredName);
        }
        if (enteredEmail) {
          sessionStorage.setItem('stackly_user_email', enteredEmail);
          localStorage.setItem('stackly_user_email', enteredEmail);
        }

        window.location.href = 'Login.html';
      }
    });
  }
}

/* ==========================================================================
   9. Shop & Products Dynamic Filter Engine
   ========================================================================== */
function initCatalogFilters() {
  const filterPills = document.querySelectorAll('.filter-pill, .cat-tab-btn');
  const searchInput = document.getElementById('catalogSearchInput');
  const priceSlider = document.getElementById('priceRangeSlider');
  const priceDisplay = document.getElementById('priceDisplayVal');
  const sortSelect = document.getElementById('sortProductsSelect');
  const productCards = document.querySelectorAll('.product-card-item');
  const resultsCount = document.getElementById('catalogResultsCount');
  const noResults = document.getElementById('noProductsNotice');

  let activeCategory = 'all';
  let searchQuery = '';
  let maxPrice = 50;

  function filterProducts() {
    let visibleCount = 0;

    productCards.forEach(card => {
      const cat = card.dataset.category ? card.dataset.category.toLowerCase() : '';
      const name = card.dataset.name ? card.dataset.name.toLowerCase() : '';
      const price = parseFloat(card.dataset.price) || 0;

      const matchCat = (activeCategory === 'all' || cat === activeCategory.toLowerCase());
      const matchSearch = (!searchQuery || name.includes(searchQuery) || cat.includes(searchQuery));
      const matchPrice = (price <= maxPrice);

      if (matchCat && matchSearch && matchPrice) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (resultsCount) resultsCount.textContent = visibleCount;
    if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.category || 'all';
      filterProducts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterProducts();
    });
  }

  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener('input', (e) => {
      maxPrice = parseFloat(e.target.value);
      priceDisplay.textContent = `$${maxPrice}`;
      filterProducts();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      const grid = document.querySelector('.shop-products-grid, .products-catalog-grid');
      if (!grid) return;

      const items = Array.from(productCards);
      items.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price) || 0;
        const priceB = parseFloat(b.dataset.price) || 0;
        const ratingA = parseFloat(a.dataset.rating) || 0;
        const ratingB = parseFloat(b.dataset.rating) || 0;

        if (val === 'price-low') return priceA - priceB;
        if (val === 'price-high') return priceB - priceA;
        if (val === 'rating') return ratingB - ratingA;
        return 0;
      });

      items.forEach(item => grid.appendChild(item));
    });
  }
}

/* ==========================================================================
   10. Animated Statistics Counters
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10) || 0;
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();

        const update = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const current = Math.floor(progress * target);
          el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          }
        };

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   User Session & Identity Helpers
   ========================================================================== */
function deriveNameFromEmail(email) {
  if (!email) return 'Member';
  const username = email.split('@')[0] || '';
  const rawParts = username.replace(/[0-9]+/g, ' ').split(/[._\-+\s]+/).filter(Boolean);
  if (!rawParts.length) {
    return username ? (username.charAt(0).toUpperCase() + username.slice(1)) : 'Member';
  }
  return rawParts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
}

function getFirstName(fullName) {
  if (!fullName) return 'User';
  return fullName.trim().split(/\s+/)[0];
}

function applyUserSessionData() {
  const isAdmin = window.location.pathname.includes('AdminDashboard.html');
  const defaultEmail = isAdmin ? 'admin@stackly.org' : 'priya.sharma@example.com';
  const defaultName = isAdmin ? 'Venkatesh Rao' : 'Priya Sharma';

  const userEmail = sessionStorage.getItem('stackly_user_email') || localStorage.getItem('stackly_user_email') || defaultEmail;
  const userName = sessionStorage.getItem('stackly_user_name') || localStorage.getItem('stackly_user_name') || deriveNameFromEmail(userEmail) || defaultName;
  const firstName = getFirstName(userName);

  // 1. Welcome section first name / display name
  document.querySelectorAll('.user-display-first-name').forEach(el => {
    el.textContent = firstName;
  });

  // 2. Profile section full name
  document.querySelectorAll('.user-display-full-name').forEach(el => {
    el.textContent = userName;
  });

  // 3. Profile section email id
  document.querySelectorAll('.user-display-email').forEach(el => {
    el.textContent = userEmail;
    el.setAttribute('title', userEmail);
  });

  // 4. Form inputs (Customer Profile Panel)
  const profFullName = document.getElementById('profFullName');
  if (profFullName) {
    profFullName.value = userName;
  }
  const profEmail = document.getElementById('profEmail');
  if (profEmail) {
    profEmail.value = userEmail;
  }
  const savedPhone = sessionStorage.getItem('stackly_user_phone') || localStorage.getItem('stackly_user_phone');
  const profPhone = document.getElementById('profPhone');
  if (profPhone && savedPhone) {
    profPhone.value = savedPhone;
  }
  const savedAddress = sessionStorage.getItem('stackly_user_address') || localStorage.getItem('stackly_user_address');
  const profAddress = document.getElementById('profAddress');
  if (profAddress && savedAddress) {
    profAddress.value = savedAddress;
  }
  const savedSlot = sessionStorage.getItem('stackly_user_slot') || localStorage.getItem('stackly_user_slot');
  const profSlot = document.getElementById('profSlot');
  if (profSlot && savedSlot) {
    profSlot.value = savedSlot;
  }

  // Load dietary preferences
  const loadPref = (id, key) => {
    const el = document.getElementById(id);
    const val = sessionStorage.getItem(key) || localStorage.getItem(key);
    if (el && val !== null) {
      el.checked = val === 'true';
    }
  };
  loadPref('prefOrganic', 'stackly_pref_organic');
  loadPref('prefGlutenFree', 'stackly_pref_gluten_free');
  loadPref('prefVegan', 'stackly_pref_vegan');
  loadPref('prefOils', 'stackly_pref_oils');

  // 5. Payment Details (Cardholder name & UPI)
  document.querySelectorAll('.user-display-card-name').forEach(el => {
    el.textContent = userName.toUpperCase();
  });
  document.querySelectorAll('.user-display-upi').forEach(el => {
    const handle = userEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    el.textContent = `${handle || 'user'}@okhdfcbank`;
  });
}

/* ==========================================================================
   11. Admin & Customer Dashboards (Canvas Charts & Mobile Sidebar)
   ========================================================================== */
function initDashboards() {
  // Apply current user session name & email
  applyUserSessionData();

  const sidebar = document.querySelector('.dashboard-sidebar');
  const toggleBtn = document.querySelector('.mobile-sidebar-toggle');
  const closeBtns = document.querySelectorAll('.sidebar-close-btn');
  const overlay = document.getElementById('drawerOverlay');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active');
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
      });
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    }
  }

  // Dashboard Sidebar Menu Switching & Logout Handling
  const menuItems = document.querySelectorAll('.sidebar-item');
  menuItems.forEach(item => {
    if (item.classList.contains('logout-item')) {
      item.addEventListener('click', () => {
        sessionStorage.removeItem('stackly_user_email');
        sessionStorage.removeItem('stackly_user_name');
      });
      return;
    }
    const targetView = item.dataset.target;
    if (targetView) {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        menuItems.forEach(m => m.classList.remove('active'));
        item.classList.add('active');
        document.querySelectorAll('.dashboard-view-panel').forEach(panel => {
          panel.style.display = (panel.id === targetView) ? 'block' : 'none';
        });
        if (window.innerWidth <= 991 && sidebar) {
          sidebar.classList.remove('open');
          if (overlay) overlay.classList.remove('active');
        }
        setTimeout(() => {
          renderSalesChart();
          renderCategoryChart();
        }, 50);
      });
    }
  });

  // Dashboard Forms (Settings & Profile) navigate to 404.html
  const adminSettingsForm = document.getElementById('adminSettingsForm');
  if (adminSettingsForm) {
    adminSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }

  const customerProfileForm = document.getElementById('customerProfileForm');
  if (customerProfileForm) {
    customerProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }



  // Render Canvas Charts if present
  renderSalesChart();
  renderCategoryChart();

  // Responsive Chart Redraw on Window Resize / Orientation Change
  let chartResizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(chartResizeTimeout);
    chartResizeTimeout = setTimeout(() => {
      renderSalesChart();
      renderCategoryChart();
    }, 120);
  });
}

function renderSalesChart() {
  const canvas = document.getElementById('monthlySalesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const values = [12, 16, 14, 21, 19, 25, 23, 28]; // In Lakhs
  const maxVal = 32;

  const padLeft = 40;
  const padBottom = 30;
  const w = rect.width - padLeft - 20;
  const h = rect.height - padBottom - 20;

  // Grid Lines
  ctx.strokeStyle = 'rgba(36, 92, 58, 0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = 10 + (h / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(rect.width - 20, y);
    ctx.stroke();
  }

  // Gradient area
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, 'rgba(36, 92, 58, 0.35)');
  gradient.addColorStop(1, 'rgba(36, 92, 58, 0.0)');

  const points = values.map((val, idx) => {
    const x = padLeft + (w / (values.length - 1)) * idx;
    const y = 10 + h - (val / maxVal) * h;
    return { x, y };
  });

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.lineTo(points[points.length - 1].x, 10 + h);
  ctx.lineTo(points[0].x, 10 + h);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.strokeStyle = '#245C3A';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Points & Labels
  points.forEach((p, idx) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#E7A93B';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'rgba(36, 92, 58, 0.7)';
    ctx.font = '600 11px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(months[idx], p.x, rect.height - 10);
  });
}

function renderCategoryChart() {
  const canvas = document.getElementById('categoryDoughnutCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const data = [
    { label: 'Fruits', val: 35, color: '#245C3A' },
    { label: 'Vegetables', val: 25, color: '#E7A93B' },
    { label: 'Honey & Oils', val: 20, color: '#173d26' },
    { label: 'Grains', val: 20, color: 'rgba(231, 169, 59, 0.6)' }
  ];

  const total = data.reduce((s, d) => s + d.val, 0);
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const radius = Math.min(cx, cy) - 25;
  const innerRadius = radius * 0.62;

  let startAngle = -Math.PI / 2;

  data.forEach(slice => {
    const sliceAngle = (slice.val / total) * (Math.PI * 2);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
    ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = slice.color;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    startAngle += sliceAngle;
  });

  // Center Text
  ctx.fillStyle = '#245C3A';
  ctx.font = '700 16px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('100%', cx, cy - 8);
  ctx.font = '600 11px Plus Jakarta Sans, sans-serif';
  ctx.fillStyle = '#E7A93B';
  ctx.fillText('Organic', cx, cy + 12);
}

/* ==========================================================================
   12. GSAP & ScrollTrigger Animations
   ========================================================================== */
function initGsapAnimations() {
  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Stagger Animation
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroCtas = document.querySelectorAll('.hero-cta-group .btn');
  const heroCards = document.querySelectorAll('.floating-card');

  if (heroTitle) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(heroTitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, clearProps: 'all' })
      .fromTo(heroSubtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, clearProps: 'all' }, '-=0.4')
      .fromTo(heroCtas, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out', clearProps: 'all' }, '-=0.3')
      .fromTo(heroCards, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.2, ease: 'back.out(1.7)', clearProps: 'all' }, '-=0.2');
  }

  // Section ScrollTrigger reveals
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('.section-header, .stat-card, .category-card, .why-card, .timeline-step, .testimonial-card, .blog-card').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          clearProps: 'all'
        }
      );
    });
  }
}

/* ==========================================================================
   13. Flash Harvest Deals Countdown Timer
   ========================================================================== */
function initFlashCountdown() {
  const hoursEl = document.getElementById('flashTimerHours');
  const minsEl = document.getElementById('flashTimerMins');
  const secsEl = document.getElementById('flashTimerSecs');

  if (!hoursEl || !minsEl || !secsEl) return;

  let totalSeconds = 14 * 3600 + 42 * 60 + 19; // 14h 42m 19s initial

  setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      const hrs = Math.floor(totalSeconds / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;

      hoursEl.textContent = String(hrs).padStart(2, '0');
      minsEl.textContent = String(mins).padStart(2, '0');
      secsEl.textContent = String(secs).padStart(2, '0');
    }
  }, 1000);
}

/* ==========================================================================
   14. Interactive Storage & Nutrition Tabs
   ========================================================================== */
function initStorageTabs() {
  const tabBtns = document.querySelectorAll('.storage-tab-btn');
  const tabPanes = document.querySelectorAll('.storage-tab-pane');

  if (tabBtns.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.tab;
      tabPanes.forEach(pane => {
        pane.style.display = (pane.id === targetId) ? 'grid' : 'none';
      });
    });
  });
}

/* ==========================================================================
   Popup Alert Prevention & Null Handler
   ========================================================================== */
function showToast() {
  // Popup alerts disabled throughout the website
  const existingContainer = document.getElementById('toastContainer');
  if (existingContainer) {
    existingContainer.remove();
  }
}

/* ==========================================================================
   14. Logo Dynamic Transparency Processor
   Converts white pixels of logo01.webp into transparent alpha on the fly
   ========================================================================== */
function initLogoTransparency() {
  const logos = document.querySelectorAll('img[src*="logo01.webp"]');
  if (!logos.length) return;

  const cachedLogo = sessionStorage.getItem('stackly_transparent_logo_v2');
  if (cachedLogo) {
    logos.forEach(img => { img.src = cachedLogo; });
    return;
  }

  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      let minX = w, minY = h, maxX = 0, maxY = 0;
      let hasContent = false;

      // Process pixels: convert white / near-white background to transparent & compute bounds
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          if (r > 200 && g > 200 && b > 200) {
            const brightness = (r + g + b) / 3;
            if (brightness > 235) {
              data[idx + 3] = 0; // Fully transparent
            } else {
              // Smooth anti-aliased blend
              data[idx + 3] = Math.round((255 - brightness) * (255 / 35));
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
              hasContent = true;
            }
          } else {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
            hasContent = true;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      let finalDataUrl;
      // Auto-crop to content bounding box to maximize display size
      if (hasContent && maxX > minX && maxY > minY) {
        const cropWidth = maxX - minX + 1;
        const cropHeight = maxY - minY + 1;
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = cropWidth;
        cropCanvas.height = cropHeight;
        const cropCtx = cropCanvas.getContext('2d');
        cropCtx.drawImage(canvas, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        finalDataUrl = cropCanvas.toDataURL('image/png');
      } else {
        finalDataUrl = canvas.toDataURL('image/png');
      }

      try {
        sessionStorage.setItem('stackly_transparent_logo_v2', finalDataUrl);
      } catch (e) {}

      logos.forEach(logoImg => {
        logoImg.src = finalDataUrl;
      });
    } catch (err) {
      // Gracefully falls back to CSS mix-blend-mode / filters
    }
  };
  img.src = 'assets/logo01.webp';
}

/* ==========================================================================
   15. Navigation History & BFCache Restore Cleaner
   ========================================================================== */
window.addEventListener('pageshow', () => {
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur();
  }
});



setTimeout(() => {
  document.querySelectorAll('.form-control').forEach(el => {
    el.disabled = false;
    el.readOnly = false;
  });
}, 500);

