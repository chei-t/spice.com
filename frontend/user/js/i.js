// ===============================
//  SpiceHaven Main Script
// ===============================

// --- 1️ Mobile Menu Toggle ---
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// --- 2️ User Auth Logic ---
const authSection = document.getElementById("auth-section");

function loadUserAuth() {
  if (!authSection) return;
  const user = JSON.parse(localStorage.getItem("user"));
  authSection.innerHTML = "";

  if (user) {
    authSection.innerHTML = `
      <span class="welcome">Welcome, ${user.name || "Solomon"} 👋</span>
      <button class="logout-btn" id="logout-btn">Logout</button>
    `;

    // Logout handler
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        alert("You have been logged out.");
        window.location.href = "login.html";
      });
    }
  } else {
    authSection.innerHTML = `
      <a href="login.html">Login</a> |
      <a href="intro.html">Register</a>
    `;
  }
}
loadUserAuth();

// --- 3️ Hero Section: Video Rotation & Scroll Down ---
const videos = [
  "../videos/spices1.mp4",
  "../videos/spices2.mp4",
  "../videos/spices3.mp4",
  "../videos/spices4.mp4",
  "../videos/spices5.mp4",
  "../videos/spices6.mp4",
  "../videos/spices7.mp4",
  "../videos/spices8.mp4",
  "../videos/spices9.mp4",
  "../videos/spices10.mp4",
];

let currentVideo = 0;
const videoElement = document.getElementById("hero-video");

if (videoElement) {
  setInterval(() => {
    currentVideo = (currentVideo + 1) % videos.length;
    videoElement.src = videos[currentVideo];
    videoElement.play();
  }, 60000); // switches every 1 minute
}

// Scroll Down Arrow
const scrollArrow = document.getElementById("scroll-down-arrow");
if (scrollArrow) {
  scrollArrow.addEventListener("click", () => {
    const nextSection = document.querySelector("#products");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// --- 4️ Fetch Products from API ---
async function fetchProducts() {
  const loading = document.getElementById("loading");
  const grid = document.getElementById("products-grid");

  if (!grid) return; // stop if grid not found

  try {
    // Show loading spinner/text
    if (loading) {
      loading.style.display = "block";
      loading.textContent = "Loading products...";
    }

    //  Use your backend API URL
    const response = await fetch("http://localhost:5000/api/products");

    // Check if response failed
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const products = await response.json();

    // Hide loader after fetching
    if (loading) loading.style.display = "none";
    grid.style.display = "grid";

    // No products case
    if (!products || products.length === 0) {
      grid.innerHTML = `<p style="text-align:center;">No products available at the moment.</p>`;
      return;
    }

    //  Render product cards dynamically
    grid.innerHTML = products
      .map(
        (product) => {
          const inCart = isInCart(product.name);
          return `
        <div class="product-card">
          <img
            src="${product.image || "/images/default-spice.jpg"}"
            alt="${product.name}"
            class="product-image"
            style="width:100%; height:250px; object-fit:cover; border-radius:10px;"
            onerror="this.src='/images/default-spice.jpg';"
          />
          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description || "No description available."}</p>
            <div class="product-price">$${product.price || "0.00"}</div>
            <button class="product-btn ${inCart ? 'remove-btn' : 'add-btn'}" onclick='handleAddToCart("${product.name.replace(/"/g, '\\"')}", ${JSON.stringify(product).replace(/"/g, '\\"')})'>
              ${inCart ? 'Remove from Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      `;
        }
      )
      .join("");
  } catch (error) {
    console.error("Error fetching products:", error);
    if (loading) {
      loading.style.display = "block";
      loading.textContent = "⚠️ Failed to load products. Please try again later.";
    }
  }
}

// --- Cart Management ---
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existingProduct = cart.find(item => item.name === product.name);
  if (!existingProduct) {
    product.quantity = 1;
    cart.push(product);
    saveCart(cart);
    updateCartBadge();
    return true; // Added
  } else {
    existingProduct.quantity += 1;
    saveCart(cart);
    updateCartBadge();
    return true; // Quantity increased
  }
}

function removeFromCart(productName) {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.name !== productName);
  saveCart(updatedCart);
  displayCart();
  fetchProducts();
  updateCartBadge();
  return updatedCart.length < cart.length; // Removed if length decreased
}

function updateQuantity(productName, newQuantity) {
  const cart = getCart();
  const product = cart.find(item => item.name === productName);
  if (product) {
    product.quantity = newQuantity;
    if (product.quantity <= 0) {
      removeFromCart(productName);
    } else {
      saveCart(cart);
      displayCart();
      updateCartBadge();
    }
  }
}

function isInCart(productName) {
  const cart = getCart();
  return cart.some(item => item.name === productName);
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = totalItems;
    badge.classList.toggle('empty', totalItems === 0);
    badge.classList.toggle('pulse', totalItems > 0);
  }
}

