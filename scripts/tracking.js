// tracking.js
import { cart } from '../data/cart.js'
import { getProduct } from '../data/products.js';
import { getDeliveryOption } from '../data/deliveryOptions.js';
import { formatCurrency } from './utils/money.js';
import { loadProducts,loadProductsFetch } from '../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';


document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting tracking...');
    startTracking();
  });
  
  function startTracking() {
    console.log('Initializing tracking page...');
    
    // Use loadProducts with callback to render tracking
    loadProducts(() => {
      console.log('Products loaded successfully');
      initializeTrackingPage();
      
      // Add click handler for back to orders button
      const backButton = document.querySelector('.back-to-orders-link');
      if (backButton) {
        backButton.addEventListener('click', (event) => {
          event.preventDefault();
          window.location.href = 'orders.html';
        });
      }
    });
  }

function initializeTrackingPage() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
     document.querySelector('.js-cart-quantity').textContent = `${totalItems}`;
  // Get orderId and productId from URL parameters
  const urlParams = new URL(window.location.href).searchParams;
  const orderId = urlParams.get('orderId');
  const productId = urlParams.get('productId');

  if (!orderId || !productId) {
    showError('Missing order information');
    return;
  }
  

  // Load the order from localStorage
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const order = orders.find(order => order.orderId === orderId);
  console.log(orderId);

  if (!order) {
    showError('Order not found');
    return;
  }

  // Find the specific item in the order
  const trackingItem = order.items.find(item => item.productId === productId);
  
  if (!trackingItem) {
    showError('Product not found in order');
    return;
  }

  renderTrackingInfo(order, trackingItem);
}

function renderTrackingInfo(order, trackingItem) {
  const product = getProduct(trackingItem.productId);
  const deliveryOption = getDeliveryOption(trackingItem.deliveryOptionId);

  if (!product || !deliveryOption) {
    showError('Product or delivery information not found');
    return;
  }

  // Calculate delivery date
  const deliveryDate = dayjs(order.orderDate)
    .add(deliveryOption.deliveryDays, 'days')
    .format('dddd, MMMM D');

  // Calculate current shipping status based on order date
  const status = calculateShippingStatus(order.orderDate, deliveryOption.deliveryDays);

  // Update the tracking container
  const trackingContainer = document.querySelector('.js-tracking-container');
  if (trackingContainer) {
    trackingContainer.innerHTML = `
      <div class="delivery-date">
        Arriving on ${deliveryDate}
      </div>
    `;
  }

  // Update product information
  updateProductInfo(product, trackingItem.quantity);

  // Update progress bar and status
  updateTrackingStatus(status);
}

function calculateShippingStatus(orderDate, deliveryDays) {
  const now = dayjs();
  const orderDateTime = dayjs(orderDate);
  const deliveryDateTime = orderDateTime.add(deliveryDays, 'days');
  const progressPercentage = Math.min(100, 
    ((now.diff(orderDateTime, 'hour')) / 
    (deliveryDateTime.diff(orderDateTime, 'hour'))) * 100);

  if (progressPercentage <= 33) {
    return 'preparing';
  } else if (progressPercentage <= 66) {
    return 'shipped';
  } else {
    return 'delivered';
  }
}

function updateProductInfo(product, quantity) {
  const productInfoElements = document.querySelectorAll('.product-info');
  if (productInfoElements.length >= 2) {
    productInfoElements[0].textContent = product.name;
    productInfoElements[1].textContent = `Quantity: ${quantity}`;
  }

  const productImage = document.querySelector('.product-image');
  if (productImage) {
    productImage.src = product.image;
    productImage.alt = product.name;
  }
}

function updateTrackingStatus(status) {
  const stages = ['preparing', 'shipped', 'delivered'];
  const currentIndex = stages.indexOf(status);
  
  if (currentIndex === -1) return;

  // Calculate progress percentage
  const progress = ((currentIndex + 1) / stages.length) * 100;
  
  // Update progress bar width
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }

  // Update status labels
  const labels = document.querySelectorAll('.progress-label');
  labels.forEach((label, index) => {
    if (index <= currentIndex) {
      label.classList.add('current-status');
    } else {
      label.classList.remove('current-status');
    }
  });
}

function showError(message) {
  const trackingContainer = document.querySelector('.order-tracking');
  if (trackingContainer) {
    trackingContainer.innerHTML = `
      <div class="error-message">
        ${message}
      </div>
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>
    `;
  }
}
