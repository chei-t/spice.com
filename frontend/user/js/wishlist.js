
// ===============================
//  Wishlist Page Script
// ===============================

// --- 1️. WISHLIST DISPLAY FUNCTIONS ---
function displayWishlist() {
  const wishlist = getWishlist();
  const wishlistItemsDiv = document.getElementById('wishlist-items');
  const wishlistContainer = document.getElementById('wishlist-container');
  const emptyWishlistDiv = document.getElementById('empty-wishlist');
  const loadingDiv = document.getElementById('wishlist-loading');

  if (!wishlistItemsDiv || !wishlistContainer || !emptyWishlistDiv || !loadingDiv) return;

  // Hide loading
  loadingDiv.style.display = 'none';

  if (wishlist.length === 0) {
    wishlistContainer.style.display = 'none';
    emptyWishlistDiv.style.display = 'block';
    return;
  }

  // Show wishlist container
  wishlistContainer.style.display = 'block';
  emptyWishlistDiv.style.display = 'none';

  // Render wishlist items
  wishlistItemsDiv.innerHTML = wishlist
    .map(
      (product) => {
        const rating = product.rating || 0;
        const reviews = product.reviews || [];
        const category = product.category || 'Uncategorized';
        const stars = generateStars(rating);

        return `
        <div class="wishlist-item" style="
          background: rgba(30, 41, 59, 0.35);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 20px;
          padding: 2rem;
          transition: 0.4s ease;
          position: relative;
          cursor: pointer;
          overflow: hidden;
          margin-bottom: 1.5rem;
        ">
          <div class="product-category" style="
            position: absolute;
            top: 10px;
            right: 10px;
            background: linear-gradient(135deg, #f59e0b, #f97316);
            color: #0a0a0a;
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          ">${category}</div>

          <!-- Remove from Wishlist Button -->
          <button class="wishlist-btn in-wishlist" onclick='removeFromWishlist("${product.name.replace(/"/g, '\\"')}")' style="
            position: absolute;
            top: 10px;
            left: 10px;
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            border: 2px solid #dc2626;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            z-index: 10;
            color: #fff;
          " onmouseover="this.style.background='linear-gradient(135deg, #b91c1c, #991b1b)'" onmouseout="this.style.background='linear-gradient(135deg, #dc2626, #b91c1c)'">
            ❤️
          </button>

          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; align-items: center;">
            <img
              src="${product.image || "/images/default-spice.jpg"}"
              alt="${product.name}"
              style="
                width: 100%;
                height: 200px;
                object-fit: cover;
                border-radius: 15px;
                transition: transform 0.3s ease;
              "
              onmouseover="this.style.transform='scale(1.05)'"
              onmouseout="this.style.transform='scale(1)'"
              onerror="this.src='/images/default-spice.jpg';"
            />

            <div class="product-info">
              <h3 style="font-size: 1.8rem; color: #fbbf24; margin-bottom: 1rem;">${product.name}</h3>

              <div class="product-rating" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                <div class="stars" style="color: #fbbf24; font-size: 1.2rem; letter-spacing: 2px;">${stars}</div>
                <span class="rating-text" style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;">${rating.toFixed(1)} (${reviews.length} reviews)</span>
              </div>

              <p style="color: rgba(255, 255, 255, 0.8); line-height: 1.6; margin-bottom: 1.5rem;">${product.description || "No description available."}</p>

              <div class="product-price" style="font-size: 1.8rem; color: #f59e0b; margin-bottom: 1rem;">$${product.price || "0.00"}</div>

              <div style="display: flex; gap: 1rem;">
                <button class="product-btn add-btn" onclick='handleAddToCart("${product.name.replace(/"/g, '\\"')}", ${JSON.stringify(product).replace(/'/g, "\\'")})' style="
                  flex: 1;
                  padding: 1rem;
                  border: 2px solid #f59e0b;
                  color: #0a0a0a;
                  background: linear-gradient(135deg, #f59e0b, #f97316);
                  border-radius: 50px;
                  cursor: pointer;
                  transition: 0.3s;
                  font-weight: bold;
                " onmouseover="this.style.background='linear-gradient(135deg, #d97706, #ea580c)'" onmouseout="this.style.background='linear-gradient(135deg, #f59e0b, #f97316)'">
                  Add to Cart
                </button>

                <button onclick='removeFromWishlist("${product.name.replace(/"/g, '\\"')}")' style="
                  padding: 1rem 1.5rem;
                  border: 2px solid #dc2626;
                  background: transparent;
                  color: #dc2626;
                  border-radius: 50px;
                  cursor: pointer;
                  transition: 0.3s;
                  font-weight: bold;
                " onmouseover="this.style.background='#dc2626'; this.style.color='#fff'" onmouseout="this.style.background='transparent'; this.style.color='#dc2626'">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      }
    )
    .join("");
}

// --- 2️. CLEAR WISHLIST FUNCTION ---
function clearWishlist() {
  if (confirm('Are you sure you want to clear your entire wishlist?')) {
    localStorage.removeItem('wishlist');
    updateWishlistBadge();
    displayWishlist();
    showToast('Wishlist cleared!', 'info');
  }
}

// --- 3️. CONTINUE SHOPPING FUNCTION ---
function continueShopping() {
  window.location.href = 'index.html#products';
}

// --- 4️. PAGE INITIALIZATION ---
document.addEventListener("DOMContentLoaded", function() {
  // Load user auth
  loadUserAuth();

  // Initialize mobile menu
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Initialize badges
  updateCartBadge();
  updateWishlistBadge();

  // Display wishlist
  displayWishlist();

  // Footer dynamic year
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// --- 5️. GENERATE STAR RATINGS (DUPLICATE FROM index.js) ---
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

// --- 6️. TOAST NOTIFICATIONS (DUPLICATE FROM index.js) ---
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

// --- 7️. ADD CSS ANIMATIONS ---
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
