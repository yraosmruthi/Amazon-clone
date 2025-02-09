import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProductsFetch,loadProducts } from "../data/products.js";

//import '../data/backend-practice.js'
 async function loadPage() {
    try{
        await loadProductsFetch();
    } catch (error) {
        console.log('unexpected error. Try later');

    }
    
    renderOrderSummary();
    renderPaymentSummary();
   
}
loadPage();
/*
new Promise((resolve) => {
    loadProducts(()=>{
        resolve();
    });
}).then(() => {
    renderOrderSummary();
    renderPaymentSummary();
});
*/


 