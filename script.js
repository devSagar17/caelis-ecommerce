// Product data - initially empty, will be populated from backend API
let products = [];

// Fetch products from backend API
async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    const data = await response.json();
    
    if (data.success && data.products) {
      // Convert backend product format to frontend format
      products = data.products.map(product => ({
        id: product._id,
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image
      }));
      console.log('Products loaded:', products);
    } else {
      console.error('Failed to load products:', data.message);
      // Fallback to sample data if API fails
      products = [
        { id: 1, name: "Chunky Sneakers", price: 120, category: "footwear", image: "images/products/sneakers/chunky-sneakers.jpg" },
        { id: 2, name: "Oversized Jacket", price: 150, category: "clothing", image: "images/products/clothing/oversized-jacket.jpg" },
        { id: 3, name: "Leather Purse", price: 99, category: "accessories", image: "images/products/purses/leather-purse.jpg" },
        { id: 4, name: "Minimal Watch", price: 80, category: "accessories", image: "images/products/watches/minimal-watch.jpg" },
        { id: 5, name: "Street Hoodie", price: 70, category: "clothing", image: "images/products/clothing/street-hoodie.jpg" },
        { id: 6, name: "Ripped Jeans", price: 60, category: "clothing", image: "images/products/clothing/ripped-jeans.jpg" },
        { id: 7, name: "Canvas Sneakers", price: 85, category: "footwear", image: "images/products/sneakers/canvas-sneakers.jpg" },
        { id: 8, name: "Luxury Watch", price: 199, category: "accessories", image: "images/products/watches/luxury-watch.jpg" },
        { id: 9, name: "Crossbody Purse", price: 130, category: "accessories", image: "images/products/purses/crossbody-purse.jpg" },
        { id: 10, name: "Gen-Z Shades", price: 50, category: "accessories", image: "images/products/genz-shades.jpg" },
        { id: 11, name: "Retro Print Tee", price: 40, category: "clothing", image: "images/products/clothing/retro-print-tee.jpg" },
        { id: 12, name: "Anime Graphic Tee", price: 45, category: "clothing", image: "images/products/clothing/anime-graphic-tee.jpg" },
        { id: 13, name: "Minimal Logo Tee", price: 35, category: "clothing", image: "images/products/clothing/minimal-logo-tee.jpg" }
      ];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to sample data if API fails
    products = [
      { id: 1, name: "Chunky Sneakers", price: 120, category: "footwear", image: "images/products/sneakers/chunky-sneakers.jpg" },
      { id: 2, name: "Oversized Jacket", price: 150, category: "clothing", image: "images/products/clothing/oversized-jacket.jpg" },
      { id: 3, name: "Leather Purse", price: 99, category: "accessories", image: "images/products/purses/leather-purse.jpg" },
      { id: 4, name: "Minimal Watch", price: 80, category: "accessories", image: "images/products/watches/minimal-watch.jpg" },
      { id: 5, name: "Street Hoodie", price: 70, category: "clothing", image: "images/products/clothing/street-hoodie.jpg" },
      { id: 6, name: "Ripped Jeans", price: 60, category: "clothing", image: "images/products/clothing/ripped-jeans.jpg" },
      { id: 7, name: "Canvas Sneakers", price: 85, category: "footwear", image: "images/products/sneakers/canvas-sneakers.jpg" },
      { id: 8, name: "Luxury Watch", price: 199, category: "accessories", image: "images/products/watches/luxury-watch.jpg" },
      { id: 9, name: "Crossbody Purse", price: 130, category: "accessories", image: "images/products/purses/crossbody-purse.jpg" },
      { id: 10, name: "Gen-Z Shades", price: 50, category: "accessories", image: "images/products/genz-shades.jpg" },
      { id: 11, name: "Retro Print Tee", price: 40, category: "clothing", image: "images/products/clothing/retro-print-tee.jpg" },
      { id: 12, name: "Anime Graphic Tee", price: 45, category: "clothing", image: "images/products/clothing/anime-graphic-tee.jpg" },
      { id: 13, name: "Minimal Logo Tee", price: 35, category: "clothing", image: "images/products/clothing/minimal-logo-tee.jpg" }
    ];
  }
}