function displayCart() {
  const cart = getCart();
  const cartItemsDiv = document.getElementById('cart-items');
  const cartSubtotalSpan = document.getElementById('cart-subtotal');
  const cartTotalSpan = document.getElementById('cart-total');
  const cartShippingSpan = document.getElementById('cart-shipping');
  const checkoutWrapper = document.getElementById('checkout-wrapper');

  if (!cartItemsDiv || !cartSubtotalSpan || !cartTotalSpan || !cartShippingSpan) return;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    cartSubtotalSpan.textContent = '0.00';
    cartShippingSpan.textContent = '0.00';
    cartTotalSpan.textContent = '0.00';
    if (checkoutWrapper) checkoutWrapper.style.display = 'none';
    return;
  }

  let subtotal = 0;
  cartItemsDiv.innerHTML = cart.map(item => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    subtotal += itemTotal;
    return `
      <div class="cart-item" style="display:flex; gap:10px; margin-bottom:10px; align-items:center;">
        <img src="${item.image || '/images/default-spice.jpg'}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover;" onerror="this.src='/images/default-spice.jpg';">
        <div style="flex:1;">
          <h4>${item.name}</h4>
          <p>$${item.price || '0.00'}</p>
        </div>
        <div>
          <button onclick="updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
        </div>
        <p>$${itemTotal.toFixed(2)}</p>
        <button onclick="removeFromCart('${item.name}')">Remove</button>
      </div>
    `;
  }).join('');

  const shipping = 5.00;
  const total = subtotal + shipping;

  cartSubtotalSpan.textContent = subtotal.toFixed(2);
  cartShippingSpan.textContent = shipping.toFixed(2);
  cartTotalSpan.textContent = total.toFixed(2);

  // Update checkout summary spans as well
  const checkoutSubtotalSpan = document.getElementById('checkout-subtotal');
  const checkoutShippingSpan = document.getElementById('checkout-shipping');
  const checkoutTotalSpan = document.getElementById('checkout-total');

  if (checkoutSubtotalSpan) checkoutSubtotalSpan.textContent = subtotal.toFixed(2);
  if (checkoutShippingSpan) checkoutShippingSpan.textContent = shipping.toFixed(2);
  if (checkoutTotalSpan) checkoutTotalSpan.textContent = total.toFixed(2);
}

// --- Handle Add/Remove from Cart ---
function handleAddToCart(productName, product) {
  if (isInCart(productName)) {
    removeFromCart(productName);
    alert(`${productName} removed from cart!`);
  } else {
    addToCart(product);
    displayCart(); // Update and show cart
    alert(`${productName} added to cart!`);
    // Navigate to checkout wrapper
    const checkoutWrapper = document.getElementById('checkout-wrapper');
    if (checkoutWrapper) {
      checkoutWrapper.style.display = 'block';
      checkoutWrapper.scrollIntoView({ behavior: 'smooth' });
    }
  }
  // Re-render products to update button states
  fetchProducts();
}

