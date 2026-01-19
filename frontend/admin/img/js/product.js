// Product management JavaScript
let products = [];
let currentProductId = null;
let isPreviewMode = false;

// API base URL
const API_BASE = 'http://localhost:5000/api';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Add product form
    const addForm = document.querySelector('#addModal form');
    if (addForm) {
        addForm.addEventListener('submit', handleAddProduct);
    }

    // Edit product form
    const editForm = document.querySelector('#editModal form');
    if (editForm) {
        editForm.addEventListener('submit', handleEditProduct);
    }

    // Search functionality
    const searchInput = document.querySelector('input[placeholder="Search products..."]');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Category filters
    const filterButtons = document.querySelectorAll('.bg-amber-100, .bg-gradient-to-r');
    filterButtons.forEach(button => {
        button.addEventListener('click', handleCategoryFilter);
    });
}

// Load products from API
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        if (!response.ok) throw new Error('Failed to load products');

        products = await response.json();
        renderProducts(products);
        updateStats(products);
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Failed to load products', 'error');
    }
}

// Render products to the grid
function renderProducts(productsToRender) {
    const grid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4');
    if (!grid) return;

    grid.innerHTML = '';

    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100';

    const stockStatus = getStockStatus(product.stock);
    const stockPercentage = Math.min((product.stock / 500) * 100, 100); // Assuming max stock is 500

    card.innerHTML = `
        <div class="relative">
            <div class="h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <img src="${product.image || 'img/logo.jpeg'}" alt="${product.name}" class="h-32 w-32 object-cover rounded-lg" onerror="this.src='img/logo.jpeg'">
            </div>
            <span class="badge absolute top-3 right-3 ${stockStatus.color} text-white px-3 py-1 rounded-full text-xs font-bold">${stockStatus.text}</span>
        </div>
        <div class="p-5">
            <div class="flex items-start justify-between mb-3">
                <div>
                    <h3 class="font-bold text-amber-900 text-lg mb-1">${product.name}</h3>
                    <p class="text-sm text-gray-600">${product.category}</p>
                </div>
                <span class="text-xl font-bold text-amber-700">$${product.price.toFixed(2)}</span>
            </div>
            <div class="mb-4">
                <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600">Stock:</span>
                    <span class="font-semibold ${stockStatus.textColor}">${product.stock} units</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-gradient-to-r ${stockStatus.barColor} h-2 rounded-full" style="width: ${stockPercentage}%"></div>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="editProduct('${product._id}')" class="flex-1 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-semibold hover:bg-amber-200 transition-colors">
                    <i class="fas fa-edit mr-1"></i> Edit
                </button>
                <button onclick="deleteProduct('${product._id}', '${product.name}')" class="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors" aria-label="Delete ${product.name}" title="Delete ${product.name}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;

    return card;
}

// Get stock status information
function getStockStatus(stock) {
    if (stock === 0) {
        return {
            text: 'Out of Stock',
            color: 'bg-red-500',
            textColor: 'text-red-600',
            barColor: 'from-red-500 to-red-600'
        };
    } else if (stock < 50) {
        return {
            text: 'Low Stock',
            color: 'bg-yellow-500',
            textColor: 'text-red-600',
            barColor: 'from-yellow-500 to-red-500'
        };
    } else {
        return {
            text: 'In Stock',
            color: 'bg-green-500',
            textColor: 'text-amber-900',
            barColor: 'from-amber-500 to-orange-500'
        };
    }
}

// Update statistics
function updateStats(products) {
    const totalProducts = products.length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock < 50).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const categories = [...new Set(products.map(p => p.category))].length;

    // Update stats cards
    const statsCards = document.querySelectorAll('.bg-white.rounded-2xl.shadow-lg.p-6.border');
    if (statsCards.length >= 4) {
        statsCards[0].querySelector('p.text-3xl').textContent = totalProducts;
        statsCards[1].querySelector('p.text-3xl').textContent = categories;
        statsCards[2].querySelector('p.text-3xl').textContent = lowStock;
        statsCards[3].querySelector('p.text-3xl').textContent = outOfStock;
    }
}

// Handle add product
async function handleAddProduct(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const response = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: formData
        });

        if (!response.ok) throw new Error('Failed to add product');

        const newProduct = await response.json();
        products.push(newProduct);
        renderProducts(products);
        updateStats(products);
        closeAddModal();
        showToast('Product added successfully!', 'success');
    } catch (error) {
        console.error('Error adding product:', error);
        showToast('Failed to add product', 'error');
    }
}

// Handle edit product
async function handleEditProduct(e) {
    e.preventDefault();

    if (!currentProductId) return;

    const formData = new FormData(e.target);

    try {
        const response = await fetch(`${API_BASE}/products/${currentProductId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: formData
        });

        if (!response.ok) throw new Error('Failed to update product');

        const updatedProduct = await response.json();
        const index = products.findIndex(p => p._id === currentProductId);
        if (index !== -1) {
            products[index] = updatedProduct;
        }
        renderProducts(products);
        updateStats(products);
        closeEditModal();
        showToast('Product updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating product:', error);
        showToast('Failed to update product', 'error');
    }
}

// Handle delete product
async function confirmDelete() {
    if (!currentProductId) return;

    try {
        const response = await fetch(`${API_BASE}/products/${currentProductId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (!response.ok) throw new Error('Failed to delete product');

        products = products.filter(p => p._id !== currentProductId);
        renderProducts(products);
        updateStats(products);
        closeDeleteModal();
        showToast('Product deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Failed to delete product', 'error');
    }
}

// Modal functions
function openAddModal() {
    document.getElementById('addModal').classList.add('active');
}

function closeAddModal() {
    document.getElementById('addModal').classList.remove('active');
    document.querySelector('#addModal form').reset();
}

function editProduct(productId) {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    currentProductId = productId;

    // Populate edit form
    document.getElementById('editProductName').value = product.name;
    document.querySelector('#editModal select[name="category"]').value = product.category;
    document.querySelector('#editModal input[name="price"]').value = product.price;
    document.querySelector('#editModal input[name="stock"]').value = product.stock;
    document.querySelector('#editModal textarea[name="description"]').value = product.description;
    document.querySelector('#editModal input[name="image"]').value = product.image || '';

    document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    currentProductId = null;
}

function deleteProduct(productId, productName) {
    currentProductId = productId;
    document.getElementById('deleteProductName').textContent = productName;
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    currentProductId = null;
}

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
}

// Category filter
function handleCategoryFilter(e) {
    const category = e.target.textContent.trim();
    let filteredProducts = products;

    if (category !== 'All Products') {
        filteredProducts = products.filter(product => product.category === category);
    }

    renderProducts(filteredProducts);
}

// Preview mode toggle
function togglePreviewMode() {
    isPreviewMode = !isPreviewMode;
    const btn = document.getElementById('previewBtn');

    if (isPreviewMode) {
        btn.innerHTML = '<i class="fas fa-times mr-2"></i>Exit Preview';
        btn.className = 'px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors';
        // Redirect to user store view
        window.open('../user/index.html', '_blank');
    } else {
        btn.innerHTML = '<i class="fas fa-eye mr-2"></i>Preview Store';
        btn.className = 'px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors';
    }
}

// Utility functions
function getAuthToken() {
    // Get token from localStorage or wherever it's stored
    return localStorage.getItem('adminToken') || '';
}

function showToast(message, type = 'info') {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-semibold z-50 ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
}