// Utility function to sanitize user inputs
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  // Remove potentially dangerous characters
  return input.replace(/[^a-zA-Z0-9@._\-\s]/g, '').trim();
}

// Utility function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Utility function to validate phone number format
function isValidPhone(phone) {
  const phoneRegex = /^[+]?[0-9\s\-\(\)]{7,15}$/;
  return phoneRegex.test(phone);
}

// Slider functionality
let currentIndex = 0;
const slides = document.querySelector('.slides');
const slideCount = document.querySelectorAll('.slide').length;

function showSlide(index) {
  if (!slides) return;
  
  if (index >= slideCount) currentIndex = 0;
  else if (index < 0) currentIndex = slideCount - 1;
  else currentIndex = index;

  slides.style.transform = `translateX(-${currentIndex * 100}%)`;
}

document.addEventListener('DOMContentLoaded', async function() {
  console.log("DOM loaded, initializing components...");
  
  // Fetch products from backend
  await fetchProducts();
  
  // Test: Log all category cards immediately
  console.log("Testing category card detection:");
  const testCategoryCards = document.querySelectorAll('.category-card');
  console.log("Found category cards:", testCategoryCards.length);
  testCategoryCards.forEach((card, index) => {
    console.log(`Card ${index}:`, card.dataset.category);
  });
  
  // Add event listeners for slider controls
  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentIndex + 1);
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentIndex - 1);
    });
  }
  
  // Set up automatic sliding
  setInterval(() => {
    showSlide(currentIndex + 1);
  }, 4000);
  
  // Initialize category filtering with a slight delay to ensure all elements are loaded
  setTimeout(() => {
    console.log("About to initialize category filtering...");
    initializeCategoryFiltering();
    console.log("Category filtering initialized.");
  }, 100);
  
  // Add event listeners to "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const productId = productCard.dataset.id;
      const productName = productCard.dataset.name;
      const productPrice = productCard.dataset.price;
      
      addToCart(productId, productName, productPrice);
      
      // Visual feedback
      this.textContent = 'Added!';
      this.style.backgroundColor = '#4CAF50';
      
      setTimeout(() => {
        this.textContent = 'Add to Cart';
        this.style.backgroundColor = '#f15a24';
      }, 1000);
    });
  });
});

// Shopping Cart functionality
let cart = [];
let cartCount = 0;

// Toggle cart visibility
function toggleCart() {
  const cartSidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  
  cartSidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

// Add to cart function with input validation
function addToCart(productId, productName, productPrice) {
  // Validate inputs
  if (!productId || !productName || !productPrice) {
    console.error('Invalid product data');
    return;
  }
  
  // Sanitize inputs
  const sanitizedProductId = String(productId).trim();
  const sanitizedName = String(productName).trim().substring(0, 100);
  const sanitizedPrice = parseFloat(productPrice);
  
  // Validate price
  if (isNaN(sanitizedPrice) || sanitizedPrice <= 0) {
    console.error('Invalid product price');
    return;
  }
  
  // Check if product already in cart
  const existingItem = cart.find(item => item.id === sanitizedProductId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: sanitizedProductId,
      name: sanitizedName,
      price: sanitizedPrice,
      quantity: 1
    });
  }
  
  cartCount++;
  updateCartUI();
}

// Update cart UI
function updateCartUI() {
  // Update cart count
  const cartCountElement = document.getElementById('cartCount');
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
  
  // Update cart items display
  const cartItemsContainer = document.getElementById('cartItems');
  if (!cartItemsContainer) return;
  
  cartItemsContainer.innerHTML = '';
  
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'cart-item';
    cartItemElement.innerHTML = `
      <img src="images/products/${getProductImageFolder(item.name)}/${item.name.toLowerCase().replace(/ /g, '-')}.jpg" alt="${escapeHtml(item.name)}">
      <div class="item-details">
        <h4>${escapeHtml(item.name)}</h4>
        <p class="item-price">$${item.price.toFixed(2)}</p>
        <div class="item-quantity">
          <button onclick="changeQuantity('${escapeHtml(item.id)}', -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity('${escapeHtml(item.id)}', 1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart('${escapeHtml(item.id)}')">Remove</button>
    `;
    
    cartItemsContainer.appendChild(cartItemElement);
  });
  
  // Update total
  const cartTotalElement = document.getElementById('cartTotal');
  if (cartTotalElement) {
    cartTotalElement.textContent = total.toFixed(2);
  }
}