// --- Multi-Step Checkout Functions ---
function goToCheckout() {
  // Hide step 1, show step 2
  document.getElementById('step-content-1').style.display = 'none';
  document.getElementById('step-content-2').style.display = 'block';

  // Update progress indicators
  document.getElementById('step-indicator-1').querySelector('.step-circle').classList.remove('active');
  document.getElementById('step-indicator-2').querySelector('.step-circle').classList.add('active');

  // Animate progress line
  document.getElementById('line-progress-1').style.width = '100%';

  // Scroll to top of checkout
  document.getElementById('checkout-wrapper').scrollIntoView({ behavior: 'smooth' });
}

function goBackToCart() {
  // Hide step 2, show step 1
  document.getElementById('step-content-2').style.display = 'none';
  document.getElementById('step-content-1').style.display = 'block';

  // Update progress indicators
  document.getElementById('step-indicator-2').querySelector('.step-circle').classList.remove('active');
  document.getElementById('step-indicator-1').querySelector('.step-circle').classList.add('active');

  // Reset progress line
  document.getElementById('line-progress-1').style.width = '0%';

  // Scroll to top of checkout
  document.getElementById('checkout-wrapper').scrollIntoView({ behavior: 'smooth' });
}

function continueShopping() {
  // Hide checkout wrapper and go back to products
  document.getElementById('checkout-wrapper').style.display = 'none';
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// --- Fetch Products When Page Loads ---
document.addEventListener("DOMContentLoaded", function() {
  fetchProducts();
  displayCart(); // Display cart on page load
  updateCartBadge(); // Initialize cart badge on page load

  // Checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      document.getElementById('cart').style.display = 'none';
      document.getElementById('checkout').style.display = 'block';
      document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Checkout form submission
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Generate order number
      const orderNumber = 'SPH-' + Date.now();
      const orderDate = new Date().toLocaleDateString();
      const orderTotal = document.getElementById('checkout-total').textContent;

      // Update order complete section
      document.getElementById('order-number').textContent = orderNumber;
      document.getElementById('order-date').textContent = orderDate;
      document.getElementById('order-total').textContent = orderTotal;

      // Hide step 2, show step 3
      document.getElementById('step-content-2').style.display = 'none';
      document.getElementById('step-content-3').style.display = 'block';

      // Update progress indicators
      document.getElementById('step-indicator-2').querySelector('.step-circle').classList.remove('active');
      document.getElementById('step-indicator-3').querySelector('.step-circle').classList.add('active');

      // Animate progress line
      document.getElementById('line-progress-2').style.width = '100%';

      // Scroll to top of checkout
      document.getElementById('checkout-wrapper').scrollIntoView({ behavior: 'smooth' });

      // Here you would send order to backend
      // For now, just clear cart after a delay to simulate processing
      setTimeout(() => {
        localStorage.removeItem('cart');
        displayCart();
        fetchProducts();
      }, 2000);
    });
  }

  // Continue shopping button
  const continueShoppingBtn = document.getElementById('continue-shopping-btn');
  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener('click', continueShopping);
  }
});


// --- 5️ Contact Form Handler ---
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const inquiry = document.getElementById("inquiry").value;
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !inquiry || !message) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    alert(`Thank you, ${name}! We'll get back to you within 24 hours.`);
    contactForm.reset();
  });
}

// --- 6️ Footer Dynamic Year ---
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// --- User Dashboard Modal and Functionality ---

// Modal Management
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Toast Notifications
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Add Address Functionality
function addAddress(event) {
  event.preventDefault();
  
  const addressType = document.getElementById('addressType').value;
  const fullAddress = document.getElementById('fullAddress').value.trim();

  if (!addressType || !fullAddress) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  // Here you would typically send to backend
  // For now, just show success and close modal
  showToast('Address added successfully!');
  closeModal('addAddressModal');
  event.target.reset();
}

// Add Payment Functionality
function addPayment(event) {
  event.preventDefault();
  
  const cardNumber = document.getElementById('cardNumber').value.trim();
  const expiryDate = document.getElementById('expiryDate').value.trim();
  const cvv = document.getElementById('cvv').value.trim();
  const cardholderName = document.getElementById('cardholderName').value.trim();

  if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  // Basic validation
  if (cardNumber.length < 16) {
    showToast('Please enter a valid card number', 'error');
    return;
  }

  // Here you would typically send to backend
  // For now, just show success and close modal
  showToast('Payment method added successfully!');
  closeModal('addPaymentModal');
  event.target.reset();
}

