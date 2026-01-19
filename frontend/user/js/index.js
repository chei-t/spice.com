// ===============================
//  SpiceHaven Main Script
// ===============================

// --- 1️.Mobile Menu Toggle ---
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// --- 2️.User Auth Logic ---
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

// --- 3️. Hero Section: Video Rotation & Scroll Down ---
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

// --- 4️. Generate Star Ratings ---
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  let stars = '';

  for (let i = 0; i < fullStars; i++) {
    stars += '★';
  }
  if (halfStar) {
    stars += '☆';
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += '☆';
  }
  return stars;
}

// --- 5️. Fetch Products from API ---
let allProducts = []; // Store all products for search

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
    allProducts = products; // Store all products for search

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
          const inWishlist = isInWishlist(product.name);
          const rating = product.rating || 0;
          const reviews = product.reviews || [];
          const category = product.category || 'Uncategorized';
          const stars = generateStars(rating);
          return `
        <div class="product-card">
          <div class="product-category">${category}</div>
          <button class="wishlist-btn ${inWishlist ? 'in-wishlist' : ''}" onclick='handleWishlist("${product.name.replace(/"/g, '\\"')}", ${JSON.stringify(product).replace(/'/g, "\\'")})'>
            ${inWishlist ? '❤️' : '🤍'}
          </button>
          <img
            src="${product.image || "/images/default-spice.jpg"}"
            alt="${product.name}"
            class="product-image"
            style="width:100%; height:250px; object-fit:cover; border-radius:10px;"
            onerror="this.src='/images/default-spice.jpg';"
          />
          <div class="product-info">
            <h3>${product.name}</h3>
            <div class="product-rating">
              <div class="stars">${stars}</div>
              <span class="rating-text">${rating.toFixed(1)} (<span class="reviews-link" onclick='showProductReviews("${product.name.replace(/"/g, '\\"')}", ${JSON.stringify(reviews).replace(/'/g, "\\'")})'>${reviews.length} reviews</span>)</span>
            </div>
            <p>${product.description || "No description available."}</p>
            <div class="product-price">$${product.price || "0.00"}</div>
            <button class="product-btn ${inCart ? 'remove-btn' : 'add-btn'}" onclick='handleAddToCart("${product.name.replace(/"/g, '\\"')}", ${JSON.stringify(product).replace(/'/g, "\\'")})'>
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
      loading.textContent = " Failed to load products. Please try again later.";
    }
  }
}

// --- 5️. WISHLIST MANAGEMENT ---
function getWishlist() {
  const wishlist = localStorage.getItem('wishlist');
  return wishlist ? JSON.parse(wishlist) : [];
}

function saveWishlist(wishlist) {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function addToWishlist(product) {
  const wishlist = getWishlist();
  const existingProduct = wishlist.find(item => item.name === product.name);
  if (!existingProduct) {
    wishlist.push(product);
    saveWishlist(wishlist);
    updateWishlistBadge();
    return true; // Added
  }
  return false; // Already in wishlist
}

function removeFromWishlist(productName) {
  const wishlist = getWishlist();
  const updatedWishlist = wishlist.filter(item => item.name !== productName);
  saveWishlist(updatedWishlist);
  updateWishlistBadge();
  fetchProducts(); // Re-render to update button states
  return updatedWishlist.length < wishlist.length; // Removed if length decreased
}

function isInWishlist(productName) {
  const wishlist = getWishlist();
  return wishlist.some(item => item.name === productName);
}

function updateWishlistBadge() {
  const wishlist = getWishlist();
  const badge = document.getElementById('wishlist-badge');
  if (badge) {
    badge.textContent = wishlist.length;
    if (wishlist.length === 0) {
      badge.classList.add('empty');
    } else {
      badge.classList.remove('empty');
    }
  }
}

// --- 6️. CART MANAGEMENT ---
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
    product.quantity = parseInt(newQuantity);
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
    
    // Add/remove classes
    if (totalItems === 0) {
      badge.classList.add('empty');
      badge.classList.remove('pulse');
    } else {
      badge.classList.remove('empty');
      badge.classList.add('pulse');
      
      // Remove pulse animation after it plays
      setTimeout(() => {
        badge.classList.remove('pulse');
      }, 600);
    }
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
    cartItemsDiv.innerHTML = `
      <div style="
        text-align: center;
        padding: 3rem;
        background: rgba(30, 41, 59, 0.3);
        border-radius: 15px;
        border: 2px dashed rgba(245, 158, 11, 0.3);
      ">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(245, 158, 11, 0.5)" stroke-width="1.5" style="margin: 0 auto 1rem;">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <h3 style="color: rgba(255,255,255,0.6); margin-bottom: 0.5rem;">Your cart is empty</h3>
        <p style="color: rgba(255,255,255,0.4); margin-bottom: 1.5rem;">Add some delicious spices to get started!</p>
        <button onclick="continueShopping()" class="btn btn-primary">Browse Products</button>
      </div>
    `;
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
      <div class="cart-item" style="
        display: flex;
        gap: 1.5rem;
        padding: 1.5rem;
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-radius: 15px;
        margin-bottom: 1rem;
        align-items: center;
      ">
        <img src="${item.image || '/images/default-spice.jpg'}" alt="${item.name}" style="
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 10px;
        " onerror="this.src='/images/default-spice.jpg';">
        
        <div style="flex: 1;">
          <h3 style="color: #fbbf24; margin-bottom: 0.5rem; font-size: 1.2rem;">${item.name}</h3>
          <p style="color: #f59e0b; font-size: 1.1rem; font-weight: bold;">$${(item.price || 0).toFixed(2)}</p>
        </div>
        
        <div style="display: flex; align-items: center; gap: 1rem;">
          <button onclick="updateQuantity('${item.name}', ${item.quantity - 1})" style="
            width: 35px;
            height: 35px;
            border: 2px solid #f59e0b;
            background: transparent;
            color: #f59e0b;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.2rem;
            font-weight: bold;
            transition: 0.3s;
          ">-</button>
          
          <span style="
            color: #fff;
            font-weight: bold;
            font-size: 1.1rem;
            min-width: 30px;
            text-align: center;
          ">${item.quantity}</span>
          
          <button onclick="updateQuantity('${item.name}', ${item.quantity + 1})" style="
            width: 35px;
            height: 35px;
            border: 2px solid #f59e0b;
            background: transparent;
            color: #f59e0b;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.2rem;
            font-weight: bold;
            transition: 0.3s;
          ">+</button>
        </div>
        
        <div style="text-align: right;">
          <p style="color: #fff; font-size: 1.1rem; font-weight: bold; margin-bottom: 0.5rem;">$${itemTotal.toFixed(2)}</p>
          <button onclick="removeFromCart('${item.name}')" style="
            padding: 0.6rem 1.2rem;
            border: 2px solid #dc2626;
            background: transparent;
            color: #dc2626;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: 0.3s;
          ">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  const shipping = subtotal > 0 ? 5.00 : 0.00;
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

// --- 6️. CART ICON NAVIGATION (FIX) ---
function openCartFromIcon(event) {
  event.preventDefault(); // Prevent default link behavior
  
  const cart = getCart();
  
  // Show the checkout wrapper section
  const checkoutWrapper = document.getElementById('checkout-wrapper');
  checkoutWrapper.style.display = 'block';
  
  // Make sure we're on step 1 (Shopping Cart)
  showCheckoutStep(1);
  
  // Update cart display
  displayCart();
  
  // Smooth scroll to the checkout section
  checkoutWrapper.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
}

// --- 7️. MULTI-STEP CHECKOUT FUNCTIONS ---
function showCheckoutStep(stepNumber) {
  // Hide all step contents
  for (let i = 1; i <= 3; i++) {
    const stepContent = document.getElementById(`step-content-${i}`);
    if (stepContent) {
      stepContent.style.display = 'none';
    }
  }
  
  // Show current step content
  const currentStepContent = document.getElementById(`step-content-${stepNumber}`);
  if (currentStepContent) {
    currentStepContent.style.display = 'block';
  }
  
  // Update step indicators
  updateStepIndicators(stepNumber);
}

function updateStepIndicators(stepNumber) {
  // Update step circles and labels
  for (let i = 1; i <= 3; i++) {
    const stepIndicator = document.getElementById(`step-indicator-${i}`);
    if (!stepIndicator) continue;
    
    const stepCircle = stepIndicator.querySelector('.step-circle');
    const stepLabel = stepIndicator.querySelector('span');
    
    if (i < stepNumber) {
      // Completed steps - Green
      stepCircle.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
      stepCircle.style.borderColor = '#22c55e';
      stepCircle.style.color = '#fff';
      stepLabel.style.color = '#22c55e';
    } else if (i === stepNumber) {
      // Current step - Orange
      stepCircle.style.background = 'linear-gradient(135deg, #f59e0b, #f97316)';
      stepCircle.style.borderColor = '#fbbf24';
      stepCircle.style.color = '#0a0a0a';
      stepLabel.style.color = '#fbbf24';
      stepCircle.classList.add('active');
    } else {
      // Future steps - Gray
      stepCircle.style.background = 'rgba(30, 41, 59, 0.8)';
      stepCircle.style.borderColor = 'rgba(245, 158, 11, 0.3)';
      stepCircle.style.color = 'rgba(255, 255, 255, 0.5)';
      stepLabel.style.color = 'rgba(255, 255, 255, 0.5)';
      stepCircle.classList.remove('active');
    }
  }
  
  // Update progress lines
  for (let i = 1; i <= 2; i++) {
    const lineProgress = document.getElementById(`line-progress-${i}`);
    if (lineProgress) {
      if (i < stepNumber) {
        lineProgress.style.width = '100%';
      } else {
        lineProgress.style.width = '0%';
      }
    }
  }
}

function goToCheckout() {
  const cart = getCart();
  
  // Check if cart is empty
  if (cart.length === 0) {
    alert('Your cart is empty! Please add some products first.');
    return;
  }
  
  showCheckoutStep(2);
  
  // Scroll to top of checkout
  document.getElementById('checkout-wrapper').scrollIntoView({ behavior: 'smooth' });
}

function goBackToCart() {
  showCheckoutStep(1);
  
  // Scroll to top of checkout
  document.getElementById('checkout-wrapper').scrollIntoView({ behavior: 'smooth' });
}

function continueShopping() {
  // Hide checkout wrapper and go back to products
  document.getElementById('checkout-wrapper').style.display = 'none';
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// --- 8️. HANDLE ADD/REMOVE FROM CART ---
function handleAddToCart(productName, product) {
  if (isInCart(productName)) {
    removeFromCart(productName);
    showToast(`${productName} removed from cart!`, 'info');
  } else {
    addToCart(product);
    showToast(`${productName} added to cart!`, 'success');
  }
  // Re-render products to update button states
  fetchProducts();
}

// --- 8️. HANDLE WISHLIST ---
function handleWishlist(productName, product) {
  if (isInWishlist(productName)) {
    removeFromWishlist(productName);
    showToast(`${productName} removed from wishlist!`, 'info');
  } else {
    addToWishlist(product);
    showToast(`${productName} added to wishlist!`, 'success');
  }
  // Re-render products to update button states
  fetchProducts();
}

// --- 8️. SHOW PRODUCT REVIEWS ---
function showProductReviews(productName, reviews) {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: linear-gradient(135deg, #1e293b, #0f172a);
    border: 2px solid rgba(245, 158, 11, 0.3);
    border-radius: 20px;
    padding: 2rem;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 20px 60px rgba(245, 158, 11, 0.2);
  `;

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.style.cssText = `
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(220, 38, 38, 0.8);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: bold;
    transition: 0.3s;
  `;
  closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(220, 38, 38, 1)';
  closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(220, 38, 38, 0.8)';
  closeBtn.onclick = () => modal.remove();

  // Modal header
  const header = document.createElement('h2');
  header.textContent = `Reviews for ${productName}`;
  header.style.cssText = `
    color: #fbbf24;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    text-align: center;
    border-bottom: 2px solid rgba(245, 158, 11, 0.3);
    padding-bottom: 1rem;
  `;

  // Reviews container
  const reviewsContainer = document.createElement('div');

  if (reviews && reviews.length > 0) {
    reviews.forEach(review => {
      const reviewCard = document.createElement('div');
      reviewCard.style.cssText = `
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(245, 158, 11, 0.2);
        border-radius: 15px;
        padding: 1.5rem;
        margin-bottom: 1rem;
      `;

      const reviewerName = document.createElement('div');
      reviewerName.textContent = review.reviewer || 'Anonymous';
      reviewerName.style.cssText = `
        color: #fbbf24;
        font-weight: bold;
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
      `;

      const reviewRating = document.createElement('div');
      reviewRating.innerHTML = generateStars(review.rating || 0);
      reviewRating.style.cssText = `
        color: #f59e0b;
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
      `;

      const reviewText = document.createElement('p');
      reviewText.textContent = review.comment || 'No comment provided.';
      reviewText.style.cssText = `
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
        margin-bottom: 0.5rem;
      `;

      const reviewDate = document.createElement('small');
      reviewDate.textContent = review.date ? new Date(review.date).toLocaleDateString() : '';
      reviewDate.style.cssText = `
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.9rem;
      `;

      reviewCard.appendChild(reviewerName);
      reviewCard.appendChild(reviewRating);
      reviewCard.appendChild(reviewText);
      reviewCard.appendChild(reviewDate);
      reviewsContainer.appendChild(reviewCard);
    });
  } else {
    const noReviews = document.createElement('div');
    noReviews.style.cssText = `
      text-align: center;
      padding: 3rem;
      color: rgba(255, 255, 255, 0.6);
    `;
    noReviews.innerHTML = `
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(245, 158, 11, 0.5)" stroke-width="1.5" style="margin: 0 auto 1rem;">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">No reviews yet</p>
      <p>Be the first to leave a review for this product!</p>
    `;
    reviewsContainer.appendChild(noReviews);
  }

  // Assemble modal
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(header);
  modalContent.appendChild(reviewsContainer);
  modal.appendChild(modalContent);

  // Add modal to page
  document.body.appendChild(modal);

  // Close modal when clicking outside
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  };

  // Close modal on Escape key
  document.addEventListener('keydown', function closeOnEscape(e) {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', closeOnEscape);
    }
  });
}

