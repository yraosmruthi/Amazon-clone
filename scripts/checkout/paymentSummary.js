 import {cart} from '../../data/cart.js';
 import { getProduct} from '../../data/products.js';
 import { getDeliveryOption } from '../../data/deliveryOptions.js';
 import { formatCurrency } from '../utils/money.js';
 import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

 
 
 export function renderPaymentSummary(){
    let productPriceCents =0;
    let shippingPriceCents = 0;
    cart.forEach((item) => {
        const product=getProduct(item.productId);
        productPriceCents += product.priceCents * item.quantity

        const deliveryOption = getDeliveryOption(item.deliveryOptionId);
        shippingPriceCents+=deliveryOption.priceCents;


        
    });
    const totalBeforeTaxCents = productPriceCents+shippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.1;
    const totalCents = totalBeforeTaxCents+taxCents;
    
    const paymentSummaryHTML=`
    <div class="payment-summary">
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div class="js-no-of-items"></div>
            <div class="payment-summary-money">
            $${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">
            $${formatCurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">
            $${formatCurrency(totalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">
            $${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">
            $${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary js-place-order">
            Place your order
          </button>
    `;
    document.querySelector('.js-payment-summary').innerHTML=paymentSummaryHTML;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.js-no-of-items').textContent = `Items(${totalItems}):`;
  
//     document.querySelector('.js-place-order')
//     .addEventListener('click', async () => {
//       try {
//         const response = await fetch('https://supersimplebackend.dev/orders', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             cart: cart
//           })
//         });

//         const order = await response.json();
//         console.log(order);
//         //addOrder(order);

//       } catch (error) {
//         console.log('Unexpected error. Try again later.');
//       }

//       //window.location.href = 'orders.html';
//     });
// }

document.querySelector('.js-place-order').addEventListener('click', () => {
  // Create order from current cart
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  
  // Make sure we have product data
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }

  // Validate all products exist before creating order
  const validOrder = cart.every(item => {
    const product = getProduct(item.productId);
    const deliveryOption = getDeliveryOption(item.deliveryOptionId);
    return product && deliveryOption;
  });

  if (!validOrder) {
    alert('Some items in your cart are no longer available');
    return;
  }
  
  const newOrder = {
    orderId: generateOrderId(),
    orderDate: dayjs().format('MMMM D, YYYY'),
    items: cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      deliveryOptionId: item.deliveryOptionId
    }))
  };
  
  orders.push(newOrder);
  
  // Save to localStorage
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // Clear cart and cart data in localStorage
  localStorage.removeItem('cart');
  
  // Navigate to orders page
  window.location.href = 'orders.html';
});
function generateOrderId() {
  return Math.random().toString(36).substr(2, 9);
}
 }
    
  
  