// Utility function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return String(text).replace(/[&<>'"]/g, function(m) { return map[m]; });
}

// Utility function to get product image folder based on product name
function getProductImageFolder(productName) {
  const watches = ['Minimal Watch', 'Luxury Watch'];
  const purses = ['Leather Purse', 'Crossbody Purse'];
  const sneakers = ['Chunky Sneakers', 'Canvas Sneakers'];
  const clothing = ['Oversized Jacket', 'Street Hoodie', 'Ripped Jeans', 'Retro Print Tee', 'Anime Graphic Tee', 'Minimal Logo Tee'];
  
  if (watches.includes(productName)) return 'watches';
  if (purses.includes(productName)) return 'purses';
  if (sneakers.includes(productName)) return 'sneakers';
  if (clothing.includes(productName)) return 'clothing';
  
  // Default folder
  return '';
}

// Change item quantity
function changeQuantity(productId, change) {
  // Validate inputs
  if (!productId || isNaN(change)) {
    console.error('Invalid input for changeQuantity');
    return;
  }
  
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    item.quantity += change;
    
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      cartCount += change;
      updateCartUI();
    }
  }
}

// Remove item from cart
function removeFromCart(productId) {
  // Validate input
  if (!productId) {
    console.error('Invalid productId for removeFromCart');
    return;
  }
  
  const itemIndex = cart.findIndex(item => item.id === productId);
  
  if (itemIndex !== -1) {
    cartCount -= cart[itemIndex].quantity;
    cart.splice(itemIndex, 1);
    updateCartUI();
  }
}

// Proceed to checkout
function proceedToCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  
  // Close cart and open checkout
  toggleCart();
  openCheckout();
  
  // Populate order summary
  populateOrderSummary();
}

// Open checkout modal
function openCheckout() {
  const checkoutModal = document.getElementById('checkoutModal');
  checkoutModal.classList.add('active');
  
  // Reset to first step
  showStep(1);
}

// Close checkout modal
function closeCheckout() {
  const checkoutModal = document.getElementById('checkoutModal');
  checkoutModal.classList.remove('active');
  
  // Reset form
  document.getElementById('shippingForm').reset();
  
  // Reset to first step
  showStep(1);
}

// Show specific checkout step
function showStep(stepNumber) {
  // Hide all steps
  document.querySelectorAll('.checkout-step').forEach(step => {
    step.classList.remove('active');
  });
  
  // Remove active class from all steps
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active');
  });
  
  // Show selected step
  document.getElementById(['shippingStep', 'paymentStep', 'confirmationStep'][stepNumber - 1]).classList.add('active');
  
  // Activate step indicator
  document.getElementById(['step1', 'step2', 'step3'][stepNumber - 1]).classList.add('active');
}

// Navigate to next step with enhanced validation
function nextStep(currentStep) {
  if (currentStep === 1) {
    // Validate shipping form
    const shippingForm = document.getElementById('shippingForm');
    
    // Get all required fields
    const fullName = shippingForm.querySelector('input[placeholder="Full Name"]');
    const email = shippingForm.querySelector('input[placeholder="Email"]');
    const address = shippingForm.querySelector('input[placeholder="Address"]');
    const city = shippingForm.querySelector('input[placeholder="City"]');
    const zipCode = shippingForm.querySelector('input[placeholder="ZIP Code"]');
    const country = document.getElementById('countrySelect');
    const phone = shippingForm.querySelector('input[placeholder="Phone"]');
    
    // Check if all required fields are filled
    if (!fullName.value || !email.value || !address.value || 
        !city.value || !zipCode.value || !country.value || !phone.value) {
      alert("Please fill in all required shipping fields.");
      return;
    }
    
    // Sanitize inputs using our utility function
    const sanitizedFullName = sanitizeInput(fullName.value).substring(0, 100);
    const sanitizedAddress = sanitizeInput(address.value).substring(0, 200);
    const sanitizedCity = sanitizeInput(city.value).substring(0, 50);
    const sanitizedZipCode = sanitizeInput(zipCode.value).substring(0, 20);
    const sanitizedPhone = sanitizeInput(phone.value).substring(0, 20);
    const sanitizedEmail = sanitizeInput(email.value);
    
    // Validate email format using our utility function
    if (!isValidEmail(sanitizedEmail)) {
      alert("Please enter a valid email address.");
      return;
    }
    
    // Validate ZIP code (simple validation)
    const zipRegex = /^[A-Za-z0-9\s\-]{3,10}$/;
    if (!zipRegex.test(sanitizedZipCode)) {
      alert("Please enter a valid ZIP/Postal code.");
      return;
    }
    
    // Validate phone number using our utility function
    if (!isValidPhone(sanitizedPhone)) {
      alert("Please enter a valid phone number.");
      return;
    }
    
    // If country is India, validate Indian fields
    if (country.value === 'india') {
      const state = document.getElementById('stateSelect');
      if (!state.value) {
        alert("Please select a state.");
        return;
      }
    }
    
    showStep(2);
  } else if (currentStep === 2) {
    showStep(3);
  }
}