// Show Order Details
function showOrderDetails(orderId) {
  // Here you would fetch order details from backend
  // For now, show placeholder
  const orderDetailsContent = document.getElementById('orderDetailsContent');
  if (orderDetailsContent) {
    orderDetailsContent.innerHTML = `
      <div class="space-y-4">
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Status:</strong> Delivered</p>
        <p><strong>Items:</strong></p>
        <ul class="list-disc list-inside">
          <li>Organic Turmeric Powder - $12.99</li>
          <li>Ceylon Cinnamon Sticks - $15.49</li>
        </ul>
        <p><strong>Total:</strong> $28.48</p>
      </div>
    `;
  }
  openModal('orderDetailsModal');
}

// Confirmation Modal
function confirmAction() {
  // This would be used for various confirmations
  showToast('Action confirmed!');
  closeModal('confirmationModal');
}

function confirmLogout() {
  const confirmationMessage = document.getElementById('confirmationMessage');
  if (confirmationMessage) {
    confirmationMessage.textContent = 'Are you sure you want to logout?';
  }
  openModal('confirmationModal');
}

// Tab Switching (moved from HTML)
function showTab(tabName) {
  // Hide all tab contents
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => {
    content.classList.add('hidden');
  });

  // Remove active class from all tabs
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.classList.remove('active-tab');
    tab.classList.add('text-gray-700');
  });

  // Show selected tab content
  const selectedContent = document.getElementById('content-' + tabName);
  if (selectedContent) {
    selectedContent.classList.remove('hidden');
  }

  // Add active class to selected tab
  const activeTab = document.getElementById('tab-' + tabName);
  if (activeTab) {
    activeTab.classList.add('active-tab');
    activeTab.classList.remove('text-gray-700');
  }
}

// Add to Cart from Wishlist
function addToCartFromWishlist(productName, price) {
  const product = {
    name: productName,
    price: price,
    image: '/images/default-spice.jpg', // Default image
    quantity: 1
  };
  addToCart(product);
  showToast(`${productName} added to cart!`);
  fetchProducts(); // Update product buttons
}

// Remove from Wishlist
function removeFromWishlist(productName) {
  // For static HTML, just show toast
  showToast(`${productName} removed from wishlist!`);
}

// Edit Address
function editAddress(addressType) {
  // For static HTML, show toast
  showToast(`Edit ${addressType} address not implemented yet.`);
}

// Confirm Delete Address
function confirmDeleteAddress(addressType) {
  const confirmationMessage = document.getElementById('confirmationMessage');
  if (confirmationMessage) {
    confirmationMessage.textContent = `Are you sure you want to delete the ${addressType} address?`;
  }
  let pendingAction = 'deleteAddress';
  openModal('confirmationModal');
}

// Save Settings
function saveSettings() {
  // For static HTML, just show toast
  showToast('Settings saved successfully!');
}

// Initialize Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Add Address Button
  const addAddressBtn = document.querySelector('#content-addresses button');
  if (addAddressBtn) {
    addAddressBtn.addEventListener('click', () => openModal('addAddressModal'));
  }

  // Add Payment Button
  const addPaymentBtn = document.querySelector('#content-payment button');
  if (addPaymentBtn) {
    addPaymentBtn.addEventListener('click', () => openModal('addPaymentModal'));
  }

  // Order Details Buttons
  const viewDetailsBtns = document.querySelectorAll('.tab-content button');
  viewDetailsBtns.forEach(btn => {
    if (btn.textContent.includes('View Details')) {
      btn.addEventListener('click', function() {
        const orderId = this.closest('.border').querySelector('h3').textContent;
        showOrderDetails(orderId);
      });
    }
  });

  // Logout Button
  const logoutBtn = document.getElementById('tab-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', confirmLogout);
  }

  // Close modals when clicking outside
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
      const modalId = event.target.id;
      closeModal(modalId);
    }
  });
});
