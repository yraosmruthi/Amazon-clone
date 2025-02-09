 export let cart=JSON.parse(localStorage.getItem('cart'));
 if (!cart){
    cart=[{
       productId:'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
       quantity:2,
       deliveryOptionId:'1'
      
     },
    {
        productId:'15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity:1,
        deliveryOptionId:'2'
    }];
    // if (window.location.pathname === "/checkout.html") {
    //     document.body.innerHTML = '<p>cart empty</p>';
    // }
    
    

}
 
 
function saveToStorage(){
    localStorage.setItem('cart',JSON.stringify(cart));
}
 export function AddToCart(productId) {
    let matchingitem;

    cart.forEach((item)=>{
        if(productId===item.productId){
            matchingitem=item;
        }
    });
    if(matchingitem){
        matchingitem.quantity+=1;
    }else{
        cart.push({
            productId:productId,
            quantity:1,
            deliveryOptionId:1
        });
        }
        saveToStorage();
    }

    export function removeFromCart(productId){
        const NewCart=[];
        cart.forEach((item)=>{
            if(item.productId !== productId){
                NewCart.push(item);
            }
            
        });
        cart=NewCart;
        saveToStorage();
     }

   export  function updateDeliveryOption(productId,deliveryOptionId){
        let matchingitem;

        cart.forEach((item)=>{
            if(productId === item.productId){
                matchingitem=item;
            }
        });
        matchingitem.deliveryOptionId = deliveryOptionId;
        saveToStorage();
     }