// Navigate to previous step
function prevStep(currentStep) {
  if (currentStep === 2) {
    showStep(1);
  } else if (currentStep === 3) {
    showStep(2);
  }
}

// Toggle Indian fields based on country selection
function toggleIndianFields() {
  const country = document.getElementById('countrySelect').value;
  const indianFields = document.getElementById('indianFields');
  
  if (country === 'india') {
    indianFields.style.display = 'flex';
  } else {
    indianFields.style.display = 'none';
  }
}

// Select payment method
function selectPaymentMethod(method) {
  // Remove active class from all payment methods
  document.querySelectorAll('.payment-method').forEach(pm => {
    pm.classList.remove('active');
  });
  
  // Add active class to selected method
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }
  
  // Hide all payment forms
  document.getElementById('creditCardForm').style.display = 'none';
  document.getElementById('razorpayForm').style.display = 'none';
  document.getElementById('upiForm').style.display = 'none';
  
  // Show selected payment form
  if (method === 'credit') {
    document.getElementById('creditCardForm').style.display = 'block';
  } else if (method === 'razorpay') {
    document.getElementById('razorpayForm').style.display = 'block';
  } else if (method === 'upi') {
    document.getElementById('upiForm').style.display = 'block';
    // Update QR code amount
    const summaryTotal = document.getElementById('summaryTotal');
    if (summaryTotal) {
      document.getElementById('qrAmount').textContent = summaryTotal.textContent;
    }
  }
}

// Populate order summary
function populateOrderSummary() {
  const summaryItems = document.getElementById('summaryItems');
  summaryItems.innerHTML = '';
  
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const summaryItem = document.createElement('div');
    summaryItem.className = 'summary-item';
    summaryItem.innerHTML = `
      <span>${escapeHtml(item.name)} x ${item.quantity}</span>
      <span>$${itemTotal.toFixed(2)}</span>
    `;
    
    summaryItems.appendChild(summaryItem);
  });
  
  document.getElementById('summaryTotal').textContent = total.toFixed(2);
}

// Simulate QR code scanning
function simulateQRScan() {
  alert("In a real application, this would open your camera to scan the QR code.\n\nFor demo purposes, we'll simulate a successful scan.");
  
  // Process UPI payment
  processPayment();
}

// Process payment
function processPayment() {
  // Get selected payment method
  const selectedMethod = document.querySelector('.payment-method.active');
  let methodName = 'Credit/Debit Card';
  let transactionId = '';
   
  if (selectedMethod) {
    if (selectedMethod.querySelector('i').classList.contains('fa-money-bill-wave')) {
      methodName = 'Razorpay';
      // Process Razorpay payment through backend
      processRazorpayPayment();
      return;
    } else if (selectedMethod.querySelector('i').classList.contains('fa-mobile-alt')) {
      methodName = 'UPI (Google Pay/PhonePe)';
      // Process UPI payment
      processUPIPayment();
      return;
    }
  }
  
  // For credit card payment, validate form first
  const paymentForm = document.getElementById('paymentForm');
  if (paymentForm.checkValidity()) {
    // Generate transaction ID for credit card
    transactionId = 'cc_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    completePayment(methodName, transactionId);
  } else {
    alert("Please fill in all required payment details");
  }
}