// --- 9️. TOAST NOTIFICATIONS ---
function showToast(message, type = 'success') {
  // Create toast element
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'linear-gradient(135deg, #f59e0b, #f97316)'};
    color: #fff;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(22, 163, 74, 0.4);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    font-weight: 600;
    max-width: 300px;
  `;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// --- 10. PAGE INITIALIZATION ---
document.addEventListener("DOMContentLoaded", function() {
  // Fetch products
  fetchProducts();

  // Display cart on page load
  displayCart();

  // Initialize cart badge
  updateCartBadge();

  // Initialize wishlist badge
  updateWishlistBadge();

  // Search functionality
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      searchProducts(e.target.value);
    });
  }

  // Category filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      // Filter products by category
      const category = this.getAttribute('data-category');
      filterProductsByCategory(category);
    });
  });

  // Checkout form submission
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Validate form
      const firstName = document.getElementById('first-name').value.trim();
      const lastName = document.getElementById('last-name').value.trim();
      const email = document.getElementById('email-checkout').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const address = document.getElementById('address').value.trim();
      const city = document.getElementById('city').value.trim();
      const zipcode = document.getElementById('zipcode').value.trim();
      const payment = document.getElementById('payment').value;

      if (!firstName || !lastName || !email || !phone || !address || !city || !zipcode || !payment) {
        alert('Please fill in all required fields.');
        return;
      }

      // Generate order number
      const orderNumber = '#SPH-' + Math.floor(100000 + Math.random() * 900000);
      const orderDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const orderTotal = document.getElementById('checkout-total').textContent;

      // Update order complete section
      document.getElementById('order-number').textContent = orderNumber;
      document.getElementById('order-date').textContent = orderDate;
      document.getElementById('order-total').textContent = orderTotal;

      // Show step 3 (Order Complete)
      showCheckoutStep(3);

      // Scroll to top of checkout
      document.getElementById('checkout-wrapper').scrollIntoView({ behavior: 'smooth' });

      // Clear cart after a delay to simulate processing
      setTimeout(() => {
        localStorage.removeItem('cart');
        updateCartBadge();
        fetchProducts();
      }, 2000);
    });
  }
});

// --- 1️1. CONTACT FORM HANDLER ---
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

// --- 1️4. SEARCH FUNCTIONALITY ---
let currentCategory = 'all'; // Track current category filter

function searchProducts(query) {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  // Get filtered products based on both search and category
  let filteredProducts = allProducts;

  // Apply category filter first
  if (currentCategory !== 'all') {
    filteredProducts = filteredProducts.filter(product =>
      product.category.toLowerCase() === currentCategory.toLowerCase()
    );
  }

  // Apply search filter
  if (query.trim()) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (filteredProducts.length === 0) {
    // No products found
    grid.innerHTML = `
      <div style="
        text-align: center;
        padding: 3rem;
        background: rgba(30, 41, 59, 0.3);
        border-radius: 15px;
        border: 2px dashed rgba(245, 158, 11, 0.3);
        grid-column: 1 / -1;
      ">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(245, 158, 11, 0.5)" stroke-width="1.5" style="margin: 0 auto 1rem;">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <h3 style="color: rgba(255,255,255,0.6); margin-bottom: 0.5rem;">No products found</h3>
        <p style="color: rgba(255,255,255,0.4); margin-bottom: 1.5rem;">Try searching for something else or <button onclick="clearSearch()" style="background: none; border: none; color: #fbbf24; text-decoration: underline; cursor: pointer;">clear search</button></p>
      </div>
    `;
  } else {
    // Render filtered products
    renderProducts(filteredProducts);
  }
}

function filterProductsByCategory(category) {
  currentCategory = category;
  const searchInput = document.getElementById('search-input');
  const query = searchInput ? searchInput.value : '';
  searchProducts(query);
}

function clearSearch() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.value = "";
    searchProducts(""); // This will render all products
  }
}

function renderProducts(products) {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  grid.innerHTML = products
    .map(
      (product) => {
        const inCart = isInCart(product.name);
        const inWishlist = isInWishlist(product.name);
        const rating = product.rating || 0;
        const reviews = product.reviews || [];
        const category = product.category || 'Uncategorized';
        const stars = generateStars(rating);
        return `
      <div class="product-card">
        <div class="product-category">${category}</div>
        <button class="wishlist-btn ${inWishlist ? 'in-wishlist' : ''}" onclick='handleWishlist("${product.name.replace(/"/g, '\\"')}", ${JSON.stringify(product).replace(/'/g, "\\'")})'>
          ${inWishlist ? '❤️' : '🤍'}
        </button>
        <img
          src="${product.image || "/images/default-spice.jpg"}"
          alt="${product.name}"
          class="product-image"
          style="width:100%; height:250px; object-fit:cover; border-radius:10px;"
          onerror="this.src='/images/default-spice.jpg';"
        />
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="product-rating">
            <div class="stars">${stars}</div>
            <span class="rating-text">${rating.toFixed(1)} (<span class="reviews-link" onclick='showProductReviews("${product.name.replace(/"/g, '\\"')}", ${JSON.stringify(reviews).replace(/'/g, "\\'")})'>${reviews.length} reviews</span>)</span>
          </div>
          <p>${product.description || "No description available."}</p>
          <div class="product-price">$${product.price || "0.00"}</div>
          <button class="product-btn ${inCart ? 'remove-btn' : 'add-btn'}" onclick='handleAddToCart("${product.name.replace(/"/g, '\\"')}", ${JSON.stringify(product).replace(/'/g, "\\'")})'>
            ${inCart ? 'Remove from Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    `;
      }
    )
    .join("");
}

// --- 1️2. FOOTER DYNAMIC YEAR ---
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// --- 1️3. ADD CSS ANIMATIONS ---
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);