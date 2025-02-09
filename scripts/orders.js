import { cart } from '../data/cart.js';
import { products,getProduct } from '../data/products.js';
import { getDeliveryOption } from '../data/deliveryOptions.js';
import { formatCurrency } from './utils/money.js';
import { loadProductsFetch,loadProducts } from "../data/products.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

// 

function initializeOrdersPage() {
  console.log('Initializing orders page...');
  
  // Use loadProducts with callback to render orders
  loadProducts(() => {
    console.log('Products loaded successfully');
    renderOrders();
  });
}

function renderOrders() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  console.log('Orders from localStorage:', orders);

  if (!orders.length) {
    document.querySelector('.orders-grid').innerHTML = 
      '<p>No orders found.</p>';
    return;
  }

  let ordersHTML = '';

  orders.forEach((order) => {
    if (!order.items || !Array.isArray(order.items)) {
      console.log('Invalid order format:', order);
      return;
    }

    let orderItemsHTML = '';
    let orderTotal = 0;

    order.items.forEach(item => {
      const product = getProduct(item.productId);
      if (!product) {
        console.error(`Product not found for ID: ${item.productId}`);
        return;
      }

      const deliveryOption = getDeliveryOption(item.deliveryOptionId);
      if (!deliveryOption) {
        console.error(`Delivery option not found for ID: ${item.deliveryOptionId}`);
        return;
      }

      // Add to order total
      orderTotal += (product.priceCents * item.quantity) + deliveryOption.priceCents;

      // Calculate delivery date
      const deliveryDate = dayjs().add(deliveryOption.deliveryDays, 'days').format('dddd, MMMM D');

      orderItemsHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${deliveryDate}
          </div>
          <div class="product-quantity">
            Quantity: ${item.quantity}
          </div>
          <button class="buy-again-button button-primary">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
           <a href="tracking.html?orderId=${order.orderId}&productId=${item.productId}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    if (orderItemsHTML) {  // Only add order container if there are valid items
      ordersHTML += `
        <div class="order-container">
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${order.orderDate}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(orderTotal)}</div>
              </div>
            </div>
            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.orderId}</div>
            </div>
          </div>

          <div class="order-details-grid">
            ${orderItemsHTML}
          </div>
        </div>
      `;
    }
  });

  const ordersContainer = document.querySelector('.orders-grid');
  if (ordersContainer) {
    ordersContainer.innerHTML = ordersHTML || '<p>No valid orders found</p>';
  } else {
    console.log('Could not find orders-grid container');
  }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing page...');
  initializeOrdersPage();
});