// Process UPI payment
function processUPIPayment() {
  // Get UPI ID from form
  const upiId = document.querySelector('#upiFormFields input[type="text"]').value;
  
  if (!upiId) {
    alert("Please enter your UPI ID");
    return;
  }
  
  // Sanitize UPI ID
  const sanitizedUpiId = sanitizeInput(upiId);
  
  // Validate UPI ID format using our utility function
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
  if (!upiRegex.test(sanitizedUpiId)) {
    alert("Please enter a valid UPI ID (e.g., username@upi)");
    return;
  }
  
  // Simulate UPI payment processing
  alert(`Sending payment request to ${sanitizedUpiId}. Please check your UPI app to complete the payment.`);
  
  // Generate transaction ID
  const transactionId = 'upi_' + Math.random().toString(36).substr(2, 9).toUpperCase();
  
  // Complete payment
  completePayment('UPI (Google Pay/PhonePe)', transactionId);
}

// Process Razorpay payment through backend
async function processRazorpayPayment() {
  try {
    // Get the total amount
    const amount = parseFloat(document.getElementById('summaryTotal').textContent);
    
    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid amount for payment");
      return;
    }
    
    // Create order on backend
    const response = await fetch('http://localhost:3000/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'INR',
        receipt: `order_${Date.now()}`
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Create Razorpay options with order details
      var options = {
        "key": "rzp_test_Ro0jzRtEDYw8vg", // This is public key, safe to use in frontend
        "amount": result.order.amount.toString(),
        "currency": result.order.currency,
        "name": "Caelis Clothing",
        "description": "Purchase Description",
        "image": "https://via.placeholder.com/100x100/222/fff?text=Caelis",
        "order_id": result.order.id,
        "handler": function (response){
          // Verify payment on backend
          verifyPayment(response);
        },
        "prefill": {
          "name": document.querySelector('#shippingForm input[placeholder="Full Name"]').value,
          "email": document.querySelector('#shippingForm input[placeholder="Email"]').value,
          "contact": document.querySelector('#shippingForm input[placeholder="Phone"]').value
        },
        "notes": {
          "address": "Hello World"
        },
        "theme": {
          "color": "#f15a24"
        }
      };
      
      // Create Razorpay instance and open checkout
      var rzp = new Razorpay(options);
      rzp.open();
    } else {
      alert("Failed to create order: " + result.message);
    }
  } catch (error) {
    console.error('Error processing Razorpay payment:', error);
    alert("Failed to process payment. Please try again.");
  }
}

// Verify payment on backend
async function verifyPayment(paymentResponse) {
  try {
    // Validate payment response
    if (!paymentResponse || !paymentResponse.razorpay_order_id || 
        !paymentResponse.razorpay_payment_id || !paymentResponse.razorpay_signature) {
      alert("Invalid payment response");
      return;
    }
    
    // Send payment details to backend for verification
    const response = await fetch('http://localhost:3000/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Payment verified successfully
      completePayment('Razorpay', paymentResponse.razorpay_payment_id);
    } else {
      alert("Payment verification failed: " + result.message);
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    alert("Failed to verify payment. Please contact support.");
  }
}

// Complete payment and show confirmation
function completePayment(methodName, transactionId) {
  // Update confirmation details
  document.getElementById('paymentMethod').textContent = methodName;
  document.getElementById('finalAmount').textContent = '$' + document.getElementById('summaryTotal').textContent;
  
  // Show transaction ID if available
  if (transactionId) {
    document.getElementById('transactionId').textContent = transactionId;
    document.getElementById('transactionIdRow').style.display = 'flex';
  }
  
  // Get shipping info
  const shippingForm = document.getElementById('shippingForm');
  const email = shippingForm.querySelector('input[placeholder="Email"]').value;
  const fullName = shippingForm.querySelector('input[placeholder="Full Name"]').value;
  const address = shippingForm.querySelector('input[placeholder="Address"]').value;
  const city = shippingForm.querySelector('input[placeholder="City"]').value;
  const zipCode = shippingForm.querySelector('input[placeholder="ZIP Code"]').value;
  const country = document.getElementById('countrySelect').value;
  
  let fullAddress = `${address}, ${city}, ${zipCode}`;
  if (country === 'india') {
    const state = document.getElementById('stateSelect').value;
    fullAddress += `, ${state}`;
  }
  fullAddress += `, ${country.toUpperCase()}`;
  
  document.getElementById('customerEmail').textContent = email;
  document.getElementById('shippingAddress').textContent = fullAddress;
  
  // Show confirmation step
  showStep(3);
  
  // Clear cart after successful payment
  cart = [];
  cartCount = 0;
  updateCartUI();
}

// Search functionality
function toggleSearch() {
  const searchOverlay = document.getElementById('searchOverlay');
  searchOverlay.classList.toggle('active');
  
  if (searchOverlay.classList.contains('active')) {
    document.getElementById('searchInput').focus();
  }
}

function filterProducts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const searchResults = document.getElementById('searchResults');
  
  if (searchTerm.length === 0) {
    searchResults.innerHTML = '';
    return;
  }
  
  // Sanitize search term
  const sanitizedSearchTerm = searchTerm.trim().substring(0, 50);
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(sanitizedSearchTerm)
  );
  
  if (filteredProducts.length === 0) {
    searchResults.innerHTML = '<p>No products found</p>';
    return;
  }
  
  let resultsHTML = '';
  filteredProducts.forEach(product => {
    resultsHTML += `
      <div class="search-result-item" onclick="selectProduct(${escapeHtml(product.id)})">
        <img src="${product.image}" alt="${escapeHtml(product.name)}">
        <div class="search-result-info">
          <h4>${escapeHtml(product.name)}</h4>
          <p>$${product.price}</p>
        </div>
      </div>
    `;
  });
  
  searchResults.innerHTML = resultsHTML;
}

function selectProduct(productId) {
  // Find product and scroll to it
  const product = products.find(p => p.id === productId);
  if (product) {
    // Close search
    toggleSearch();
    
    // In a real implementation, we would scroll to the product
    // For now, we'll just show an alert and add to cart
    alert(`Selected: ${product.name}\nAdding to cart!`);
    
    // Add product to cart
    addToCart(product.id, product.name, product.price);
  }
}

// Account functionality
function toggleAccount() {
  const accountModal = document.getElementById('accountModal');
  accountModal.classList.toggle('active');
}

// Switch tab function
function switchTab(tabName) {
  // Hide both forms
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'none';
  
  // Remove active class from all tabs
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  // Show selected form and activate tab
  if (tabName === 'login') {
    document.getElementById('loginForm').style.display = 'block';
    const loginBtn = document.querySelector('.tab-btn:nth-child(1)');
    if (loginBtn) loginBtn.classList.add('active');
  } else {
    document.getElementById('registerForm').style.display = 'block';
    const registerBtn = document.querySelector('.tab-btn:nth-child(2)');
    if (registerBtn) registerBtn.classList.add('active');
  }
}

// Filtering functionality
function filterByCategory() {
  const category = document.getElementById('categoryFilter').value;
  const price = document.getElementById('priceFilter').value;
  applyFilters(category, price);
  reattachAddToCartListeners();
}

function filterByPrice() {
  const category = document.getElementById('categoryFilter').value;
  const price = document.getElementById('priceFilter').value;
  applyFilters(category, price);
  reattachAddToCartListeners();
}

function resetFilters() {
  document.getElementById('categoryFilter').value = 'all';
  document.getElementById('priceFilter').value = 'all';
  applyFilters('all', 'all');
  reattachAddToCartListeners();
}

// Apply filters to products
function applyFilters(category, price) {
  try {
    // Target all product cards on the page, not just those in #productGrid
    const productCards = document.querySelectorAll('.product-card');
    console.log(`Applying filters - Category: ${category}, Price: ${price}, Found ${productCards.length} products`);
    
    let visibleCount = 0;
    
    productCards.forEach(card => {
      const productCategory = card.dataset.category;
      const productPrice = parseFloat(card.dataset.price);
      
      let showByCategory = category === 'all' || productCategory === category;
      
      let showByPrice = false;
      if (price === 'all') {
        showByPrice = true;
      } else if (price === '0-50') {
        showByPrice = productPrice <= 50;
      } else if (price === '50-100') {
        showByPrice = productPrice > 50 && productPrice <= 100;
      } else if (price === '100+') {
        showByPrice = productPrice > 100;
      }
      
      if (showByCategory && showByPrice) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    console.log(`Filtered products - ${visibleCount} products visible`);
  } catch (error) {
    console.error("Error applying filters:", error);
  }
}

// Reattach event listeners to "Add to Cart" buttons after filtering
function reattachAddToCartListeners() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  
  addToCartButtons.forEach(button => {
    // Remove existing event listeners to prevent duplicates
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // Add new event listener
    newButton.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const productId = productCard.dataset.id;
      const productName = productCard.dataset.name;
      const productPrice = productCard.dataset.price;
      
      addToCart(productId, productName, productPrice);
      
      // Visual feedback
      this.textContent = 'Added!';
      this.style.backgroundColor = '#4CAF50';
      
      setTimeout(() => {
        this.textContent = 'Add to Cart';
        this.style.backgroundColor = '#f15a24';
      }, 1000);
    });
  });
}

// Add event listeners for category cards
function initializeCategoryFiltering() {
  try {
    console.log("Initializing category filtering...");
    const categoryCards = document.querySelectorAll('.category-card');
    console.log("Found category cards:", categoryCards.length);
    
    if (categoryCards.length === 0) {
      console.warn("No category cards found in the DOM");
      return;
    }
    
    categoryCards.forEach((card, index) => {
      console.log(`Adding event listener to card ${index}:`, card);
      card.addEventListener('click', function(e) {
        e.preventDefault();
        console.log("Category card clicked:", this);
        const category = this.dataset.category;
        console.log("Selected category:", category);
        
        if (category !== undefined) {
          // Update the category filter dropdown
          const categoryFilter = document.getElementById('categoryFilter');
          if (categoryFilter) {
            categoryFilter.value = category;
            console.log("Updated category filter to:", category);
          }
          
          // Apply filters
          const priceFilter = document.getElementById('priceFilter');
          const price = priceFilter ? priceFilter.value : 'all';
          console.log("Applying filters - category:", category, "price:", price);
          applyFilters(category, price);
          reattachAddToCartListeners();
        } else {
          console.warn("No category data found on clicked card");
        }
      });
    });
  } catch (error) {
    console.error("Error initializing category filtering:", error);
  }
}

// Filter products by category type (used by category cards)
function filterByCategoryType(category) {
  console.log("Filtering by category type:", category);
  
  // Update the category filter dropdown
  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) {
    categoryFilter.value = category;
    console.log("Updated category filter dropdown to:", category);
  }
  
  // Apply filters
  const priceFilter = document.getElementById('priceFilter');
  const price = priceFilter ? priceFilter.value : 'all';
  console.log("Applying filters - category:", category, "price:", price);
  applyFilters(category, price);
  reattachAddToCartListeners();
}

// Subscribe to newsletter
function subscribeToNewsletter() {
  const emailInput = document.getElementById('newsletterEmail');
  const subscribeBtn = document.getElementById('subscribeBtn');
  const messageElement = document.getElementById('subscriptionMessage');
  
  const email = emailInput.value.trim();
  
  // Validate email
  if (!email) {
    showMessage('Please enter your email address.', 'error');
    return;
  }
  
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage('Please enter a valid email address.', 'error');
    return;
  }
  
  // Disable button and show loading state
  subscribeBtn.disabled = true;
  subscribeBtn.textContent = 'Subscribing...';
  
  // Send subscription request to backend
  fetch('http://localhost:3000/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showMessage('Thank you for subscribing!', 'success');
      emailInput.value = '';
    } else {
      showMessage(data.message || 'Failed to subscribe. Please try again.', 'error');
    }
  })
  .catch(error => {
    console.error('Subscription error:', error);
    showMessage('Network error. Please try again.', 'error');
  })
  .finally(() => {
    // Re-enable button
    subscribeBtn.disabled = false;
    subscribeBtn.textContent = 'Subscribe';
  });
}

// Show message for newsletter subscription
function showMessage(message, type) {
  const messageElement = document.getElementById('subscriptionMessage');
  messageElement.textContent = message;
  messageElement.style.display = 'block';
  
  if (type === 'success') {
    messageElement.style.color = '#4CAF50';
  } else {
    messageElement.style.color = '#f44336';
  }
  
  // Hide message after 5 seconds
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 5000);
}
